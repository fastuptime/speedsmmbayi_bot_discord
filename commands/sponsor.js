const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
module.exports = {
  name: "sponsor",
  usage: "/sponsor",
  category: "Bot",
  description: "Sponsor hakkında bilgi verir.",
  run: async (client, interaction, config, hesap, siparis) => {
    const row = new MessageActionRow()
	  .addComponents(
        new MessageButton()
          .setLabel("FastUptime")
          .setStyle("LINK")
          .setURL("https://fastuptime.com")
    );
     const Embed = new MessageEmbed()
        .setColor(config.embed_color)
        .setTitle(`${config.services_name} - Sponsor`)
        .setDescription(":small_red_triangle_down:*** __FastUptime__*** :small_red_triangle_down: \n\n:champagne_glass: *New Update!*\n\n:black_joker: Hiç Bir Kodlama Bilgisi Gerekmeden\n\n:black_joker: Oturduğunuz Yerden Bot Yapabilmek İster Miydiniz?\n\n:palm_tree: Artık **FastUptime'da!** Hiç Bir Kodlama - Yazılım Dil Bilgisi Gerekmeden Discord Botlarınızı Yapabilirsiniz!! \nTek Yapmanız Gereken FastUptime'a Giriş Yapmak Ardından \" *__Bot Creator__* \" Menüsünden Sizde Hemen Botunuzu Oluşturun.\n\n:popcorn: Tek Yapmanız Gereken FastUptime'a Dahil Olmak Ardından Arkanıza Yaslanın Ve Keyfini Çıkarın\n\n**:reminder_ribbon:FastUptime Gurur İle Sunar..**\n\n`- Her Zaman Ve Daima Sizler İçin En İyisini Hedefliyoruz.` ")
        .setFooter({ text: config.embed_footer, iconURL: client.user.avatarURL() })
        .setTimestamp();
     await interaction.reply({embeds: [Embed], components: [row]}).catch((err) => console.log("Hata Oluştu; " + err));
  },
};
