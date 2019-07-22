const path = require("path");
const fs = require("fs");
const exec = require("child_process").exec;


if (!fs.existsSync(path.join(__dirname, "../tmp/"))) {
  fs.mkdirSync(path.join(__dirname, "../tmp/"));
}


exports.addDocument = async (req, res) => {
console.log("BODY : ", req.files);
 
  let KYC = req.files.filename;
  var hash;
  const name = "dummy"+path.extname(KYC.name);

  KYC.mv(path.join(__dirname, "../tmp/", name), function(err) {
    if (err) {
      return res.status(500).send(err);
    }
    const filePath = path.join(__dirname, "/../tmp/", name);
    // upload to IPFS
    exec(
      `IPFS_PATH=~/.ipfs1 ipfs add ${filePath}`,
      async (error, stdout, stderr) => {
        var words = stdout.split(" ");
        for (var i = 0; i < words.length; i++) {
          if (words[i][0] == "Q") hash = words[i];
        }
        console.log("HASH : ", hash);
        console.log("deleting : ", filePath);
    

        fs.unlink(filePath, err => {
          if (err) throw err;
          res.send("ok");
        });
      }
    );
  });
};
