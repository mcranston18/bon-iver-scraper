const dotenv = require('dotenv');
const process = require('process');
dotenv.config();

const bonIver = require('./bonIver');
const express = require('express');
const app = express();
app.set('view engine', 'pug');

app.use('/', async (req, res) => {
  try {
    const result = await bonIver();
    const now = new Date();
    res.status(200);
    res.render('index', { now, result });
  } catch (e) {
    res.status(400).send('An error occurred', e);
  }
});

const server = app.listen(process.env.PORT || 8080, err => {
  if (err) {
    return console.error(err); // eslint-disable-line
  }

  const port = server.address().port;
  console.info(`App listening on port ${port}`); // eslint-disable-line
});
