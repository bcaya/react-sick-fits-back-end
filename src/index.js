const cookieParser = require('cookie-parser');
const jwt =  require('jsonwebtoken');

require('dotenv').config({ path: 'variables.env' });
const createServer = require('./createServer');
const db = require('./db');

const server = createServer();

server.express.use(cookieParser());
// Need to complete: use express middleware to populate current user


//decode the JWT so we can get the user id on request
server.express.use((req, res, next) => {
  const {token} = req.cookies;
  if(token) {
    const {userId} = jwt.verify(token, process.eventNames.APP_SECRET);
    // put userId on the req for future request to access
    req.userId = userId;
  }
  next();
});
server.start({
  cors: {
    credentials: true,
    origin: process.env.FRONTEND_URL,
  },
}, deets => {
  console.log(`Server is now running on port http:/localhost:${deets.port}`)
})