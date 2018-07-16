const express = require('express');
const cassandra = require('cassandra-driver');
const debug = require('debug')('app:bookView');

const bookRouter = express.Router();
const client = new cassandra.Client({ contactPoints: ['127.0.0.1', '9042'], keyspace: 'mykeyspace' });

function router(nav) {
  const books = [
    {
      title: 'title1',
      genre: 'genre1',
      author: 'author1',
      read: false
    },
    {
      title: 'title2',
      genre: 'genre2',
      author: 'author2',
      read: false
    },
    {
      title: 'title3',
      genre: 'genre3',
      author: 'author3',
      read: true
    },
    {
      title: 'title4',
      genre: 'genre4',
      author: 'author4',
      read: false
    },
    {
      title: 'title5',
      genre: 'genre5',
      author: 'author5',
      read: true
    }
  ];

  const query1 = 'SELECT name, surname FROM person WHERE name = ?';
  const query2 = 'SELECT title,genre,author,read FROM book';


  client.execute(query1, ['Esen'])
    .then(
      result => debug('User with email %s', result.rows[0].name)
    );

  bookRouter.route('/').get((req, res) => {
    client.execute(query2).then((result) => {
      console.log('customers: list succ:', result.rows);
      res.render(
        'bookListView',
        {
          nav,
          title: 'Books',
          books,
          result: result.rows
        }

      );
    });
  });

  bookRouter.route('/:id')
    .get((req, res) => {
      const { id } = req.params;

      res.render(
        'bookView',
        {
          nav,
          title: 'Book',
          book: books[id]
        }

      );
    });
  return bookRouter;
}
module.exports = router;
