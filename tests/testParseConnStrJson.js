const { exec } = require("child_process");
exec("source etc/local.env", (err, stdout, stderr) => {
  if (err) {
    // node couldn't execute the command
    return;
  }
});
const config = require("../config/config");

function main() {
  console.log(config.epiqueryServerConns);
}

main();



