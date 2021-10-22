import TelegramBot from 'node-telegram-bot-api';
import env from 'dotenv';

import express from 'express';
import axios from 'axios';

import { Format } from './formatter/format.js';
import { alert, information } from './information.js';

env.config();

const API = process.env.API;
const PORT = process.env.PORT;

const port = 5000;
const app = express();

app.get('/', (request, response) => {
    response.send('Client');
});

app.listen(PORT || port, start);

export function start() {
    const TOKEN = process.env.TOKEN;
    const bot = new TelegramBot(TOKEN, { polling: true });

    bot.onText(/\/help/, async (message, match) => {
        await bot.sendMessage(
            message.from.id,
            alert.help,
            Format.configuration
        );
    });
    
    bot.onText(/\/start/, async (message, match) => {
        await bot.sendMessage(
            message.from.id, 
            alert.start,
            Format.configuration
        );
    });
    
    bot.onText(/\/solve (.+)/, async (message, match) => {
        let code = match[1];
    
        let root = 'session';
        let address = `${API}/${root}/`;
    
        let date = new Date();
        let requester = {
            name: message.from.first_name,
            surname: message.from.last_name,
            username: message.from.username
        };
    
        let payload = { code, date, requester };
        let response;
    
        let waitingMessage = await bot.sendMessage(
            message.from.id, 
            alert.pending,
            Format.configuration
        );

        try {
            response = await axios.post(address, payload);
        } catch {
            return bot.sendMessage(
                message.from.id,
                alert.error,
                Format.configuration
            );
        } finally {
            await bot.deleteMessage(
                waitingMessage.chat.id, 
                waitingMessage.message_id
            );
        }
    
        let { title, questions } = response.data;
        let header = { title, code };
    
        await bot.sendMessage(
            message.from.id, 
            Format.formatHeader(header),
            Format.configuration
        );
    
        for (let question of questions) {
            if (question.image) {
                await bot.sendMessage(
                    message.from.id,
                    Format.formatTitle(question.title),
                    Format.configuration
                );
    
                await bot.sendPhoto(
                    message.from.id,
                    question.image.address
                );
    
                await bot.sendMessage(
                    message.from.id,
                    Format.formatChoices(question),
                    Format.configuration
                );
            } else {
                await bot.sendMessage(
                    message.from.id,
                    Format.formatQuestion(question),
                    Format.configuration
                );
            }
    
            if (question.kind === 'Hotspot') {
                let buffer = await Format.formatHotspot(question.hotspot);
                await bot.sendPhoto(message.from.id, buffer);
            }
        }
    });
}