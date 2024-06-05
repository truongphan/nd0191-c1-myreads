import "./App.css";
import React, { useState, useEffect } from 'react';
import { Route } from 'react-router-dom';
import { debounce } from 'throttle-debounce';
import * as BooksAPI from './BooksAPI';
import ListBooks from './ListBooks';
import SearchBooks from './SearchBooks';

const bookshelves = [
  { key: 'currentlyReading', name: 'Currently Reading' },
  { key: 'wantToRead', name: 'Want to Read' },
  { key: 'read', name: 'Read' }
];

const BooksApp = () => {
  const [myBooks, setMyBooks] = useState([]);
  const [searchBooks, setSearchBooks] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    BooksAPI.getAll()
      .then(books => {
        setMyBooks(books);
      })
      .catch(err => {
        console.log(err);
        setError(true);
      });
  }, []);

  const moveBook = (book, shelf) => {
    BooksAPI.update(book, shelf).catch(err => {
      console.log(err);
      setError(true);
    });
    if (shelf === 'none') {
      setMyBooks(prevBooks => prevBooks.filter(b => b.id !== book.id));
    } else {
      book.shelf = shelf;
      setMyBooks(prevBooks => prevBooks.filter(b => b.id !== book.id).concat(book));
    }
  };

  const searchForBooks = debounce(300, false, query => {
    if (query.length > 0) {
      BooksAPI.search(query).then(books => {
        if (books.error) {
          setSearchBooks([]);
        } else {
          setSearchBooks(books);
        }
      });
    } else {
      setSearchBooks([]);
    }
  });

  const resetSearch = () => {
    setSearchBooks([]);
  };

  if (error) {
    return <div>Network error. Please try again later.</div>;
  }

  return (
    <div className="app">
      <Route
        exact
        path="/"
        render={() => (
          <ListBooks
            bookshelves={bookshelves}
            books={myBooks}
            onMove={moveBook}
          />
        )}
      />
      <Route
        path="/search"
        render={() => (
          <SearchBooks
            searchBooks={searchBooks}
            myBooks={myBooks}
            onSearch={searchForBooks}
            onMove={moveBook}
            onResetSearch={resetSearch}
          />
        )}
      />
    </div>
  );
};

export default BooksApp;
