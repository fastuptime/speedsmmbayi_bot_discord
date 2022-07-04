const { MessageEmbed } = require("discord.js");
const moment = require("moment");
const axios = require("axios");
var FormData = require('form-data');
var qs = require('qs');
module.exports = {
  name: "siparisler",
  usage: "/siparisler",
  category: "Bot",
  description: "Tüm siparişleri gösterir.",
  run: async (client, interaction, config, hesap, siparis) => {
    await interaction.deferReply();
    if(config.support_team_role_access) {
        let sunucu = client.guilds.cache.get(config.serverID);
        sunucu.roles.cache.get(config.support_team_role_id).members.cache.forEach(async (member) => {
        if(member.user.id === interaction.user.id) {
            const siparisler = await siparis.find({}).sort({ date: -1 }).limit(20);
            const siparis_bulunamadı = new MessageEmbed()
            .setColor(config.embed_color)
            .setTitle("Sipariş Bulunamadı - " + config.services_name)
            .setDescription(`Uzgunum Mevcut Sipariş Yok.`)
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
        }});
    } else {
        if(interaction.user.id !== config.ownerID) return await interaction.editReply({ content: "Bu komutu sadece botun sahibi kullanabilir.", ephemeral: true });
        const siparisler = await siparis.find({}).sort({ date: -1 }).limit(20);
        const siparis_bulunamadı = new MessageEmbed()
        .setColor(config.embed_color)
        .setTitle("Sipariş Bulunamadı - " + config.services_name)
        .setDescription(`Uzgunum Mevcut Sipariş Yok.`)
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
    }
  },
};