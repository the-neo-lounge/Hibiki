const Command = require('../../structures/Command');
const { get } = require('node-superfetch');
 

module.exports = class Captcha extends Command {
    constructor(client) {
        super(client, {
            name: 'captcha',
            group: 'image-edit',
            memberName: 'captcha',
            description: 'Edits Google\'s reCaptcha message to your providen one.',
            throttling: {
                usages: 2,
                duration: 3
            },
            args: [{
                key: 'user',
                prompt: 'Who is the user?\n',
                type: 'user',
            }]
        });
    }

    async run(msg, { user }) {
        const url = user.displayAvatarURL({ size: 2048 });
        const username = user.username;
        const { body } = await get('https://nekobot.xyz/api/imagegen?type=captcha')
            .query({ url, username });
        try {
            return msg.say({ files: [{ attachment: body.message, name: 'captcha.png' }] });
        } catch (err) {
            this.captureError(err);
             
        }
    }
};
