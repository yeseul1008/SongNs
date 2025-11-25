// REACT-SNS-SAMPLE/src/components/MusicSearch.js
import React, { useState, useEffect } from "react";

export default function MusicSearch() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 디바운스: 입력 멈춘 뒤 400ms 후 검색
  useEffect(() => {
    if (!q) {
      setResults([]);
      setError(null);
      return;
    }
    const id = setTimeout(() => performSearch(q), 400);
    return () => clearTimeout(id);
  }, [q]);

  const performSearch = async (keyword) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:4000/api/search?q=${encodeURIComponent(keyword)}`);
      if (!res.ok) throw new Error("검색 실패");
      const data = await res.json();
      // Last.fm은 객체 또는 배열 반환 가능 -> 배열로 맞춤
      setResults(Array.isArray(data) ? data : [data]);
    } catch (e) {
      console.error(e);
      setError(e.message || "검색 중 오류 발생");
    } finally {
      setLoading(false);
    }
  };

const getDetail = async (artist, name) => {
  try {
    const res = await fetch(
      `http://localhost:4000/api/detail?artist=${encodeURIComponent(artist)}&name=${encodeURIComponent(name)}`
    );
    const data = await res.json();

    // 안전하게 track 객체 체크
    const track = data.track || {};
    const trackName = track.name || name;
    const trackArtist = track.artist?.name || artist;
    const mbid = track.mbid && track.mbid.trim() !== "" 
                  ? track.mbid 
                  : `${trackArtist}-${trackName}`; // mbid 없으면 artist-track 조합

    alert(`트랙: ${trackName}\n아티스트: ${trackArtist}\n트랙ID: ${mbid}`);
  } catch (e) {
    console.error(e);
    alert("상세정보 불러오기 실패");
  }
};


  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
      <h2>🎧 음악 검색 (Last.fm)</h2>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="곡명 또는 아티스트 입력"
        style={{ width: "100%", padding: 10, fontSize: 16 }}
      />
      {loading && <p>검색 중...</p>}
      {error && <p style={{color: "red"}}>{error}</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {results.map((t, idx) => (
          <li key={idx} style={{ display: "flex", gap: 12, padding: 12, borderBottom: "1px solid #eee", alignItems: "center" }}>
            <img
              src={t.image?.[2]?.["#text"] || ""}
              alt=""
              width={64}
              height={64}
              onError={(e) => (e.target.style.display = "none")}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700 }}>{t.name}</div>
              <div style={{ color: "#666" }}>{t.artist}</div>
            </div>
            <div>
              <button onClick={() => getDetail(t.artist, t.name)}>상세</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
