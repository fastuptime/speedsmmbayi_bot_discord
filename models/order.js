const config = require("../config.js");
const mongoose = require("mongoose");
var baglan_can = mongoose.createConnection(config.mongo_url, {
  useNewUrlParser: true,
  autoIndex: false
});

const orderData = new mongoose.Schema({
    userID: String, //Discord user ID
    orderID: String, //Sipariş ID
    productID: String, //Ürün ID
    bayi: String, //Bayi Name du 
    orderStatus: String, //Sipariş durumu
    orderDate: String, //Sipariş tarihi
    start_count: String, //Sipariş başlangıç sayısı
    remains: String, //Sipariş kalan sayısı
    last_check: String, //Son kontrol tarihi
});

module.exports = baglan_can.model("orderData", orderData);