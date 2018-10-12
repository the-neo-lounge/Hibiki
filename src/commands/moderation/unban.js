const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');

module.exports = class Unban extends Command {
    constructor(client) {
        super(client, {
            name: 'unban',
            aliases: ['unbanne'],
            group: 'moderation',
            memberName: 'unban',
            description: 'Unbans a user when executed.',
            examples: ['unban 334254548841398275'],
            guildOnly: true,
            args: [{
                key: 'id',
                prompt: 'Which user ID do you want to unban?\n',
                type: 'string'
            }, {
                key: 'reason',
                prompt: 'What is the reason?\n',
                type: 'string',
                default: ''
            }]
        });
    }

    hasPermission(msg) {
        return this.client.isOwner(msg.author) || msg.member.permissions.has('BAN_MEMBERS');
    }

    async run(msg, { id, reason } ) {
        if (!msg.guild.me.permissions.has('BAN_MEMBERS')) return msg.say('Sorry, I don\'t have permissions to ban and unban people.');
        const modlog = await msg.guild.channels.get(msg.guild.settings.get('modLog'));
        
        const bans = await msg.guild.fetchBans();
        if (!bans.has(id)) return msg.say('This user is not banned.');
        const member = bans.get(id).user;

        try {
            const embed = new MessageEmbed()
                .setColor(0x00ff00)
                .setDescription(stripIndents`
                    ✅ | **User unbanned**: ${member ? member.tag : 'Unable to display.'} (${id})
                    **Issuer**: ${msg.author.tag}
                    **Reason**: ${reason || 'No reason'}
                `);
            await msg.guild.members.unban(member, { reason });
            if (modlog) {
                return modlog.send({ embed });
            }
            await msg.react('✅');
        } catch (err) {
            this.captureError(err);
            await this.client.logger.error(err.stack);
            return msg.say(`❎ | This command has errored and the devs have been notified about it. Give <@${this.client.options.owner}> this message: \`${err.message}\``);
        }
    }
};