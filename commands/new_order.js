const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const moment = require("moment");
const axios = require("axios");
var FormData = require('form-data');
var qs = require('qs');
module.exports = {
  name: "siparis_olustur",
  usage: "/siparis_olustur <urunid> <bayi> <url> <miktar> <onayla>",
  category: "Bot",
  options: [
    {
        name: "urunid",
        description: "Ürün ID'sini giriniz.",
        type: "STRING",
        required: true
    },
    {
        name: "bayi",
        description: "Bayi ismini giriniz. Örnek: **du**",
        type: "STRING",
        required: true
    },
    {
        name: "url",
        description: "Gönderilecek Adresin URL'ini giriniz.",
        type: "STRING",
        required: true
    },
    {
        name: "miktar",
        description: "Gönderilecek Miktarı giriniz.",
        type: "STRING",
        required: true
    },
    {
        name: "onayla",
        description: "Siparişi onaylamak için **onay** yazınız.",
        type: "STRING",
        required: true
    }
  ],
  description: "Sipariş durumunu gösterir.",
  run: async (client, interaction, config, hesap, siparis) => {
      await interaction.deferReply();
      const hesap_data = await hesap.findOne({ userID: interaction.user.id });
      if(!hesap_data) return await interaction.editReply({ content: "Hesabınız yok. **/hesap_olustur** komutu ile bir hesap oluşturun.", ephemeral: true });
      const urunID = interaction.options.getString("urunid");
      const bayi = interaction.options.getString("bayi");
      const url = interaction.options.getString("url");
      const miktar = interaction.options.getString("miktar");
      const onay = interaction.options.getString("onayla");
      if(onay != "onay") return await interaction.editReply({ content: "Siparişiniz Onaylanmadı. Lütfen Koşulları Kabul Etmek İçin Onaylayın!", ephemeral: true });

      const siparis_olustur_hata = new MessageEmbed()
        .setColor(config.embed_color)
        .setTitle("Sipariş Oluşturma Hatası - " + config.services_name)
        .setFooter({ text: config.embed_footer, iconURL: client.user.avatarURL() });
      if(!url.includes("http")) {
        siparis_olustur_hata.setDescription("Lütfen Geçerli Bir URL Giriniz.");
      }
      if(!url.includes("http")) return await interaction.editReply({ embeds: [siparis_olustur_hata], ephemeral: true });
      if(isNaN(miktar)) {
        siparis_olustur_hata.setDescription("Lütfen Geçerli Bir Miktar Giriniz.");
      }
      if(isNaN(miktar)) return await interaction.editReply({ embeds: [siparis_olustur_hata], ephemeral: true });
      if(miktar <= 0) {
        siparis_olustur_hata.setDescription("Lütfen Geçerli Bir Miktar Giriniz.");
      }
      if(miktar <= 0) return await interaction.editReply({ embeds: [siparis_olustur_hata], ephemeral: true });
      if(miktar > 100000) {
        siparis_olustur_hata.setDescription("Lütfen Geçerli Bir Miktar Giriniz.");
      }
      if(miktar > 100000) return await interaction.editReply({ embeds: [siparis_olustur_hata], ephemeral: true });
      const siparis_ara_local = fs.readFileSync("../services.json", "utf8");
      let bayi_bul = JSON.parse(siparis_ara_local).find(x => x.nickname === bayi);
      if(!bayi_bul) {
        siparis_olustur_hata.setDescription("Lütfen Geçerli Bir Bayi Giriniz.");
      }
      if(!bayi_bul) return await interaction.editReply({ embeds: [siparis_olustur_hata], ephemeral: true });
      let servis_id = bayi_bul.filter(x => x.service == urunID)[0];
      if(!servis_id) {
        siparis_olustur_hata.setDescription("Lütfen Geçerli Bir Ürün ID Giriniz.");
      }
      if(!servis_id) return await interaction.editReply({ embeds: [siparis_olustur_hata], ephemeral: true });
      if(miktar > servis_id.max) {
        siparis_olustur_hata.setDescription("Lütfen Geçerli Bir Miktar Giriniz. (Maksimum " + servis_id.max + ")");
      }
      if(miktar > servis_id.max) return await interaction.editReply({ embeds: [siparis_olustur_hata], ephemeral: true });
      if(miktar < servis_id.min) {
        siparis_olustur_hata.setDescription("Lütfen Geçerli Bir Miktar Giriniz. (Minimum " + servis_id.min + ")");
      }
      if(miktar < servis_id.min) return await interaction.editReply({ embeds: [siparis_olustur_hata], ephemeral: true });
      let fiyat = servis_id.rate;
      let urun_adi = servis_id.name;
      let bir_tanesi_fiyat = servis_id.rate / 1000;
      if(urun_adi.includes("Tek Paket")) fiyat = Number(servis_id.rate);
      else fiyat = Number(bir_tanesi_fiyat) * Number(miktar);
      let miktarimiz_sayi = Number(miktar);
      let miktar_bin = Math.floor(miktarimiz_sayi / 1000);
      let net_kar = Number(miktar_bin) * Number(servis_id.net_kar);
      /////////
      if(!hesap_data.balance < fiyat) {
        siparis_olustur_hata.setDescription("Hesabınızda yeterli bakiye yok.");
      }
      if(!hesap_data.balance < fiyat) return await interaction.editReply({ embeds: [siparis_olustur_hata], ephemeral: true });
      /////////
      var data = qs.stringify({
          'key': config.speedsmm_api_key,
          'action': 'add',
          'service': urunID,
          'quantity': miktar,
          'link': url,
          'service_nickname': servis_id.nickname,
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
      axios(config_data).then(async (response) => {
        if(response.data.status == "error") {
          siparis_olustur_hata.setDescription("Sipariş Oluşturma Hatası: " + response.data.message);
        }
        if(response.data.status == "error") return await interaction.editReply({ embeds: [siparis_olustur_hata], ephemeral: true });
        if(response.data.status == "success") {
          let siparis_id_al = response.data.order;
          /////////
          await hesap.findOneAndUpdate({ userID: interaction.user.id }, { $inc: { balance: -fiyat } });
          /////////
          await new siparis({
            userID: interaction.user.id,
            orderID: siparis_id_al,
            productID: urunID,
            bayi: bayi,
            orderStatus: "Pending",
            orderDate: moment().format("YYYY-MM-DD HH:mm:ss"),
            start_count: miktar,
            remains: miktar,
            last_check: moment().format("YYYY-MM-DD HH:mm:ss"),
          }).save();
          /////////
          let siparis_olustur_basarili_log = new MessageEmbed()
                .setColor(config.embed_color)
                .setTitle("Sipariş Oluşturuldu!")
                .addField("Sipariş ID", siparis_id_al + " ")
                .addField("Ürün ID", urunID + " ")
                .addField("Ürün Adı", urun_adi + " ")
                .addField("Fiyat", fiyat + " ")
                .addField("Miktar", miktar + " ")
                .addField("Bayi", bayi + " ")
                .addField("URL", url + " ")
                .addField("Net Kar", net_kar + " ")
                .setTimestamp()
                .setFooter({ text: config.embed_footer, iconURL: client.user.avatarURL() });
          try {
              client.channels.cache.get(config.log_channel_id).send({ embeds: [siparis_olustur_basarili_log] });
          } catch(e) {
              console.log(e);
          }
          /////////
          const siparis_olustur_basarili = new MessageEmbed()
                .setColor(config.embed_color)
                .setTitle("Siparişiniz Oluşturuldu!")
                .addField("Sipariş ID", siparis_id_al + " ")
                .addField("Ürün ID", urunID + " ")
                .addField("Ürün Adı", urun_adi + " ")
                .addField("Fiyat", fiyat + " ")
                .addField("Miktar", miktar + " ")
                .setFooter({ text: config.embed_footer, iconURL: client.user.avatarURL() });
          try {
            await interaction.editReply({ embeds: [siparis_olustur_basarili] });
          } catch (e) {
            console.log(e);
          }
        }
      }).catch(async (error) => {
        console.log(error);
      });

  },
};