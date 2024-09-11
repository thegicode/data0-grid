"use strict";
import express from "express";
const app = express();
const PORT = process.env.PORT || 3e3;
app.get("/", (req, res) => {
  res.send("Hello, Express with TypeScript!");
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
