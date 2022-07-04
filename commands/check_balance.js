const { MessageEmbed } = require("discord.js");
const moment = require("moment");
const axios = require("axios");
var FormData = require('form-data');
var qs = require('qs');
module.exports = {
  name: "saglayıcı_bakiye",
  usage: "/saglayıcı_bakiye",
  category: "Bot",
  description: "Ana Sağlayıcı'daki bakiye bilgisini gösterir.",
  run: async (client, interaction, config, hesap, siparis) => {
      await interaction.deferReply();
      var data = qs.stringify({
            'key': config.speedsmm_api_key,
            'action': 'balance',
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
    try {
      axios(config_data).then(async function (response) {
        if(response.data.status === "error") return await interaction.editReply({ content: "Hata: **" + response.data.message + "** \nBilgilendirme: Hata Sisteme Eksik Girilmiş Bilgilerden Kaynaklanıyor Olabilir.", ephemeral: true });
        let balance = response.data.balance;
        await interaction.editReply({ content: "Kalan Bakiye: **" + balance + "**", ephemeral: true });
      }).catch(function (error) {
          console.log(error);
      });
    } catch (e) {
      console.log(e)
    }
  },
};