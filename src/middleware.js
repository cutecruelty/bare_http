function runHandlers(handlers, req, res) {
  let index = 0;

  function next() {
    const current = handlers[index];
    index++;
    if (current) current(req, res, next);
  }

  next();
}

module.exports = { runHandlers };
