/* eslint-disable consistent-return */
/**
 * @module       controller
 * @file         book.js
 * @description  bookController holds the API
 * @since        13/12/2023
-----------------------------------------------------------------------------------------------*/

const bookService = require("../services/book");

class BookController {
  /**
   * @description Controller for adding books
   * @param {*} req
   * @param {*} res
   */
  addBook = (req, res) => {
    const bookData = {
      author: req.body.author,
      title: req.body.title,
      quantity: req.body.quantity,
      price: req.body.price,
      description: req.body.description,
      image: req.body.image,
    };

    bookService
      .addBook(bookData)
      .then((data) => {
        return res.status(200).send({
          success: true,
          message: "Book added successfully!!",
          data,
        });
      })
      .catch((error) => {
        console.error("Error from controller:", error);
        return res.status(500).send({
          success: false,
          message: "Some error occurred while adding the book",
        });
      });
  };

  /**
   * @description Controller for getting all books
   * @param {*} req
   * @param {*} res
   * @returns
   */
  getAllBooks = (req, res) => {
    try {
      bookService.getBook((error, data) => {
        if (error) {
          return res.status(400).send({
            success: false,
            message: "Some error occurred",
          });
        }
        return res.status(200).send({
          success: true,
          message: "Books retrieved successfully!",
          data,
        });
      });
    } catch (error) {
      console.error("Error fetching books:", error);
      return res.status(500).send({
        success: false,
        message: "Internal server error",
      });
    }
  };

  /**
   * @description Controller for updating books
   * @param {*} req
   * @param {*} res
   * @returns
   */
  updateBook = (req, res) => {
    try {
      const bookDetails = {
        author: req.body.author,
        title: req.body.title,
        image: req.body.image,
        quantity: req.body.quantity,
        price: req.body.price,
        description: req.body.description,
        bookId: req.params.bookId,
      };

      bookService
        .updateBook(bookDetails)
        .then(() => {
          return res.status(200).send({
            success: true,
            message: "Book updated successfully",
          });
        })
        .catch(() => {
          return res.status(400).send({
            success: false,
            message: "Failed to update book",
          });
        });
    } catch (err) {
      console.error("Error updating book:", err);
      return res.status(500).send({
        success: false,
        message: "Internal server error",
      });
    }
  };

  /**
   * @description Controller for deleting books
   * @param {*} req
   * @param {*} res
   * @returns
   */
  deleteBook = (req, res) => {
    try {
      const { bookId } = req.params;

      bookService.deleteBook(bookId, (error, data) => {
        if (error) {
          return res.status(400).send({
            success: false,
            message: "Some error occurred while deleting the data",
          });
        }
        return res.status(200).send({
          success: true,
          message: "Book deleted successfully!!",
          data,
        });
      });
    } catch (error) {
      console.error("Error deleting book:", error);
      return res.status(500).send({
        success: false,
        message: "Internal server error",
      });
    }
  };
}

module.exports = new BookController();
