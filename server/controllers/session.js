import Session from '../models/session.js';
import { HTTPError } from '../solver/scraper/errors.js';
import { Solver } from '../solver/solver.js';

export function log({ code, date: timestamp, requester }) {
    let date = timestamp
        ? new Date(timestamp)
        : new Date();

    let formatter = new Intl.DateTimeFormat('uk-UA', {
        dateStyle: 'short',
        timeStyle: 'medium'
    });
    
    let time = formatter
        .format(date)
        .split(',')
        .join('');

    if (!requester) {
        console.log(`[${time}] ${code} was requested`);
        return;
    }

    let { name, surname, username } = requester;
    let fullName = (name && surname) 
        ? `${name} ${surname}`
        : username;

    console.log(`[${time}] ${fullName} requested ${code}`);
}

export async function requestSession(request, response) {
    try {
        let details = request.body;

        let { code } = details;
        let session = await Session.findOne({ code });

        if (!session) {
            session = await Solver.solve(code);
            session = new Session(session);
            await session.save();
        }

        log(details);
        
        response.send(session);

    } catch(error) {

        if (error.name === 'ValidationError') {
            response.status(400);
            response.send(error.message);
            return;
        }

        if (error instanceof HTTPError) {
            response.status(error.status)
            response.send(error.message);
            return;
        }

        throw error;
    }
}