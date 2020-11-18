const express = require("express");
var fs = require("fs");
const { exec, execSync } = require("child_process");
const { stringify } = require("querystring");

const app = express();

function createBotherSh(num1, num2, num3, num4) {
  var str =
    "rm -rf /tmp/folder/*\n" +
    "bother --bounds " +
    num1.toFixed(5) +
    " " +
    num2.toFixed(5) +
    " " +
    num3.toFixed(5) +
    " " +
    num4.toFixed(5) +
    " ./height/height_map.png";
  fs.writeFileSync("bother.sh", str);
}

app.get("/api/bother", (req, res, next) => {
  const bounds = JSON.parse(req.query.bounds);
  createBotherSh(bounds[0][0], bounds[0][1], bounds[1][0], bounds[1][1]);
  console.log("start sh");
  execSync("sh bother.sh", (error, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    if (error !== null) {
      console.log(`exec error: ${error}`);
    }
  });
  console.log("end sh");

  console.log("start decoding");
  var fs = require("fs"),
    PNG = require("pngjs").PNG;
  var data = fs.readFileSync("./height/height_map.png");
  var png = PNG.sync.read(data);
  var matrix = [];
  for (var y = 0; y < png.height; y++) {
    for (var x = 0; x < png.width; x++) {
      var idx = (png.width * y + x) << 2;
      matrix.push([png.data[idx],
        png.data[idx] + 1,
        png.data[idx + 2],
        png.data[idx + 3]]);
    }
  }
  console.log("end decoding");

  console.log("send answer");
  res.json(JSON.stringify(matrix));
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

