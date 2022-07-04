const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "ping",
  usage: "/ping",
  category: "Bot",
  description: "Ping Komutu.",
  run: async (client, interaction, config, hesap, siparis) => {
    const pingEmbed = new MessageEmbed()
      .setColor(config.embed_color)
      .setTitle("Ping! - " + config.services_name)
      .setDescription(`${client.ws.ping} ms`)
      .setFooter({ text: config.embed_footer, iconURL: client.user.avatarURL() })
      .setTimestamp();
    try {
        interaction.reply({ embeds: [pingEmbed] });
    } catch (e) {
        console.log(e);
    }
  },
};