const { MessageEmbed } = require("discord.js");
const moment = require("moment");
const axios = require("axios");
var FormData = require('form-data');
var qs = require('qs');
module.exports = {
  name: "profile",
  usage: "/profile <user_id>",
  options: [
    {
      name: "user_id",
      description: "Kullanıcının ID'sini giriniz.",
      type: "STRING",
      required: true
    }
  ],
  category: "Bot",
  description: "Kullanıcının Profilini Gösterir.",
  run: async (client, interaction, config, hesap, siparis) => {
    await interaction.deferReply();
    const user_id = interaction.options.getString("user_id");
    const hesap_data = await hesap.findOne({ userID: user_id });
    if(!hesap_data) return await interaction.editReply({ content: 'Üzgünüm, Mevcut Bir Eşleşme Yok!', ephemeral: true });
    const profil_embed = new MessageEmbed()
      .setColor(config.embed_color)
      .setTitle("Profil - " + config.services_name)
      .addField("Ad", hesap_data.name + "")
      .addField('Bakiye', hesap_data.balance + "")
      .addField("Açılma Tarihi", moment(hesap_data.acAt).format('DD/MM/YYYY HH:mm:ss'))
      .setFooter({ text: config.embed_footer, iconURL: client.user.avatarURL() })
    try {
      interaction.editReply({ embeds: [profil_embed] });
    } catch (e) {
      console.log(e);
    }
  },
};