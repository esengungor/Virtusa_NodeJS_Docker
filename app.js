const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const cassandra = require('cassandra-driver');

const app = express();
const port = process.env.PORT || 3000;
// const cassandra = require('express-cassandra');


const client = new cassandra.Client({ contactPoints: ['127.0.0.1', '9042'], keyspace: 'mykeyspace' });

const query = 'SELECT name, surname FROM person WHERE name = ?';

client.execute(query, ['Esen'])
  .then(result => console.log('User with email %s', result.rows[0].name));


app.use(morgan('dev'));
// app.use('/',express.static(path.resolve('public')));

app.use(express.static(path.join(__dirname, '/public/')));

app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist/js')));

app.set('views', './src/views');
app.set('view engine', 'ejs');


const nav = [
  { link: '/books', title: 'Books' },
  { link: '/authors', title: 'Author' }
];
const bookRouter = require('./src/routes/bookRoutes')(nav);

app.use('/books', bookRouter);
app.get('/', (req, res) => {
  //  res.send('hello');
  //  res.sendFile(path.join(__dirname, 'views', 'index.html'));
  res.render(
    'index',
    {
      nav,
      title: 'Library'
    }
  );
});

app.listen(port, () => {
  console.log(`Listening on port  ${chalk.green(port)}`);
  debug('debug calistirildi');
});
