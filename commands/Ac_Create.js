const { MessageEmbed } = require("discord.js");
const moment = require("moment");
module.exports = {
  name: "hesap_olustur",
  usage: "/hesap_olustur <ad> <e_posta>",
  category: "Bot",
  options: [
    {
        name: "ad",
        description: "Gerçek adınızı giriniz.",
        type: "STRING",
        required: true
    },
    {
        name: "e_posta",
        description: "E-posta adresinizi giriniz.",
        type: "STRING",
        required: true
    }
  ],
  description: "Hesap oluşturur.",
  run: async (client, interaction, config, hesap, siparis) => {
    const hesap_ara = await hesap.findOne({ userID: interaction.user.id }) || "NaN";
    const hesabınız_var = new MessageEmbed()
      .setColor(config.embed_color)
      .setTitle("Hesabınız var - " + config.services_name)
      .setDescription(`Hesabınızın adı: **${hesap_ara.name}**\nE-posta adresiniz: **${hesap_ara.email}**`)
      .setFooter({ text: config.embed_footer, iconURL: client.user.avatarURL() })
    if(hesap_ara != "NaN") return interaction.reply({ embeds: [hesabınız_var], ephemeral: true });
    let ad = interaction.options.getString("ad");
    const e_posta = interaction.options.getString("e_posta");
    if(!e_posta.includes("@")) return interaction.reply({ content: "E-posta adresi geçersiz.", ephemeral: true });
    if(ad.length < 3) return interaction.reply({ content: "Adınız 3 karakterden kısa olamaz.", ephemeral: true });
    if(ad.length > 32) return interaction.reply({ content: "Adınız 32 karakterden uzun olamaz.", ephemeral: true });
    let ad_büyük = ad.charAt(0).toUpperCase() + ad.slice(1).toLowerCase();
    const hesap_olustur = new hesap({
      userID: interaction.user.id,
      balance: 0,
      name: ad_büyük,
      email: e_posta,
      acAt: moment().format("YYYY-MM-DD HH:mm:ss")
    });
    await hesap_olustur.save();
    const hesap_olusturma = new MessageEmbed()
      .setColor(config.embed_color)
      .setTitle("Hesabınız Oluşturuldu - " + config.services_name)
      .setDescription(`Hesabınızın adı: **${hesap_olustur.name}**\nHesabınız oluşturulduğu için tüm kullanım koşullarını kabul ettmiş sayılıyor.`)
      .setFooter({ text: config.embed_footer, iconURL: client.user.avatarURL() })
    try {
        interaction.reply({ embeds: [hesap_olusturma], ephemeral: true });
    } catch (e) {
        console.log(e);
    }
  },
};