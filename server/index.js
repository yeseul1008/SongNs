// REACT-SNS-SAMPLE/server/index.js
const express = require("express");
const fetch = require("node-fetch"); // node-fetch v2 사용 권장
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const API_ROOT = "https://ws.audioscrobbler.com/2.0/";
const API_KEY = process.env.LASTFM_API_KEY;

// 트랙 검색 프록시
app.get("/api/search", async (req, res) => {
  const keyword = req.query.q;
  if (!keyword) return res.status(400).json({ error: "Missing query" });

  try {
    const url = `${API_ROOT}?method=track.search&track=${encodeURIComponent(
      keyword
    )}&api_key=${API_KEY}&format=json&limit=20`;

    const response = await fetch(url);
    const json = await response.json();

    
    // 안전하게 배열로 반환
    const tracks = json?.results?.trackmatches?.track || [];
    res.json(tracks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// 상세 조회 프록시
app.get("/api/detail", async (req, res) => {
  const { artist, name } = req.query;
  if (!artist || !name) return res.status(400).json({ error: "Missing artist or name" });

  try {
    const url = `${API_ROOT}?method=track.getInfo&artist=${encodeURIComponent(
      artist
    )}&track=${encodeURIComponent(name)}&api_key=${API_KEY}&format=json`;

    const response = await fetch(url);
    const json = await response.json();
    res.json(json.track || {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log("Server running on port", PORT));
