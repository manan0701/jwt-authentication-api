import { connect as mongooseConnect } from 'mongoose';
import 'dotenv/config';

const { DATABASE_URI = '' } = process.env;

const connect = () => {
    mongooseConnect(DATABASE_URI)
        .then(() => {
            console.log('Successfully connected to the database');
        })
        .catch((error) => {
            console.log('Database connection failed. Exiting now...');
            console.error(error);
            process.exit(1);
        });
};

export { connect };