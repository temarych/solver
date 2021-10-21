import { cloudinary } from './sources.js';

export class Option {
    static global = new Map();
    constructor(title) {
        Object.assign(this, { title });
    }
    static create({ content, id, image: address }) {
        let image = address
            ? new Image(address)
            : null;
        let title = content
            ? content.blocks
                .map(block => block.text)
                .join(', ')
            : null;

        let option = new this(title);

        this.global.set(id, option);
        Object.assign(option, { id, image });

        return option;
    }
}

export class Question {
    static global = new Map();
    constructor(title) {
        let kind = this.constructor.name;
        Object.assign(this, { title, kind });
    }
    static create({ 
        title, id, 
        image: imageAddress,
        video: videoAddress
    }) {
        let question = new this(title);
        
        let video = videoAddress 
            ? new Video(videoAddress)
            : null
        let image = imageAddress
            ? new Image(imageAddress)
            : null;
        
        this.global.set(id, question);
        Object.assign(
            question, 
            { id },
            { image, video }
        );

        return question;
    }
    get payload() {
        return { question: this.id };
    }
}

export class Input extends Question {}

export class Multiple extends Question {
    static create({ choices }) {
        let question = super.create(...arguments);
        let options = choices.map(
            choice => Option.create(choice)
        );

        Object.assign(question, { options });

        return question;
    }
    get payload() {
        return Object.assign(super.payload, {
            choices: this.options.map(option => ({
                choice: option.id
            }))
        });
    }
    answer(options) {
        this.options.forEach(option => {
            let isCorrect = options.includes(option);
            Object.assign(option, { isCorrect });
        });
    }
}

export class Single extends Multiple {
    answer(option) {
        let options = [ option ];
        super.answer(options);
    }
}

export class Logic extends Question {
    constructor(title) {
        super(title);
        this.options = [
            new Option(true),
            new Option(false)
        ];
    }
    get payload() {
        return Object.assign(super.payload, {
            isTrue: true
        });
    }
    answer(isTrue) {
        this.options.forEach(option => {
            let isCorrect = option.title === isTrue;
            Object.assign(option, { isCorrect });
        });
    }
}

export class Sorter extends Multiple {
    constructor() {
        super(...arguments);
    }
}

export class Media {
    constructor(address) {
        Object.assign(this, { address });
    }
}

export class Image extends Media {
    constructor(address) {
        address = `${cloudinary}/${address}`;
        super(address);
    }
    static create({ width, height, image: address }) {
        let image = new this(address);
        return Object.assign(image, { 
            width, 
            height
        });
    }
}

export class Video extends Media {}

export class Point {
    static create({ x, y }) {
        let point = new this();
        Object.assign(point, { x, y });
        return point;
    }
}

export class PointGrid {
    static create({ width, height }) {
        let pointGrid = new this();

        let precision = 50;

        let columnsAmount = Math.round(width / precision);
        let rowsAmount = Math.round(height / precision);

        let rows = new Array(rowsAmount)
            .fill(null);
        let columns = new Array(columnsAmount)
            .fill(null);
        
        rows = rows.map((_, rowIndex) => {
            return columns.map((_, columnIndex) => {
                let padding = precision / 2;

                let x = precision * (columnIndex + 1)
                    + randomInteger(-padding, padding);
                let y = precision * (rowIndex + 1)
                    + randomInteger(-padding, padding);

                x = x < width - padding ? x : width - padding
                    - randomInteger(1, padding);
                y = y < height - padding ? y : height - padding
                    - randomInteger(1, padding);

                x = x > padding ? x : padding
                    + randomInteger(1, padding);
                y = y > padding ? y : padding
                    + randomInteger(1, padding);
                
                let point = Point.create({ x, y });

                return point;
            })
        });

        Object.assign(pointGrid, { rows });

        return pointGrid;
    }
}

export function randomInteger(max, min) {
    let randomNumber = Math.random() * (max - min) + min;
    let randomInteger = Math.floor(randomNumber);

    return randomInteger;
}

export class Hotspot extends Question {
    static create({ hotspotData }) {
        let question = super.create(...arguments);
        let image = Image.create(hotspotData);

        let pointGrid = PointGrid.create(hotspotData);
        let points = pointGrid.rows.flat();

        Object.assign(question, {
            hotspot: { image, points }
        });
        
        return question;
    }
    get payload() {
        return Object.assign(super.payload, {
            points: this.hotspot.points
        });
    }
    answer(points) {
        Object.assign(this.hotspot, { points });
    }
}

export class Grid extends Question {
    static create({ items, categories }) {
        let grid = super.create(...arguments);
        let [ 
            rows, columns
        ] = [ 
            items, categories 
        ].map(sections => sections.map(
            section => Option.create(section)
        ));
        
        Object.assign(grid, { 
            rows, 
            columns
        });

        return grid;
    }
}