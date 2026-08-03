const { parseUrl, matchPath } = require("../src/url.js");
const { registerRoute, handleRequest } = require("../src/router.js");

function mockResponse() {
  const res = { statusCode: null, body: null, headers: null };
  res.writeHead = jest.fn(function (statusCode, headers) {
    res.statusCode = statusCode;
    res.headers = headers;
  });
  res.end = jest.fn(function (body) {
    res.body = body;
  });
  return res;
}

function request(method, url) {
  const req = { method, url };
  req.headers = {};
  return req;
}

describe("parseUrl", () => {
  test("splits path and query string", () => {
    expect(parseUrl("/users?id=5&sort=name")).toEqual({
      path: "/users",
      query: { id: "5", sort: "name" },
    });
  });

  test("handles a path with no query string", () => {
    expect(parseUrl("/users")).toEqual({ path: "/users", query: {} });
  });
});

describe("matchPath", () => {
  test("matches a static path", () => {
    expect(matchPath("/users", "/users")).toEqual({});
  });

  test("captures dynamic segments", () => {
    expect(matchPath("/users/:id", "/users/5")).toEqual({ id: "5" });
  });

  test("captures multiple dynamic segments", () => {
    expect(matchPath("/users/:id/posts/:postId", "/users/5/posts/9")).toEqual({
      id: "5",
      postId: "9",
    });
  });

  test("returns null on a static mismatch", () => {
    expect(matchPath("/users/:id", "/orders/5")).toBeNull();
  });

  test("returns null on length mismatch", () => {
    expect(matchPath("/users/:id", "/users")).toBeNull();
  });
});

describe("handleRequest", () => {
  test("sets req.params and req.query, and runs the handler", () => {
    const handler = jest.fn();
    registerRoute("GET", "/users/:id", handler);

    const req = request("GET", "/users/5?id=7");
    const res = mockResponse();
    handleRequest(req, res);

    expect(req.params).toEqual({ id: "5" });
    expect(req.query).toEqual({ id: "7" });
    expect(handler).toHaveBeenCalledWith(
      req,
      res,
      expect.any(Function)
    );
  });

  test("runs middleware in order before the handler", () => {
    const order = [];
    const first = jest.fn((req, res, next) => {
      order.push("first");
      next();
    });
    const second = jest.fn((req, res, next) => {
      order.push("second");
      next();
    });
    const handler = jest.fn(() => {
      order.push("handler");
    });
    registerRoute("GET", "/chain", first, second, handler);

    const req = request("GET", "/chain");
    const res = mockResponse();
    handleRequest(req, res);

    expect(order).toEqual(["first", "second", "handler"]);
  });

  test("stops the chain when middleware never calls next()", () => {
    const auth = jest.fn((req, res) => {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end("Unauthorized");
    });
    const handler = jest.fn();
    registerRoute("GET", "/protected", auth, handler);

    const req = request("GET", "/protected");
    const res = mockResponse();
    handleRequest(req, res);

    expect(auth).toHaveBeenCalled();
    expect(handler).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(401);
  });

  test("responds 404 when no route matches", () => {
    const req = request("GET", "/nope");
    const res = mockResponse();
    handleRequest(req, res);

    expect(res.statusCode).toBe(404);
  });

  test("throws on an unsupported method", () => {
    expect(() => registerRoute("BREW", "/x", () => {})).toThrow(
      "unsupported method: BREW!"
    );
  });
});
