const dotenv = require('dotenv');
const process = require('process');
dotenv.config();

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_KEY;
const toNumber = process.env.TO_NUMBER;
const fromNumber = process.env.FROM_NUMBER;

const twilio = require('twilio');
const client = new twilio(accountSid, authToken);

module.exports = {
  send: async body => {
    await client.messages.create({
      body,
      to: toNumber,
      from: fromNumber,
    });
  },
};
