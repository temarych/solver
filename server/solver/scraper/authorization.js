import axios from "axios";
import { template } from './request.js';

export class Authorization {
    constructor({ name = '⠀', code }) {
        Object.assign(this, { name, code });
    }
    static async authorize({ name, code }) {
        let authorization = new Authorization({ name, code });

        await authorization.authorize();

        return authorization;
    }
    async login() {
        let name = this.name;
        let code = this.code;

        let url = `${template}/login/`;
        let payload = { name, code };

        let response = await axios.post(url, payload);
        let credentials = response.data;

        Object.assign(this, { credentials });

        return credentials;
    }
    async join() {
        let code = this.code;
        let configuration = this.configuration;

        let url = `${template}/sessions/${code}/join/`;
        let payload = null;

        let response = await axios.post(url, payload, configuration);

        return response.data;
    }
    async authorize() {
        await this.login();
        await this.join();
    }
    get configuration() {
        let { token } = this.credentials;
        let authorization = `JWT ${token}`;

        let headers = { authorization };
        let configuration = { headers };

        return configuration;
    }
}