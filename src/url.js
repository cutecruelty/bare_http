function parseUrl(rawUrl) {
  const [path, queryString] = rawUrl.split("?");

  const query = {};
  if (queryString) {
    for (const pair of queryString.split("&")) {
      const [key, value] = pair.split("=");
      query[key] = value;
    }
  }

  return { path, query };
}

function matchPath(routePath, incomingPath) {
  const routeParts = routePath.split("/");
  const incomingParts = incomingPath.split("/");

  if (routeParts.length !== incomingParts.length) return null;

  const params = {};

  for (let i = 0; i < routeParts.length; i++) {
    const routePart = routeParts[i];
    const incomingPart = incomingParts[i];

    if (routePart.startsWith(":")) {
      params[routePart.slice(1)] = incomingPart;
    } else if (routePart !== incomingPart) {
      return null;
    }
  }

  return params;
}

module.exports = { parseUrl, matchPath };
