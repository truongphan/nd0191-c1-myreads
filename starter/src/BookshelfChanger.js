import React, { useState, useEffect } from 'react';

const BookshelfChanger = ({ book, shelf, onMove }) => {
  const [value, setValue] = useState(shelf);

  useEffect(() => {
    setValue(shelf);
  }, [shelf]);

  const handleChange = event => {
    const { value } = event.target;
    setValue(value);
    onMove(book, value);
  };

  return (
    <div className="book-shelf-changer">
      <select value={value} onChange={handleChange}>
        <option value="move" disabled>
          Move to...
        </option>
        <option value="currentlyReading">Currently Reading</option>
        <option value="wantToRead">Want to Read</option>
        <option value="read">Read</option>
        <option value="none">None</option>
      </select>
    </div>
  );
};

export default BookshelfChanger;
