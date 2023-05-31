const mongoose = require('mongoose');
const {config} = require("../config/secret")
main().catch(err => console.log(err));
//concct to mongo atlas db
async function main() {
  await mongoose.connect(`mongodb+srv://${config.USER_DB}:${config.PASS_DB}@toyshw.i0hbp40.mongodb.net/toyshw`);
  console.log("mongo atlas connect");
}