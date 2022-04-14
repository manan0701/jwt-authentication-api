import { Request, Response } from 'express';

const home = async (req: Request, res: Response) => {
    res.status(200).send('You are authenticated. Welcome to the homepage.');
};

export default home;
