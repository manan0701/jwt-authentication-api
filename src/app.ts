import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import express from 'express';
import { connect as dbConnect } from './config/database';
import authenticate from './middleware/auth';
import home from './routes/home';
import login from './routes/login';
import refresh from './routes/refresh';
import register from './routes/register';

dbConnect();

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

app.post('/register', register);
app.post('/login', login);
app.post('/refresh', refresh);
app.get('/home', authenticate, home);

export default app;
