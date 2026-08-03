function sendJson(res, statusCode, data) {
  const body = JSON.stringify(data);

  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(body);
}

module.exports = { sendJson };
