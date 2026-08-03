# bare-http

tiny http framework built on raw node `http`, no express. building it from scratch to actually understand what express hides from you.

## why

i wanna learn this in much detail as i could

## what's actually in here

- `router.js` — registers routes per method (GET/POST/PUT/DELETE/PATCH), matches incoming requests against them
- `url.js` — splits `req.url` into path + query string, matches dynamic segments like `/users/:id`
- `middleware.js` — runs an array of handlers in order, `next()` moves to the next one, not calling it stops the chain
- `parseBody.js` — reads the request body off the stream chunk by chunk, parses it as json
- `sendJson.js` — sets content-type, stringifies, sends, so you're not writing `res.writeHead`/`res.end` by hand everywhere
- `server.js` — the actual `http.createServer`, wires everything together

## how routing works

```js
registerRoute("GET", "/users/:id", requireAuth, (req, res) => {
  sendJson(res, 200, { id: req.params.id });
});
```

middleware and handler are just functions with `(req, res, next)`. stick as many in front of the real handler as you want, last one doesn't need to call `next()`.

```
node src/server.js
```

use postman for this.
