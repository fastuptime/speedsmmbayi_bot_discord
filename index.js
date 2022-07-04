const { glob } = require("glob");
const { promisify } = require("util");
const globPromise = promisify(glob);
const Discord = require('discord.js');
const { Client, Collection, Intents, WebhookClient, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Intents.FLAGS.DIRECT_MESSAGE_TYPING,
    ],
    messageCacheLifetime: 60,
    fetchAllMembers: true,
    messageCacheMaxSize: 10,
    restTimeOffset: 0,
    restWsBridgetimeout: 100,
    shards: "auto",
    allowedMentions: {
        parse: ["roles", "users", "everyone"],
        repliedUser: true,
    },
    partials: ["MESSAGE", "CHANNEL", "REACTION"],
    intents: 32767,
});
const fs = require("fs");
const config = require("./config.js");
//////////////////////////////MODELS//////////////////////////////
const hesap = require("./models/user.js");
const siparis = require("./models/order.js");
//////////////////////////////MODELS//////////////////////////////
client.on("ready", () => {
    client.user.setActivity('activity', { type: config.setActivity_type });
    client.user.setPresence({ activities: [{ name:  config.ready }], status: config.setStatus_type });
});

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isButton()) return;
    const message = interaction.message;
    let istenen = interaction.customId;
    let back_or_next = istenen.split("_")[0];
    let page = istenen.split("_")[1];
    if(back_or_next === "next") {
        const dosya_servis = fs.readFileSync("./services.json", "utf8");
        let servisler = JSON.parse(dosya_servis);
        let servis_elleme = JSON.parse(dosya_servis);
        var atla = page * 20;
        servisler = servisler.slice(atla, atla + 20);
        let embed = new MessageEmbed()
            .setColor(config.embed_color)
            .setTitle("Servis Listesi - " + config.services_name)
            .addField("**Bilgilendirme**", "Sipariş Vermeden Önce ID ve Bayi bilgisini not almayı unuttmayın!\nFiyatlar 1k İçin Hesaplanır.")
            .addField('Sayfa: ', page + "/" + Math.ceil(servis_elleme.length / 20))
            .setFooter({ text: config.embed_footer, iconURL: client.user.avatarURL() })
            .setTimestamp();
        for(let i = 0; i < servisler.length; i++) {
            let servis = servisler[i];
            embed.addField(`ID: ${servis.service}`, `Adı: **${servis.name}**\nFiyat: **${servis.rate}**\nMin: **${servis.min}**\nMax: **${servis.max}**\nBayi: **${servis.nickname}**`);
        }
        var sonraki_sayfa = Number(page) + 1;
        const row = new MessageActionRow()
            .addComponents(
				new MessageButton()
					.setCustomId('back_' + page)
					.setLabel('Önceki Sayfa')
					.setStyle('PRIMARY'),
			)
            .addComponents(
                new MessageButton()
                    .setCustomId('servisler_sil_msg')
                    .setLabel('Sil')
                    .setStyle('DANGER'),
            )
			.addComponents(
				new MessageButton()
					.setCustomId('next_' + sonraki_sayfa)
					.setLabel('Sonraki Sayfa')
					.setStyle('PRIMARY'),
			);
        try {
            message.edit({ embeds: [embed], components: [row] });
            await interaction.reply({ content: "**" + page + ".** Sayfaya Geçildi!", ephemeral: true });
        } catch (e) {
            console.log(e);
        }
    }
    if(back_or_next === "back") {
        const dosya_servis = fs.readFileSync("./services.json", "utf8");
        let servisler = JSON.parse(dosya_servis);
        let servis_elleme = JSON.parse(dosya_servis);
        var atla = page * 20;
        servisler = servisler.slice(atla - 20, atla);
        let embed = new MessageEmbed()
            .setColor(config.embed_color)
            .setTitle("Servis Listesi - " + config.services_name)
            .addField("**Bilgilendirme**", "Sipariş Vermeden Önce ID ve Bayi bilgisini not almayı unuttmayın!\nFiyatlar 1k İçin Hesaplanır.")
            .addField('Sayfa: ', page + "/" + Math.ceil(servis_elleme.length / 20))
            .setFooter({ text: config.embed_footer, iconURL: client.user.avatarURL() })
            .setTimestamp();
        for(let i = 0; i < servisler.length; i++) {
            let servis = servisler[i];
            embed.addField(`ID: ${servis.service}`, `Adı: **${servis.name}**\nFiyat: **${servis.rate}**\nMin: **${servis.min}**\nMax: **${servis.max}**\nBayi: **${servis.nickname}**`);
        }
        var onceki_sayfa = Number(page) - 1;
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('back_' + onceki_sayfa)
                    .setLabel('Önceki Sayfa')
                    .setStyle('PRIMARY'),
            )
            .addComponents(
                new MessageButton()
                    .setCustomId('servisler_sil_msg')
                    .setLabel('Sil')
                    .setStyle('DANGER'),
            )
            .addComponents(
                new MessageButton()
                    .setCustomId('next_' + page)
                    .setLabel('Sonraki Sayfa')
                    .setStyle('PRIMARY'),
            );
        try {
            message.edit({ embeds: [embed], components: [row] });
            await interaction.reply({ content: "**" + page + ".** Sayfaya Geçildi!", ephemeral: true });
        }
        catch (e) {
            console.log(e);
        }
    }
    if(istenen === "servisler_sil_msg") {
        try {
            message.delete();
            await interaction.reply({ content: "**Silindi!**", ephemeral: true });
        }
        catch (e) {
            console.log(e);
        }
    }
});
/////////////////////////////////////////////////////
client.discord = Discord;
client.commands = new Collection();
client.slashCommands = new Collection();


client.on("interactionCreate", async (interaction) => {
  if (interaction.isCommand()) {
    const command = client.slashCommands.get(interaction.commandName);
    if (!command) return interaction.followUp({ content: 'an Erorr' });

    const args = [];

    for (let option of interaction.options.data) {
      if (option.type === 'SUB_COMMAND') {
        if (option.name) args.push(option.name);
          option.options?.forEach(x =>  {
            if (x.value) args.push(x.value);
        });
      } else if (option.value) args.push(option.value);
    } try {
      command.run(client, interaction, config, hesap, siparis, args)
    } catch (e) {
      interaction.followUp({ content: e.message });
    }
  }
});

handler(client);
async function handler(client) {
  const slashCommands = await globPromise(
      `${process.cwd()}/commands/*.js`
  );

  const arrayOfSlashCommands = [];
  slashCommands.map((value) => {
      const file = require(value);
      if (!file.name) return;
      client.slashCommands.set(file.name, file);
      arrayOfSlashCommands.push(file);
  });
  client.on("ready", async () => {
      await client.application.commands.set(arrayOfSlashCommands).catch(console.error);
  });
}
/////////////////////////////////////////////////////

client.login(config.token).then(() => {
    console.log("Bot'a Giriş Yaptım! " + client.user.tag);
}).catch(err => {
    console.log("Giriş Yapılırken Bir Hata Oluştu Intentlerin Açık Olduğuna Emin Olun Ve Botun Tokenini Kontrol Edin!");
    console.log(err);
});