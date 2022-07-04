const { MessageEmbed } = require("discord.js");
const moment = require("moment");
const axios = require("axios");
var FormData = require('form-data');
var qs = require('qs');
module.exports = {
  name: "siparis_durumu",
  usage: "/siparis_durumu <siparisID> <siparisedenid>",
  category: "Bot",
  options: [
    {
        name: "siparisid",
        description: "Sipariş ID'sini giriniz.",
        type: "STRING",
        required: true
    },
    {
        name: "siparisedenid",
        description: "Sipariş Eden Kullanıcının Discord ID'sini giriniz.",
        type: "STRING",
        required: true
    }
  ],
  description: "Sipariş durumunu gösterir.",
  run: async (client, interaction, config, hesap, siparis) => {
      await interaction.deferReply();
      const siparisID = interaction.options.getString("siparisid");
      const siparis_eden_ID = interaction.options.getString("siparisedenid");
      const siparis_ara = await siparis.findOne({ orderID: siparisID, userID: siparis_eden_ID }) || "NaN";
      const siparis_bulunamadı = new MessageEmbed()
        .setColor(config.embed_color)
        .setTitle("Sipariş Bulunamadı - " + config.services_name)
        .setDescription(`Uzgunuz, sipariş bulunamadı.`)
        .setFooter({ text: config.embed_footer, iconURL: client.user.avatarURL() })
      if(siparis_ara == "NaN") return interaction.editReply({ embeds: [siparis_bulunamadı], ephemeral: true });
      var data = qs.stringify({
            'key': config.speedsmm_api_key,
            'action': 'status',
            'order': siparis_ara.orderID,
            'service_nickname': siparis_ara.bayi
        });
        var config_data = {
            method: 'post',
            url: "https://speedsmm.com/api/v2",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'SpeedSMM/1.0 SpeedSMM System',
            },
            data : data
    };
    axios(config_data).then(async function (response) {
      if(response.data.status === "error") return await interaction.editReply({ content: "Hata: **" + response.data.message + "** \nBilgilendirme: Hata Sisteme Eksik Girilmiş Bilgilerden Kaynaklanıyor Olabilir.", ephemeral: true });
      let order_status = response.data.order_status;
      let charge = response.data.charge;
      let start_count = response.data.start_count;
      let remains = response.data.remains;
      //update siparis
      try {
        await siparis.findOneAndUpdate({ orderID: siparisID, userID: siparis_eden_ID }, { $set: { 
            orderStatus: order_status,
            start_count: start_count,
            remains: remains,
            last_check: moment().format("YYYY-MM-DD HH:mm:ss")
        }});
      } catch (error) {
        console.log(error);
      }
      const siparis_durumu = new MessageEmbed()
          .setColor(config.embed_color)
          .setTitle("Sipariş Durumu - " + config.services_name)
          .addField("Sipariş ID", siparis_ara.orderID)
          .addField("Sipariş Eden", siparis_ara.userID)
          .addField("Sipariş Durumu", order_status)
          .addField("Sipariş Başlangıç Sayısı", start_count)
          .addField("Sipariş Kalan Sayısı", remains)
          .addField("Sipariş Ücreti", charge)
          .setFooter({ text: config.embed_footer, iconURL: client.user.avatarURL() });
      try {
        await interaction.editReply({ embeds: [siparis_durumu], ephemeral: true });
      } catch (error) {
        console.log(error);
      }
          
    }).catch(function (error) {
        return interaction.editReply({ content: "Hata: **" + error + "** \nBilgilendirme: Hata Sisteme Eksik Girilmiş Bilgilerden Kaynaklanıyor Olabilir.", ephemeral: true });
    });
  },
};