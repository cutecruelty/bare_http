const { parseUrl, matchPath } = require("./url.js");
const { runHandlers } = require("./middleware.js");

const routes = {
  GET: [],
  POST: [],
  PUT: [],
  DELETE: [],
  PATCH: [],
};

function registerRoute(method, path, ...handlers) {
  if (
    typeof method !== "string" ||
    typeof path !== "string" ||
    handlers.length === 0 ||
    handlers.some((handler) => typeof handler !== "function")
  ) {
    throw new Error("invalid arguments to registerRoute");
  }

  const normalizedMethod = method.toUpperCase();

  if (!routes[normalizedMethod]) {
    throw new Error(`unsupported method: ${method}!`);
  }
  routes[normalizedMethod].push({ path, handlers });
}

function handleRequest(req, res) {
  const { path, query } = parseUrl(req.url);

  let match = null;
  let params = null;

  for (const route of routes[req.method] || []) {
    const result = matchPath(route.path, path);
    if (result !== null) {
      match = route;
      params = result;
      break;
    }
  }

  if (match) {
    req.params = params;
    req.query = query;
    runHandlers(match.handlers, req, res);
  } else {
    res.writeHead(404);
    res.end("Not found!");
  }
}

module.exports = { registerRoute, handleRequest };
