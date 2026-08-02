const routes = {
  GET: [],
  POST: [],
  PUT: [],
  DELETE: [],
  PATCH: [],
};

function registerRoute(method, path, handler) {
  const normalizedMethod = method.toUpperCase();
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
