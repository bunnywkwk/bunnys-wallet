import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "2mb" }));

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // AI Financial Insights powered by Gemini 3.6 Flash
  app.post("/api/ai-insights", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({
          error: "GEMINI_API_KEY environment variable is missing. Please configure it in Settings Secrets.",
        });
      }

      const { transactions = [], accounts = [], categories = [], currencySymbol = "₱" } = req.body;

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const prompt = `Analyze this personal financial snapshot and return a structured JSON report:
Currency Symbol: ${currencySymbol}
Total Accounts: ${accounts.length}
Accounts Overview: ${JSON.stringify(accounts.map((a: any) => ({ name: a.name, type: a.type, balance: a.balance })))}
Recent Transactions (${transactions.length} items): ${JSON.stringify(
        transactions.slice(0, 20).map((t: any) => ({
          type: t.type,
          amount: t.amount,
          category: categories.find((c: any) => c.id === t.categoryId)?.name || "General",
          name: t.name,
          date: t.timestamp,
        }))
      )}

Please evaluate spending efficiency, cash flow balance, potential savings, and risk factors.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction:
            "You are a top-tier personal financial advisor and wealth manager. Return a friendly, direct, JSON object analyzing the user's wallet with exact field schema.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: {
                type: Type.STRING,
                description: "Executive summary of the wallet state (2 concise sentences).",
              },
              healthScore: {
                type: Type.INTEGER,
                description: "Financial health rating score from 0 to 100 based on income vs expense ratio.",
              },
              topSpendingCategory: {
                type: Type.STRING,
                description: "Name of the highest spending category.",
              },
              savingsRatePercentage: {
                type: Type.NUMBER,
                description: "Estimated savings percentage (income minus expenses / income).",
              },
              actionableTips: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "3 highly specific, actionable advice points.",
              },
              monthlyForecast: {
                type: Type.STRING,
                description: "End-of-month projected cash balance outlook.",
              },
            },
            required: ["summary", "healthScore", "topSpendingCategory", "savingsRatePercentage", "actionableTips", "monthlyForecast"],
          },
        },
      });

      if (!response.text) {
        throw new Error("No response text returned from Gemini API");
      }

      const insightData = JSON.parse(response.text.trim());
      res.json({ success: true, insight: insightData });
    } catch (err: any) {
      console.error("AI Insights Error:", err);
      res.status(500).json({
        error: "Failed to generate financial insights",
        details: err?.message || String(err),
      });
    }
  });

  // Vite middleware in development vs static serving in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, allowedHosts: ['.loca.lt', '.ngrok-free.app', 'localhost', '127.0.0.1'] },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Vault Wallet Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
