const express = require("express");
const app = express();


app.get("/api/bother", (req, res, next) => {
  res.json(["Hello"]);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});