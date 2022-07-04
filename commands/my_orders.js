const { MessageEmbed } = require("discord.js");
const moment = require("moment");
const axios = require("axios");
var FormData = require('form-data');
var qs = require('qs');
module.exports = {
  name: "siparislerim",
  usage: "/siparislerim",
  category: "Bot",
  description: "Verdiğiniz tüm siparişleri gösterir.",
  run: async (client, interaction, config, hesap, siparis) => {
    await interaction.deferReply();
    const siparisler = await siparis.find({ userID: interaction.user.id }).sort({ date: -1 }).limit(20);
    const siparis_bulunamadı = new MessageEmbed()
      .setColor(config.embed_color)
      .setTitle("Sipariş Bulunamadı - " + config.services_name)
      .setDescription(`Uzgunuz, sipariş bulunamadı.\nYeni bir sipariş oluşturmak için **/siparis_olustur** komutunu kullanabilirsiniz.`)
      .setFooter({ text: config.embed_footer, iconURL: client.user.avatarURL() })
    if(siparisler.length <= 0) return await interaction.editReply({ embeds: [siparis_bulunamadı], ephemeral: true });
    let siparis_listesi = new MessageEmbed()
      .setColor(config.embed_color)
      .setTitle("Sipariş Listesi - " + config.services_name)
      .setFooter({ text: config.embed_footer, iconURL: client.user.avatarURL() })
    siparisler.forEach(async (siparis) => {
      siparis_listesi.addField('Sipariş ID:', "**" + siparis.orderID + "**\n" + "Sipariş Durumu: **" + siparis.orderStatus + "**\n" + "Sipariş Tarihi: **" + siparis.orderDate + "**\n" + "Sipariş Bayi: **" + siparis.bayi + "**\n" + "Sipariş Başlangıç Miktarı: **" + siparis.start_count + "**\n" + "Sipariş Kalan Miktarı: **" + siparis.remains + "**\n" + "Sipariş Ücreti: **" + siparis.charge + "**");
    });
    setTimeout(async () => {
      await interaction.editReply({ embeds: [siparis_listesi], ephemeral: true });
    }, 1000);
  },
};