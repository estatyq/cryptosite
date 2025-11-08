import express from "express";
import compression from "compression";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, "../frontend/dist");

const app = express();
const port = process.env.PORT || 3000;

app.use(compression());
app.use(
  express.static(distPath, {
    maxAge: "1y",
    setHeaders(res, assetPath) {
      if (assetPath.endsWith("index.html")) {
        res.setHeader("Cache-Control", "no-cache");
      }
    }
  })
);

app.get("/healthz", (_, res) => {
  res.json({ status: "ok" });
});

app.get("*", (_, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(port, () => {
  console.log(`MF PRIME CLUB server listening on http://localhost:${port}`);
});

