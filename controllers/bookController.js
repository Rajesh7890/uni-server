const Book = require("../models/book");

const BookController = {
  getAllBooks: (req, res) => {
    Book.getAll().then(books => {
      res.json({ success: true, message: 'All books', data: books });
    }).catch(err => {
      res.status(500).json({ success: false, message: 'Error getting books', error: err });
    });
  },

  getBookById: (req, res) => {
    const id = req.params.id;

    Book.get(id).then(book => {
      res.json({ success: true, message: 'Book found', data: book });
    }).catch(err => {
      res.status(500).json({ success: false, message: 'Error getting book', error: err });
    });
  },

  createBook: (req, res) => {
    const book = req.body;

    Book.create(book).then(data => {
      res.json({ success: true, message: 'Book created', data });
    }).catch(err => {
      res.status(500).json({ success: false, message: 'Error creating book', error: err });
    });
  },

  updateBook: (req, res) => {
    const id = req.params.id;
    const book = req.body;

    Book.update({ ...book, id }).then(data => {
      res.json({ success: true, message: 'Book updated', data });
    }).catch(err => {
      res.status(500).json({ success: false, message: 'Error updating book', error: err });
    });
  },

  deleteBook: (req, res) => {
    const id = req.params.id;

    Book.delete(id).then(response => {
      if (!response) {
        return res.status(404).json({ success: false, message: 'Book not found' });
      }

      res.json({ success: true, message: 'Book deleted' });
    }).catch(err => {
      res.status(500).json({ success: false, message: 'Error deleting book', error: err });
    });
  }
};

module.exports = BookController;
