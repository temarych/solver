import axios from "axios";
import { template } from './request.js';

import { Authorization } from "./authorization.js";

export class Scraper {
    constructor({ authorization }) {
        Object.assign(this, { authorization });
    }
    async request() {
        return await Scraper.request({
            authorization: this.authorization
        });
    }
    async answer(payload) {
        return await Scraper.answer({
            authorization: this.authorization,
            payload
        });
    }
    static async exists(code) {
        let url = `${template}/sessions/${code}/healthcheck/`;

        try {
            await axios.get(url);
        } catch {
            return false;
        }

        return true;
    }
    static async request({ authorization }) {
        let { code, configuration } = authorization;
        let url = `${template}/sessions/${code}/`;

        let response = await axios.get(url, configuration);

        return response.data;
    }
    static async answer({ authorization, payload }) {
        let { code, configuration } = authorization;
        let url = `${template}/sessions/${code}/answers/`;

        let response = await axios.post(url, payload, configuration);

        return response.data;
    }
    static async login(code) {
        let { authorize } = Authorization;
        let authorization = await authorize({ code });

        let scraper = new Scraper({ authorization });

        return scraper;
    }
}