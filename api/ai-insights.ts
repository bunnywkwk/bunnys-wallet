import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type } from '@google/genai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(400).json({
        error: 'GEMINI_API_KEY environment variable is missing in Vercel project settings.',
      });
    }

    const { transactions = [], accounts = [], categories = [], currencySymbol = '₱' } = req.body || {};

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
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
        category: categories.find((c: any) => c.id === t.categoryId)?.name || 'General',
        name: t.name,
        date: t.timestamp,
      }))
    )}

Please evaluate spending efficiency, cash flow balance, potential savings, and risk factors.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction:
          "You are a top-tier personal financial advisor and wealth manager. Return a friendly, direct, JSON object analyzing the user's wallet with exact field schema.",
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: 'Executive summary of the wallet state (2 concise sentences).',
            },
            healthScore: {
              type: Type.INTEGER,
              description: 'Financial health rating score from 0 to 100 based on income vs expense ratio.',
            },
            topSpendingCategory: {
              type: Type.STRING,
              description: 'Name of the highest spending category.',
            },
            savingsRatePercentage: {
              type: Type.NUMBER,
              description: 'Estimated savings percentage (income minus expenses / income).',
            },
            actionableTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3 highly specific, actionable advice points.',
            },
            monthlyForecast: {
              type: Type.STRING,
              description: 'End-of-month projected cash balance outlook.',
            },
          },
          required: ['summary', 'healthScore', 'topSpendingCategory', 'savingsRatePercentage', 'actionableTips', 'monthlyForecast'],
        },
      },
    });

    if (!response.text) {
      throw new Error('No response text returned from Gemini API');
    }

    const insightData = JSON.parse(response.text.trim());
    return res.status(200).json({ success: true, insight: insightData });
  } catch (err: any) {
    console.error('Vercel AI Insights Error:', err);
    return res.status(500).json({
      error: 'Failed to generate financial insights',
      details: err?.message || String(err),
    });
  }
}
