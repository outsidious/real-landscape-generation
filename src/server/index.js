const express = require("express");
var fs = require("fs");
const { exec } = require("child_process");
const { stringify } = require("querystring");

const app = express();

function createBotherSh(num1, num2, num3, num4) {
  var str =
    "bother --bounds " +
    num1 +
    " " +
    num2 +
    " " +
    num3 +
    " " +
    num4 +
    " height_map.png";
  fs.writeFileSync("bother.sh", str);
}

app.get("/api/bother", (req, res, next) => {
  const bounds = JSON.parse(req.query.bounds);
  createBotherSh(bounds[0][0], bounds[0][1], bounds[1][0], bounds[1][1]) /*
  exec("sh bother.sh", (error, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    if (error !== null) {
      console.log(`exec error: ${error}`);
    }
  });*/
  res.json(["OK"]);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
