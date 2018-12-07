const nodemail = require('nodemailer');
const transport = nodemail.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  },
});

const makeAniceEmail = text => `
  <div className="email" style="
    border: 1px solid black;
    padding: 20px;
    font-family: sans-serif;
    line-height: 2;
    font-size: 20px;
  ">
    <h2>Howdy There!</h2>
    <p>${text}</p>
    <p>🤠, Bobby C. </p>
  </div>
`;

exports.transport = transport;
exports.makeAniceEmail = makeAniceEmail;