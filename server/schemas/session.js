import mongoose from 'mongoose';

const questionKinds = [
    'Question',
    'Single',
    'Multiple',
    'Grid',
    'Logic',
    'Sorter',
    'Hotspot',
    'Input'
];

export default new mongoose.Schema({
    title: String,
    code: {
        type: String,
        required: true,
        unique: true
    },
    questions: [{
        title: {
            type: String,
            required: true
        },
        kind: {
            type: String,
            required: true,
            validate(value) {
                return questionKinds.includes(value);
            }
        },
        options: {
            default: undefined,
            type: [{
                title: String,
                image: {
                    address: String
                },
                isCorrect: {
                    type: Boolean,
                    default: null
                }
            }]
        },
        image: {
            address: String
        },
        video: {
            address: String
        },
        hotspot: {
            image: {
                default: undefined,
                type: {
                    width: Number,
                    height: Number,
                    address: String
                }
            },
            points: {
                default: undefined,
                type: [{
                    x: Number,
                    y: Number
                }]
            }
        },
        rows: {
            default: undefined,
            type: [{
                title: String
            }]
        },
        columns: {
            default: undefined,
            type: [{
                title: String
            }]
        }
    }]
});