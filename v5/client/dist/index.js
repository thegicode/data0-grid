"use strict";
(() => {
  // src/app.ts
  var app = () => {
    return `<p>This is a simple Vanilla JS + TypeScript App!</p>`;
  };

  // src/index.ts
  document.getElementById("app").innerHTML = app();
})();
