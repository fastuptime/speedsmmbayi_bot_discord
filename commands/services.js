const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const moment = require("moment");
const fs = require("fs");
const last_update_services = require("../last_update_services.json");
const axios = require("axios");
var FormData = require('form-data');
var qs = require('qs');
module.exports = {
  name: "servisler",
  usage: "/servisler",
  category: "Bot",
  description: "Tüm Servisleri Gösterir.",
  run: async (client, interaction, config, hesap, siparis) => {
    await interaction.deferReply();
    if(last_update_services.date == "NaN") {
        var data = qs.stringify({
            'key': config.speedsmm_api_key,
            'action': 'services',
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
        axios(config_data, {
            headers: { 'User-Agent':'SpeedSMM/1.0 SpeedSMM Bot' }
        }).then(async function (response) {
            if(response.data.status === "error") return await interaction.editReply({ content: "Hata: **" + response.data.message + "** \nBilgilendirme: Hata Sisteme Eksik Girilmiş Bilgilerden Kaynaklanıyor Olabilir.", ephemeral: true });
            last_update_services.date = moment().format("YYYY-MM-DD HH:mm:ss");
            fs.writeFile("./last_update_services.json", JSON.stringify(last_update_services), (err) => {
                if(err) console.log(err);
            });
            let fiyat_listesi = [];
            let gelen_liste = response.data;
            gelen_liste.forEach(function(urun) {
                let fiyat = urun.rate;
                let yuzde = config.kar_orani;
                var yuzdelium = fiyat * yuzde / 100;
                var yeni_fiyat_yuzdeli = Number(fiyat) + Number(yuzdelium); 
                var yeni_fiyati = yeni_fiyat_yuzdeli.toFixed(2); 
                let yeni_urun = {
                    service: urun.service,
                    name: urun.name,
                    type: urun.type,
                    rate: yeni_fiyati,
                    eski_fiyati: urun.rate,
                    net_kar: yeni_fiyati - urun.rate,
                    min: urun.min,
                    max: urun.max,
                    nickname: urun.nickname
                };
                fiyat_listesi.push(yeni_urun);
            });
            setTimeout(function() {
                fs.writeFile("./services.json", JSON.stringify(fiyat_listesi), (err) => {
                    if(err) console.log(err);
                });
            }, 15000);
        }).catch(function (error) {
            console.log(error);
        });
    }

    let son_kontrol = last_update_services.date;
    let aradan_gecen_saat = moment().diff(moment(son_kontrol, "YYYY-MM-DD HH:mm:ss"), "hours");
    if(Number(aradan_gecen_saat) > 3) {
        var data = qs.stringify({
            'key': config.speedsmm_api_key,
            'action': 'services',
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
            last_update_services.date = moment().format("YYYY-MM-DD HH:mm:ss");
            fs.writeFile("./last_update_services.json", JSON.stringify(last_update_services), (err) => {
                if(err) console.log(err);
            });
            let fiyat_listesi = [];
            let gelen_liste = response.data;
            gelen_liste.forEach(function(urun) {
                let fiyat = urun.rate;
                let yuzde = config.kar_orani;
                var yuzdelium = fiyat * yuzde / 100;
                var yeni_fiyat_yuzdeli = Number(fiyat) + Number(yuzdelium); 
                var yeni_fiyati = yeni_fiyat_yuzdeli.toFixed(2); 
                let yeni_urun = {
                    service: urun.service,
                    name: urun.name,
                    type: urun.type,
                    rate: yeni_fiyati,
                    eski_fiyati: urun.rate,
                    net_kar: yeni_fiyati - urun.rate,
                    min: urun.min,
                    max: urun.max,
                    nickname: urun.nickname
                };
                fiyat_listesi.push(yeni_urun);
            });
            setTimeout(function() {
                fs.writeFile("./services.json", JSON.stringify(fiyat_listesi), (err) => {
                    if(err) console.log(err);
                });
            }, 15000);
        }).catch(function (error) {
            console.log(error);
        });
    }

    setTimeout(async function() {
        const dosya_servis = fs.readFileSync("./services.json", "utf8");
        let servisler = JSON.parse(dosya_servis);
        if(servisler.length < 5) return await interaction.editReply({ content: "Hata: **Servisleri Güncellemede Hata Oluştu. Bir Süre Sonra Tekrar Deneyiniz!** \nBilgilendirme: Hata Sisteme Eksik Girilmiş Bilgilerden Kaynaklanıyor Olabilir.", ephemeral: true });
        const servis_listesi = new MessageEmbed()
            .setColor(config.embed_color)
            .setTitle("Servis Listesi - " + config.services_name)
            .addField("**Bilgilendirme**", "Sipariş Vermeden Önce ID ve Bayi bilgisini not almayı unuttmayın!\nFiyatlar 1k İçin Hesaplanır.")
            .addField('Sayfa: ', "1/" + Math.ceil(servisler.length / 20))
            .setFooter({ text: config.embed_footer, iconURL: client.user.avatarURL() })
            .setTimestamp();
        var son_sayfa = Math.ceil(servisler.length / 20);
        const row = new MessageActionRow()
            .addComponents(
				new MessageButton()
					.setCustomId('back_0')
					.setLabel('Önceki Sayfa')
					.setStyle('PRIMARY')
                    .setDisabled(true),
			)
            .addComponents(
                new MessageButton()
                    .setCustomId('servisler_sil_msg')
                    .setLabel('Sil')
                    .setStyle('DANGER'),
            )
			.addComponents(
				new MessageButton()
					.setCustomId('next_2')
					.setLabel('Sonraki Sayfa')
					.setStyle('PRIMARY'),
			);
        for(let i = 0; i < 20; i++) {
            let servis = servisler[i];
            servis_listesi.addField(`ID: ${servis.service}`, `Adı: **${servis.name}**\nFiyat: **${servis.rate}**\nMin: **${servis.min}**\nMax: **${servis.max}**\nBayi: **${servis.nickname}**`);
        }
        setTimeout(async function() {
            await interaction.editReply({ embeds: [servis_listesi], components: [row], ephemeral: true });
        }, 1900);
    }, 1000);
  },
};