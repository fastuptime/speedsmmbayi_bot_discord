const { MessageEmbed } = require("discord.js");
const moment = require("moment");
const axios = require("axios");
var FormData = require('form-data');
var qs = require('qs');
module.exports = {
  name: "profil",
  usage: "/profil",
  category: "Bot",
  description: "Profilinizi gösterir.",
  run: async (client, interaction, config, hesap, siparis) => {
    await interaction.deferReply();
    const hesap_data = await hesap.findOne({ userID: interaction.user.id });
    if(!hesap_data) return await interaction.editReply({ content: 'Üzgünüm, Mevcut Bir Hesabınız Yok', ephemeral: true });
    /*
     userID: String, //Discord user ID
    balance: Number, //Bakiye miktarı
    name: String, //Adı
    email: String, //E-posta adresi
    acAt: String,  //Açılma tarihi
    */
    const profil_embed = new MessageEmbed()
      .setColor(config.embed_color)
      .setTitle("Profil - " + config.services_name)
      .addField("Ad", hesap_data.name + "")
      .addField("E-posta", hesap_data.email + "")
      .addField('Bakiye', hesap_data.balance + "")
      .addField("Açılma Tarihi", moment(hesap_data.acAt).format('DD/MM/YYYY HH:mm:ss'))
      .setFooter({ text: config.embed_footer, iconURL: client.user.avatarURL() })
    await interaction.editReply({ content: 'DM üzerinden profilinizi görebilirsiniz.', ephemeral: true });
    try {
      interaction.user.send({ embeds: [profil_embed] });
    } catch (e) {
      console.log(e);
    }
  },
};