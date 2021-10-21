import { emoji } from './formatter/assets.js';

export class Dictionary extends Map {
    constructor(dictionary) {
        let entries = Object.entries(dictionary);
        super(entries);
    }
}

export const description = (
    `Этот бот поможет тебе успешно пройти тест в класстайме.`
);

export const warning = (
    `Бот все еще разрабатывается, так что возможны незначительные баги и недоработки.`
);

export const information = {
    howToGetAdditionalInformation: `Чтобы подробнее онакомиться с возможностями бота, отправь команду /help.`,
    howToSolveSession: `Чтобы пройти тест в класстайме, воспользуйся коммандой /solve.`,
    onlyOneSolution: `Бот проходит тест только один раз, так что это врядли побеспокоит учителя.`
};

export const dictionary = new Dictionary({
    true: 'Правда',
    false: 'Неправда',
    video: 'Відео',
    placeholder: 'Тут має бути ваша відповідь',
    option: 'Варіант відповіді'
});

export const alert = {
    pending: `${emoji.hourglass} Ваш запрос обрабатывается.`,
    error: `${emoji.warning} Что-то пошло не так.`,
    start: [
        `${emoji.brain} ${description}`,
        `${emoji.warning} ${warning}`,
        `${emoji.magnifier} ${information.howToGetAdditionalInformation}`
    ].join('\n'),
    help: [
        `${emoji.brain} ${description}`,
        `${emoji.warning} ${information.onlyOneSolution}`,
        `${emoji.lightbulb} ${information.howToSolveSession}`
    ].join('\n')
};