import 'dotenv/config';
import http from 'http';
import app from './app';

const server = http.createServer(app);

const { PORT } = process.env;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
