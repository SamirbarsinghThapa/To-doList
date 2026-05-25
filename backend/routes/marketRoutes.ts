import { Router, Request, Response } from "express";

const router = Router();

const ENDPOINTS = [
  "https://clob.polymarket.com/markets",
  "https://gamma-api.polymarket.com/events",
];

router.get("/events", async (req: Request, res: Response) => {
  const params = new URLSearchParams(req.query as Record<string, string>);

  for (const base of ENDPOINTS) {
    try {
      const url = `${base}?${params.toString()}`;
      console.log(`[markets] trying: ${url}`);

      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          "Accept": "application/json",
          "Accept-Language": "en-US,en;q=0.9",
        },
        signal: AbortSignal.timeout(8000),
      });

      console.log(`[markets] response status: ${response.status}`);

      if (response.ok) {
        const data = await response.json();
        res.json(data);
        return;
      }
    } catch (err) {
      console.error(`[markets] failed for ${base}:`, err);
    }
  }

  res.status(500).json({ error: "All Polymarket endpoints failed" });
});

export default router;