const jwt =  require('jsonwebtoken');
const cookieParser = require('cookie-parser');

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
    const {userId} = jwt.verify(token, process.env.APP_SECRET);
    // put userId on the req for future request to access
    req.userId = userId;
  }
  next();
});

//2. create a middleware that populates the user on each request

server.express.use(async(req, res, next) => {
  //if they arent logged in skip this 
  if(!req.userId) return next();
  const user = await db.query.user({where: {id: req.userId }},
  '{ id, permissions, email, name }'
  );
  req.user = user;
  next();
})

server.start({
  cors: {
    credentials: true,
    origin: process.env.FRONTEND_URL,
  },
}, deets => {
  console.log(`Server is now running on port http:/localhost:${deets.port}`)
})