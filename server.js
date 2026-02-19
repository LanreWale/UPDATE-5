// server.js — Empire unified backend (Validation + Payout)

import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";
import crypto from "crypto";

// Bank registry
import { NIGERIAN_BANKS } from "./src/utils/nigerianBanks.js";

// Payout handler
import { executePayoutHandler } from "./server/core/payoutOrchestrator.js";

dotenv.config();

const app = express();

// ==============================
// MIDDLEWARE
// ==============================
app.use(express.json({ limit: "1mb" }));

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ==============================
// STARTUP DIAGNOSTICS
// ==============================
console.log(
  "PAYSTACK KEY LOADED:",
  process.env.PAYSTACK_SECRET_KEY
    ? `${process.env.PAYSTACK_SECRET_KEY.slice(0, 8)}...`
    : "MISSING"
);

console.log(
  "CHIMONEY KEY LOADED:",
  process.env.CHIMONEY_SECRET_KEY
    ? `${process.env.CHIMONEY_SECRET_KEY.slice(0, 8)}...`
    : "MISSING"
);

console.log("BANK LIST LOADED:", NIGERIAN_BANKS?.length || 0);

if (!NIGERIAN_BANKS || NIGERIAN_BANKS.length === 0) {
  console.error(
    "ERROR: Failed to load bank list. Check import path: ./src/utils/nigerianBanks.js"
  );
}

if (!process.env.PAYSTACK_SECRET_KEY) {
  console.warn(
    "WARNING: PAYSTACK_SECRET_KEY not set. Validation calls will fail."
  );
}

if (!process.env.CHIMONEY_SECRET_KEY) {
  console.warn(
    "WARNING: CHIMONEY_SECRET_KEY not set. Payouts will fail."
  );
}

// ==============================
// PAYSTACK MULTI-MATCH VALIDATION (with strict early exit)
// ==============================
app.post("/api/validate-recipient", async (req, res) => {
  console.log('[SERVER] Received validate-recipient request - body:', req.body);

  try {
    const accountNumber = (
      req.body.account_number ||
      req.body.accountIdentifier ||
      ""
    )
      .toString()
      .trim();

    if (!accountNumber) {
      return res.status(400).json({
        success: false,
        message: "Missing or invalid account_number",
      });
    }

    const account = accountNumber;
    console.log(`[VALIDATE] Searching platforms for: ${account}`);

    // Prioritize fintechs (fastest matches)
    const popularFintechCodes = [
      "999992", // Opay
      "999991", // PalmPay
      "50515",  // Moniepoint
      "50211",  // Kuda
      "100002", // Paga
      "120004"  // Airtel Smartcash
    ];

    const sortedBanks = [...NIGERIAN_BANKS].sort((a, b) => {
      const aIdx = popularFintechCodes.indexOf(a.code);
      const bIdx = popularFintechCodes.indexOf(b.code);
      return (aIdx === -1 ? 9999 : aIdx) - (bIdx === -1 ? 9999 : bIdx);
    });

    const matches = [];
    const MAX_FINTECH = 5;   // Stop after 5 fintech matches
    const MAX_OVERALL = 12;  // Hard safety limit
    let fintechCount = 0;

    for (const bank of sortedBanks) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 7000);

        const url = `https://api.paystack.co/bank/resolve?account_number=${encodeURIComponent(
          account
        )}&bank_code=${encodeURIComponent(bank.code)}`;

        console.log(`[FETCH] Trying ${bank.name} (${bank.code})`);

        const r = await fetch(url, {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            Accept: "application/json",
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!r.ok) continue;

        const data = await r.json();

        if (data.status === true && data.data?.account_name?.trim()) {
          console.log(
            `[MATCH] ${bank.name} (${bank.code}) -> ${data.data.account_name}`
          );

          const isFintech = popularFintechCodes.includes(bank.code) ||
                            bank.code.startsWith("999") ||
                            bank.code.startsWith("50") ||
                            bank.code.startsWith("120");

          matches.push({
            name: data.data.account_name.trim(),
            institution: data.data.bank_name || bank.name,
            code: bank.code,
            rail: isFintech ? "fintech" : "bank",
          });

          if (isFintech) fintechCount++;

          // STRICT EARLY EXIT — check RIGHT AFTER adding a match
          if (isFintech && fintechCount >= MAX_FINTECH) {
            console.log(`Quick fintech exit after ${fintechCount} fintech matches`);
            break;
          }

          if (matches.length >= MAX_OVERALL) {
            console.log(`Hard limit reached: ${matches.length} total matches`);
            break;
          }
        }
      } catch (innerErr) {
        if (innerErr?.name === "AbortError") {
          console.warn(`Timeout on ${bank.name} (${bank.code})`);
        } else {
          console.warn(
            `Error resolving ${bank.name} (${bank.code}):`,
            innerErr?.message || innerErr
          );
        }
      }

      await new Promise((r) => setTimeout(r, 180));
    }

    if (matches.length === 0) {
      console.log(`[NOT FOUND] No matches for ${account}`);
      return res.status(404).json({
        success: false,
        message:
          "Could not resolve account name on any platform. Please check the number.",
      });
    }

    const intentId = crypto.randomUUID();

    console.log(`[COMPLETE] Found ${matches.length} matches for ${account}`);

    return res.json({
      success: true,
      recipient: matches[0],
      matches,
      count: matches.length,
      intentId,
    });
  } catch (err) {
    console.error("[VALIDATE] Server error:", err?.message || err);
    return res.status(500).json({
      success: false,
      message: "Validation service unavailable. Please try again later.",
    });
  }
});

// ===============================
 // CHIMONEY EXECUTION ROUTE
// ===============================
app.post("/api/payout/execute", executePayoutHandler);

// ===============================
 // HEALTH CHECK
// ===============================
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// ===============================
 // JSON 404 CATCH-ALL
// ===============================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Not found",
  });
});

// ===============================
 // START SERVER
// ===============================
const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`Empire API running on http://localhost:${PORT}`);
  console.log(`Validation: POST http://localhost:${PORT}/api/validate-recipient`);
  console.log(`Payout:     POST http://localhost:${PORT}/api/payout/execute`);
});