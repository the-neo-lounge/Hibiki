const Command = require('../../structures/Command');
const { get } = require('node-superfetch');

module.exports = class DidYouMean extends Command {
    constructor(client) {
        super(client, {
            name: 'did-you-mean',
            aliases: ['didyoumean'],
            group: 'image-edit',
            memberName: 'did-you-mean',
            description: 'Google-like did you mean image command.',
            throttling: {
                usages: 2,
                duration: 3
            },
            args: [{
                key: 'top',
                prompt: 'What should the search (top) text be?\n',
                type: 'string',
                validate: text => {
                    if (text.length < 50) return true;
                    return 'Please keep the text under 50 characters.';
                }
            }, {
                key: 'bottom',
                prompt: 'What should be the did you mean (bottom) text?\n',
                type: 'string'
            }]
        });
    }

    async run(msg, { top, bottom }) {
        const { body } = await get('https://api.alexflipnote.xyz/didyoumean')
            .query({ top, bottom });
        try {
            return msg.say({ files: [{ attachment: body, name: 'didyoumean.png' }] });
        } catch (err) {
            this.captureError(err);
             
        }
    }
};
