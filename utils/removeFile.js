const fs = require("fs");
const path = require("path");

const fileRemover = (filename) => {
  fs.unlink(path.join(__dirname, `../uploads`, filename), (err) => {
    if (err && err.code === "ENOENT") {
      console.error(err);
    }
    else if(err) {
      console.error(err);
    } else{
        console.log("File removed");
    }
  });
};
module.exports = fileRemover;
