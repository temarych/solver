import mongoose from 'mongoose';
import schema from '../schemas/session.js';

export default mongoose.model('Session', schema);