const config = require("../config.js");
const mongoose = require("mongoose");
var baglan_can = mongoose.createConnection(config.mongo_url, {
  useNewUrlParser: true,
  autoIndex: false
});

const userData = new mongoose.Schema({
    userID: String, //Discord user ID
    balance: Number, //Bakiye miktarı
    name: String, //Adı
    email: String, //E-posta adresi
    acAt: String,  //Açılma tarihi
});

module.exports = baglan_can.model("userData", userData);