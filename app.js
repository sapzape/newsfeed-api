require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 4500;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useFindAndModify: false })
  .then(() => console.log("Successfully connected to mongodb"))
  .catch(e => console.log(e));

app.use('/users', require('./routes/users'));
app.use('/schools', require('./routes/schools'));
app.use('/posts', require('./routes/posts'));

app.listen(port, () => console.log(`Server listening on port ${port}`));

module.exports = app;
