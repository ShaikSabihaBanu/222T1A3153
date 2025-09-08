// filepath: src/loggingMiddleware.js
export async function log(stack, level, pkg, message) {
  const logEntry = {
    stack,
    level,
    package: pkg,
    message,
    timestamp: new Date().toISOString()
  };

  try {
    await fetch("http://20.244.56.144/evaluation-service/log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(logEntry)
    });
    console.log(`[${level.toUpperCase()}] [${pkg}] ${message}`);
  } catch (err) {
    console.error("Failed to send log:", err);
  }
}