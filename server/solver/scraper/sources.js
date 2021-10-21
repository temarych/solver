export class Address {
    constructor({ protocol, host, root = '' }) {
        Object.assign(this, { 
            protocol, 
            host, 
            root 
        });
    }
    toString() {
        return `${
            this.protocol
        }://${
            this.host
        }/${
            this.root
        }`;
    }
}

export const cloudinary = new Address({
    protocol: 'https',
    host: 'res.cloudinary.com',
    root: 'gopollock/image/upload'
});