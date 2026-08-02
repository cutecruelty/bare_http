const routes = {
  GET: [],
  POST: [],
  PUT: [],
  DELETE: [],
  PATCH: [],
};

function registerRoute(method, path, handler) {
  if (
    typeof method !== "string" ||
    typeof path !== "string" ||
    typeof handler !== "function"
  ) {
    throw new Error("invalid arguments to registerRoute");
  }

  const normalizedMethod = method.toUpperCase();

  if (!routes[normalizedMethod]) {
    throw new Error(`unsupported method: ${method}!`);
  }
  routes[normalizedMethod].push({ path, handler });
}

function handleRequest(req, res) {
  const match = routes[req.method].find((route) => route.path === req.url);

  if (match) {
    match.handler(req, res);
  } else {
    res.writeHead(404);
    res.end("Not found!");
  }
}

module.exports = { registerRoute, handleRequest };
