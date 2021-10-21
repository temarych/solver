import { Router } from 'express';

import bodyParser from 'body-parser';
import { requestSession} from '../controllers/session.js';

const jsonParser = bodyParser.json();
const router = Router();

router.route('/').post(jsonParser, requestSession);

export default router;