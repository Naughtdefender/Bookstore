/* eslint-disable consistent-return */
/* eslint-disable max-len */
/**
 * @module       Model
 * @file         book.js
 * @description  Schema holds the database Schema
 * @since        13/08/2021
-----------------------------------------------------------------------------------------------*/

const mongoose = require("mongoose");

// Define the schema for books
const bookSchema = new mongoose.Schema(
  {
    author: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    isAddedToBag: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

// Create the Book model
const Book = mongoose.model("book", bookSchema);

class BookModel {
  /**
   * @description Method to create a new book
   * @param {Object} bookData - Book data to be saved
   * @returns {Promise<Object>} - The created book
   */
  async createBook(bookData) {
    try {
      const book = new Book(bookData);
      return await book.save();
    } catch (error) {
      throw new Error(`Error creating book: ${error.message}`);
    }
  }

  /**
   * @description Method to fetch all books
   * @returns {Promise<Array>} - List of all books
   */
  async get() {
    try {
      return await Book.find({});
    } catch (error) {
      throw new Error(`Error fetching books: ${error.message}`);
    }
  }

  /**
   * @description Method to update a book by ID
   * @param {Object} data - Data to update the book
   * @returns {Promise<Object>} - The updated book
   */
  async updateBook(data) {
    try {
      const updatedBook = await Book.findByIdAndUpdate(
        data.bookId,
        {
          author: data.author,
          title: data.title,
          image: data.image,
          quantity: data.quantity,
          price: data.price,
          description: data.description,
        },
        { new: true } // Return the updated document
      );

      if (!updatedBook) {
        throw new Error("Book not found");
      }

      return updatedBook;
    } catch (error) {
      throw new Error(`Error updating book: ${error.message}`);
    }
  }

  /**
   * @description Method to delete a book by ID
   * @param {String} bookId - ID of the book to delete
   * @returns {Promise<Object>} - The deleted book
   */
  async deleteBook(bookId) {
    try {
      const deletedBook = await Book.findByIdAndRemove(bookId);

      if (!deletedBook) {
        throw new Error("Book not found");
      }

      return deletedBook;
    } catch (error) {
      throw new Error(`Error deleting book: ${error.message}`);
    }
  }
}

module.exports = new BookModel();
