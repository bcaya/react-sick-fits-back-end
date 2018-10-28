require('dotenv').config({ path: 'variables.env' });
const createServer = require('createServer');
const db = require('./db');

const server = createServer();

// Need to complete: User express middleware to handle cookies(JWT)
// Need to complete: use express middleware to populate current user