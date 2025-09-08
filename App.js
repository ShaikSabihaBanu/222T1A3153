import React, { useState } from "react";
import { log } from "./loggingMiddleware";
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
function App() {
  const [inputUrl, setInputUrl] = useState("");
  const [validity, setValidity] = useState("");
  const [shortcode, setShortcode] = useState("");
  const [urls, setUrls] = useState([]);
  const [error, setError] = useState("");
  const generateShortCode = () => Math.random().toString(36).substring(2, 8);
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (urls.length >= 5) {
      setError("You can only shorten up to 5 URLs at a time.");
      log("frontend", "warn", "url-shortener", "User tried to add more than 5 URLs");
      return;
    }
    if (!isValidUrl(inputUrl)) {
      setError("Please enter a valid URL.");
      log("frontend", "error", "url-shortener", "Invalid URL entered");
      return;
    }
    let expiry = null;
    if (validity) {
      const mins = parseInt(validity, 10);
      if (isNaN(mins) || mins <= 0) {
        setError("Validity period must be a positive integer.");
        log("frontend", "error", "url-shortener", "Invalid validity period entered");
        return;
      }
      expiry = new Date(Date.now() + mins * 60000);
    }
    let code = shortcode.trim() || generateShortCode();
    if (urls.some((item) => item.short === code)) {
      setError("Shortcode already used. Please choose another.");
      log("frontend", "error", "url-shortener", "Duplicate shortcode entered");
      return;
    }
    setUrls([
      {
        original: inputUrl,
        short: code,
        created: new Date(),
        expiry: expiry,
      },
      ...urls,
    ]);
    log("frontend", "info", "url-shortener", `User created a new short URL: ${code}`);
    setInputUrl("");
    setValidity("");
    setShortcode("");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial", maxWidth: 600, margin: "auto" }}>
      <h1>URL Shortener</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <div>
          <input
            type="url"
            placeholder="Enter original URL"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            required
            style={{ width: "60%", marginRight: 10 }}
          />
        </div>
        <div style={{ marginTop: 10 }}>
          <input
            type="text"
            placeholder="Optional validity (minutes)"
            value={validity}
            onChange={(e) => setValidity(e.target.value)}
            style={{ width: 180, marginRight: 10 }}
          />
          <input
            type="text"
            placeholder="Optional preferred shortcode"
            value={shortcode}
            onChange={(e) => setShortcode(e.target.value)}
            style={{ width: 200, marginRight: 10 }}
          />
          <button type="submit">Shorten</button>
        </div>
        {error && <div style={{ color: "red", marginTop: 10 }}>{error}</div>}
      </form>
      <h2>Shortened URLs</h2>
      <ul>
        {urls.map((item, idx) => (
          <li key={idx} style={{ marginBottom: 10 }}>
            <div>
              <b>Original:</b>{" "}
              <a href={item.original} target="_blank" rel="noopener noreferrer">
                {item.original}
              </a>
            </div>
            <div>
              <b>Shortened:</b>{" "}
              <a href={item.original} target="_blank" rel="noopener noreferrer">
                {window.location.origin}/{item.short}
              </a>
            </div>
            <div>
              <b>Created:</b> {item.created.toLocaleString()}
            </div>
            <div>
              <b>
                Expiry:
              </b>{" "}
              {item.expiry ? item.expiry.toLocaleString() : "No expiry"}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;