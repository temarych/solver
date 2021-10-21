import mongoose from 'mongoose';

import express from 'express';
import env from 'dotenv';

import sessionRouter from './routers/session.js';

env.config();

const PORT = process.env.PORT;
const URI = process.env.URI;

const app = express();

app.use('/session', sessionRouter);

app.get('/', (request, response) => {
    response.send('Server');
});

start();

async function start() {
    try {
        await mongoose.connect(URI, {
            useNewUrlParser: true
        });
        app.listen(PORT, () => {
            console.log(`Express server is listening at http://localhost:${PORT}.`);
        });
    } catch(error) {
        console.log(error);
    }
}