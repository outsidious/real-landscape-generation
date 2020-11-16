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
  const jsdom = require("jsdom");
  const { JSDOM } = jsdom;
  global.document = new JSDOM("html").window.document;
  let image = document.createElement("img");
  let matrix = [];
  image.onLoad = function () {
    console.log("loaded");
    var canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;

    let context = canvas.getContext("2d");
    if (context) {
      context.drawImage(image, 0, 0);

      var imageData = context.getImageData(0, 0, canvas.width, canvas.height);

      for (let x = 0; x < canvas.width(); ++x) {
        let arr = [];
        for (let y = 0; y < canvas.height(); ++y) {
          var index = (y * imageData.width + x) * 4;
          var red = imageData.data[index];
          var green = imageData.data[index + 1];
          var blue = imageData.data[index + 2];
          var alpha = imageData.data[index + 3];
          arr.push({ red, green, blue, alpha });
        }
        matrix.push(arr);
      }
    }
    res.json(JSON.stringify(matrix));
  };
  image.src = "./height/height_map.png";
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
