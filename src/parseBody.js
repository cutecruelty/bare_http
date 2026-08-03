function parseBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];

    req.on("error", (err) => {
      reject(err);
    });

    req.on("data", (chunk) => {
      chunks.push(chunk);
    });

    req.on("end", () => {
      const fullBody = Buffer.concat(chunks).toString();
      resolve(fullBody);
    });
  });
}

module.exports = { parseBody };
