const { registerRoute, handleRequest } = require("./router.js");

const http = require("node:http");

const PORT = 3000;

const server = http.createServer((req, res) => {
  handleRequest(req, res);
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
