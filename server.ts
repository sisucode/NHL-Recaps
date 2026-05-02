import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import * as cheerio from "cheerio";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Simple proxy for NHL APIs to bypass CORS
  app.get("/api/nhl/web/*", async (req, res) => {
    try {
      const targetUrl = `https://api-web.nhle.com/${req.params[0]}`;
      // pass query string along
      const query = new URLSearchParams(req.query as any).toString();
      const finalUrl = query ? `${targetUrl}?${query}` : targetUrl;
      const response = await fetch(finalUrl);
      if (!response.ok) {
        return res.status(response.status).send(response.statusText);
      }
      const data = await response.json();
      res.json(data);
    } catch (e: any) {
      console.error("Proxy error:", e);
      res.status(500).json({ error: "Proxy fetch failed" });
    }
  });

  app.get("/api/nhl/stats/*", async (req, res) => {
    try {
      const targetUrl = `https://api.nhle.com/${req.params[0]}`;
      const query = new URLSearchParams(req.query as any).toString();
      const finalUrl = query ? `${targetUrl}?${query}` : targetUrl;
      const response = await fetch(finalUrl);
      if (!response.ok) {
        return res.status(response.status).send(response.statusText);
      }
      const data = await response.json();
      res.json(data);
    } catch (e: any) {
      console.error("Proxy error:", e);
      res.status(500).json({ error: "Proxy fetch failed" });
    }
  });

  app.get("/api/nhl-news", async (req, res) => {
    try {
      const response = await fetch("https://www.nhl.com/sv/news/");
      const html = await response.text();
      
      const $ = cheerio.load(html);
      const links: { title: string, url: string }[] = [];
      
      // Attempt to extract news links from page
      $('a').each((i, el) => {
         const href = $(el).attr('href');
         if (href && href.includes('/news/') && !href.includes('/rss/')) {
           const title = $(el).text().trim();
           if (title.length > 20) {
             const fullUrl = href.startsWith("http") ? href : \`https://www.nhl.com\${href}\`;
             links.push({ title, url: fullUrl });
           }
         }
      });
      // Deduplicate
      const uniqueLinks = Array.from(new Map(links.map(l => [l.url, l])).values()).slice(0, 5);

      if (process.env.GEMINI_API_KEY && uniqueLinks.length > 0) {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const prompt = \`
          Du är en NHL-skribent. Ge mig en kort 2-meningars intressant och unik sammanfattning på svenska
          för följande NHL-nyheter. Returnera endast ett JSON Array av objekt, där objekten har
          fält: "title", "url", "summary", "tag", "date".
          Länkar:\n\${uniqueLinks.map(l => l.title + " - " + l.url).join("\\n")}
        \`;
        try {
          const completion = await ai.models.generateContent({
             model: "gemini-2.5-flash",
             contents: prompt,
             config: {
               responseMimeType: "application/json",
             }
          });
          const text = completion.text;
          if (text) {
             const result = JSON.parse(text);
             return res.json(result);
          }
        } catch(aiError) {
           console.error("AI summarization failed:", aiError);
        }
      }

      // Fallback if no AI or failed AI
      const mockResult = uniqueLinks.map(l => ({
        title: l.title,
        url: l.url,
        summary: "En kort sammanfattning av nyheten från NHL.",
        tag: "NHL",
        date: new Date().toISOString()
      }));
      
      if (mockResult.length > 0) {
        return res.json(mockResult);
      } else {
        // Super fallback if scraper fails
        res.json([
          {
             title: "Uppdateringar från senaste NHL-omgången",
             url: "https://www.nhl.com/sv/news",
             summary: "Många lag bjöd på stor dramatik under helgens matcher.",
             tag: "Matchrapport",
             date: new Date().toISOString()
          }
        ]);
      }
    } catch (e: any) {
      console.error("News proxy error:", e);
      res.status(500).json({ error: "Failed to fetch news" });
    }
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(\`Server running on http://localhost:\${PORT}\`);
  });
}

startServer();
