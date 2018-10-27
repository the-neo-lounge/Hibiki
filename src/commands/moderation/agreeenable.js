const { Command } = require('discord-akairo');

class AgreeCommand extends Command {
    constructor() {
        super('agreeenable', {
            aliases: ['agree-enable'],
            category: 'general',
            channel: 'guild',
            userPermissions: ['MANAGE_GUILD'],
            description: { content: 'Enable agreement system in this server.' }
        });
    }

    async exec(message) {
        const checkAgree = this.client.settings.get(message.guild.id, 'agreeEnabled');

        try { 
            if (checkAgree) {
                await this.client.settings.set(message.guild.id, 'agreeEnabled', false);
                return message.util.send('**::** Agreement disabled.');
            }
            await this.client.settings.set(message.guild.id, 'agreeEnabled', true);
            return message.util.send('**::** Agreement enabled.');
        } catch (_) {
            message.util.send({
                embed: {
                    color: 0xFF0000,
                    title: ':x: Error!',
                    description: ':: An unknown error has occured.',
                },
            });
        }
    }
}

module.exports = AgreeCommand;