import nodeCanvas from 'node-canvas';
const { createCanvas, loadImage } = nodeCanvas;

import { dictionary } from '../information.js';
import { marker } from './assets.js';

export class Format {
    static configuration = {
        parse_mode: 'HTML',
        disable_web_page_preview: true
    }
    static makeBold(text) {
        return `<b>${text}</b>`;
    }
    static createLink({ address, title }) {
        return `<a href="${address}">${title}</a>`
    }
    static formatHeader({ title, code }) {
        return `${this.makeBold(code)}\n${title}`;
    }
    static formatTitle(title) {
        return this.makeBold(`${marker.title} ${title}`);
    }
    static formatOption(option) {
        let title = option.title;
        let placeholder = dictionary.get('option');

        if (!title) {
            title = placeholder;
        }

        return `${
            option.isCorrect === null ? marker.list :
            option.isCorrect ? marker.correct : 
            marker.incorrect
        } ${title}`;
    }
    static formatOptions(options) {
        let formattedOptions = options.map(option => {
            let formattedOption = this.formatOption(option);

            if (option.image) {
                let { address } = option.image;
                let title = formattedOption;

                formattedOption = this.createLink({
                    address,
                    title
                });
            }

            return formattedOption;
        });

        return formattedOptions.join('\n');
    }
    static translateOptions(options) {
        options.forEach(option => {
            if (dictionary.has(option.title)) {
                option.title = dictionary.get(option.title);
            }
        })
    }
    static formatGrid({ rows, columns }) {
        let formattedRows = this.formatRows(rows);
        let formattedColumns = this.formatColumns(columns);

        return `${formattedRows}\n${formattedColumns}`;
    }
    static formatRows(rows) {
        let formattedRows = rows.map(row => {
            return `${marker.arrow.right} ${row.title}`;
        });

        return formattedRows.join('\n');
    }
    static formatColumns(columns) {
        let formattedColumns = columns.map(column => {
            return `${marker.arrow.down} ${column.title}`;
        });

        return formattedColumns.join('\n');
    }
    static formatSortableOptions(options) {
        let formattedOptions = options.map(option => {
            return `${marker.switch} ${option.title}`;
        });

        return formattedOptions.join('\n');
    }
    static formatVideo({ address }) {
        let placeholder = dictionary.get('video');
        let title = `${marker.video} ${placeholder}`;

        return this.createLink({ address, title });
    }
    static formatInput({ placeholder }) {
        return `${marker.input} ${placeholder}`;
    }
    static async formatHotspot({ image, points }) {
        let color = {
            mint: '#B4F8C8',
            green: '#7CFC00',
            transparent: 'rgba(255, 255, 255, 0)'
        };

        let { width, height } = image;

        let canvas = createCanvas(width, height);
        let context = canvas.getContext('2d');

        let loadedImage = await loadImage(image.address);
        context.drawImage(loadedImage, 0, 0, width, height);

        points.forEach(({ x, y }) => {
            let r = 10;
            let gradient = createRadialGradient(x, y, r);

            gradient.addColorStop(0, color.transparent);
            gradient.addColorStop(1, color.green);

            context.beginPath();
            drawCircle(x, y, r);
            context.fillStyle = gradient;
            context.fill();

            context.beginPath();
            drawCircle(x, y, 4);
            context.fillStyle = color.green;
            context.fill();

            function createRadialGradient(x, y, r) {
                return context
                    .createRadialGradient(x, y, 0, x, y, r);
            }
        });

        function drawCircle(x, y, radius) {
            context.arc(x, y, radius, 0, 2 * Math.PI);
        }

        return canvas.toBuffer();
    }
    static formatChoices({ 
        kind, options, 
        rows, columns 
    }) {
        if (options) this.translateOptions(options);
        return (
            ['Single', 'Multiple', 'Logic']
                .includes(kind)
        ) ? (
            this.formatOptions(options)
        ) : (
            ['Sorter']
                .includes(kind)
        ) ? (
            this.formatSortableOptions(options)
        ) : (
            ['Grid']
                .includes(kind)
        ) ? (
            this.formatGrid({ rows, columns })
        ) : (
            ['Input']
                .includes(kind)
        ) ? (
            this.formatInput({
                placeholder: dictionary
                    .get('placeholder')
            })
        ) : ''
    }
    static formatQuestion(question) {
        return `${
            this.formatTitle(question.title)
        }${
            question.video ? `\n${
                this.formatVideo(question.video)
            }` : ''
        }\n${
            this.formatChoices(question)
        }`;
    }
}