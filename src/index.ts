import { ChannelType, Client, Colors, EmbedBuilder, Events, IntentsBitField, Partials, codeBlock, time } from 'discord.js';
import config from './config.js';
import { isClicked } from './utility/index.js';

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessageReactions,
        IntentsBitField.Flags.MessageContent,
    ],
    partials: [
        Partials.GuildMember,
    ],
});

client.once(Events.ClientReady, () => {
    if (!client.user || !client.application) {
        return;
    }

    console.log(`online :: @${client.user.username} başarıyla Discord'a giriş yaptı.`);
});

client.on(Events.MessageReactionAdd, async (reaction) => {
    try {
        const [ lastMember ] = (await reaction.users.fetch())
        .reverse();

        if (typeof lastMember === 'undefined') {
            return;
        }

        const [ memberId ] = lastMember;
        const user = await client.users.fetch(memberId);

        if (user.bot) {
            return;
        }

        if (reaction.count !== 1) {
            return;
        }

        const clicked = isClicked(reaction, config.discord.emojiId);
        const dateNow = parseInt(`${Date.now() / 1000}`);

        const message = reaction.message.content;

        if (clicked) {
            const channel = await client.channels.fetch(config.discord.channelId);
            const filteredMessage = message ?? 'discord.gg/altyapilar'
                .replaceAll('`', '')
                .slice(0, 1024);

            if (channel && channel.type === ChannelType.GuildText) {
                channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(Colors.DarkButNotBlack)
                            .setAuthor({ name: `${user.username} (@${user.username})`, iconURL: user.displayAvatarURL() })
                            .setTitle('Bir mesaj kayıt edildi.')
                            .setDescription('✅ **|** Aşağıda bilgileri bulunan mesaj başarıyla kayıt edildi.')
                            .setFields([
                                {
                                    name: 'Mesaj ID\'si:',
                                    value: codeBlock(reaction.message.id),
                                    inline: true,
                                },
                                {
                                    name: 'Kayıt eden kişi:',
                                    value: codeBlock(`@${user.username}`),
                                    inline: true,
                                },
                                {
                                    name: 'Kayıt edilme zamanı:',
                                    value: time(dateNow, 'R'),
                                    inline: true,
                                },
                                {
                                    name: 'Mesaj içeriği:',
                                    value: codeBlock(filteredMessage),
                                    inline: false,
                                },
                            ])
                            .setTimestamp()
                            .setFooter({ text: 'discord.gg/altyapilar tarafından yapılmıştır.', iconURL: 'https://cdn.discordapp.com/icons/1096085223881576549/6de3a3991ccbfe569d9fdf28ae26c532.png' }),
                    ],
                });
            }
        }
    }
    catch (err) {
        return console.log(err);
    }
});

client.login(config.discord.token)
    .catch(() => {
        console.error(
            'error :: Bot Discord API ile iletişim kuramadı.\n' +
            'error :: Token\'in yanlış olabilir veya INTENTlerin kapalı olabilir!'
        );
    });