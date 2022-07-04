const { MessageEmbed } = require("discord.js");
const moment = require("moment");
const axios = require("axios");
var FormData = require('form-data');
var qs = require('qs');
module.exports = {
  name: "bakiye_ekle",
  usage: "/bakiye_ekle <user> <miktar>",
  category: "Bot",
  options: [
    {
        name: "user",
        description: "Kullanıcı ID'sini giriniz.",
        type: "STRING",
        required: true
    },
    {
        name: "miktar",
        description: "Eklenecek Miktarı giriniz.",
        type: "STRING",
        required: true
    }
  ],
  description: "Belirlenen kişiye bakiye ekler.",
  run: async (client, interaction, config, hesap, siparis) => {
    await interaction.deferReply();
    if(interaction.user.id !== config.ownerID) return await interaction.editReply({ content: "Bu komutu sadece botun sahibi kullanabilir.", ephemeral: true });
    const user = interaction.options.getString("user");
    const miktar = interaction.options.getString("miktar");
    const hesap_data = await hesap.findOne({ userID: user });
    if(!hesap_data) return await interaction.editReply({ content: "Belirtilen kullanıcının hesabı yok.", ephemeral: true });
    if(isNaN(miktar)) return await interaction.editReply({ content: "Lütfen Geçerli Bir Miktar Giriniz.", ephemeral: true });
    if(miktar < 0) return await interaction.editReply({ content: "Lütfen Geçerli Bir Miktar Giriniz.", ephemeral: true });
    var bakiye = Number(hesap_data.balance) + Number(miktar);
    await hesap.findOneAndUpdate({ userID: user }, { $set: { balance: bakiye } });
    await interaction.editReply({ content: `Bakiye Eklendi. \nYeni bakiyesi: **${bakiye}**`, ephemeral: true });
    const log = new MessageEmbed()
      .setColor(config.embed_color)
      .setTitle("Bakiye Ekleme - " + config.services_name)
      .addField("Admin ID", `${interaction.user.id}`, true)
      .addField("Kullanıcı", `<@${user}>`, true)
      .addField("Miktar", `${miktar}`, true)
      .addField("Yeni Bakiyesi", `${bakiye}`, true)
      .setFooter({ text: config.embed_footer, iconURL: client.user.avatarURL() })
    try {
        client.channels.cache.get(config.log_channel_id).send({ embeds: [log] });
    } catch(e) {
        console.log(e);
    }
  },
};