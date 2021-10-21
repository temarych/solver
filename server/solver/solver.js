import { 
    Question, Multiple, 
    Grid, Option, 
    Logic, Single, 
    Sorter, Hotspot, 
    Point, Input 
} from "./scraper/models.js";

import { E404 } from "./scraper/errors.js";
import { Scraper } from "./scraper/scraper.js";

export class Session {
    constructor(code) {
        Object.assign(this, { code });
    }
    static create({ code, title, questions }) {
        let session = new this(code);

        questions = questions.map(question => {
            switch (question.kind) {
                case 'multiple':
                    return Multiple.create(question);
                case 'choice':
                    return Single.create(question);
                case 'bool':
                    return Logic.create(question);
                case 'categorizer':
                    return Grid.create(question);
                case 'sorter': 
                    return Sorter.create(question);
                case 'hotspot':
                    return Hotspot.create(question);
                case 'text': 
                    return Input.create(question);
                default:
                    return Question.create(question);
            }
        })

        Object.assign(session, { title, questions });

        return session;
    }
}

export class Solver {
    static async solve(code) {
        let exists = await Scraper.exists(code);

        if (!exists) {
            throw new E404(`${code} doesn't exist.`);
        }

        let scraper = await Scraper.login(code);
        let session = await scraper.request();

        session = Session.create(session);

        await Promise.all(session.questions.map(async question => {
            switch (question.kind) {
                case 'Multiple': {
                    let answer = await scraper.answer(question.payload);
                    let options = answer.choices
                        .filter(choice => choice.isCorrect)
                        .map(choice => Option.global.get(choice.choice));
                    question.answer(options);
                    break;
                }
                case 'Logic': {
                    let answer = await scraper.answer(question.payload);
                    question.answer(answer.isCorrect);
                    break;
                }
                case 'Hotspot': {
                    let answer = await scraper.answer(question.payload);
                    let correctPoints = answer.points
                        .filter(point => point.isCorrect)
                        .map(point => Point.create(point));
                    question.answer(correctPoints);
                    break;
                }
            }
        }));

        return session;
    }
}

// Solver.solve('YJ4R9E');