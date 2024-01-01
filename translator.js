const { translate } = require('@vitalets/google-translate-api');

const defaultLang = 'en';

let translateHandler = async (m, args, Prefix, command) => {
    let err = `
📌 *Example:*

*${Prefix + command}* <language> [text]
*${Prefix + command}* en Hello World

≡ *List of supported languages:*

https://cloud.google.com/translate/docs/languages
`.trim();

    let lang = args[0];
    let text = args.slice(1).join(' ');
    if ((args[0] || '').length !== 2) {
        lang = defaultLang;
        text = args.join(' ');
    }
    if (!text && m.quoted && m.quoted.text) text = m.quoted.text;

    try {
        let result = await translate(text, { to: lang, autoCorrect: true }).catch((_) => null);
        m.reply(result.text);
    } catch (e) {
        throw err;
    }
};

module.exports = translateHandler;
