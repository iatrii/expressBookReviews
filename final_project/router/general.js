const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (isValid(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});

//return res.status(300).json({message: "Yet to be implemented"});
});

function retrieveBooks() {
    return new Promise((resolve, reject) => {
      resolve(books);
    });
  }
  
// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here

  retrieveBooks().then(
    (books) => res.status(200).send(JSON.stringify(books, null, 4)),
    (error) =>
      res.status(404).send("An error has occured trying to retrieve all the books")
  );  
});

function retrieveBookFromISBN(isbn) {
    let book = books[isbn];
    return new Promise((resolve, reject) => {
      if (book) {
        resolve(book);
      } else {
        reject(new Error("The provided book does not exist"));
      }
    });
  }

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  retrieveBookFromISBN(isbn).then(
    (book) => res.status(200).send(JSON.stringify(book, null, 4)),
    (err) => res.status(404).send(err.message)
  );
  //return res.status(300).json({message: "Yet to be implemented"});
 });

 function retrieveBookFromAuthor(author) {
    let validBooks = [];
    return new Promise((resolve, reject) => {
      for (let bookISBN in books) {
        const bookAuthor = books[bookISBN].author;
        if (bookAuthor === author) {
          validBooks.push(books[bookISBN]);
        }
      }
      if (validBooks.length > 0) {
        resolve(validBooks);
      } else {
        reject(new Error("The provided author does not exist"));
      }
    });
  }
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;

  retrieveBookFromAuthor(author).then(
    (books) => res.status(200).send(JSON.stringify(books, null, 4)),
    (err) => res.status(404).send(err.message)
  );
  //return res.status(300).json({message: "Yet to be implemented"});
});

function retrieveBookFromTitle(title) {
    let validBooks = [];
    return new Promise((resolve, reject) => {
      for (let bookISBN in books) {
        const bookTitle = books[bookISBN].title;
        if (bookTitle === title) {
          validBooks.push(books[bookISBN]);
        }
      }
      if (validBooks.length > 0) {
        resolve(validBooks);
      } else {
        reject(new Error("The provided book title does not exist"));
      }
    });
  }

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  retrieveBookFromTitle(title).then(
    (book) => res.status(200).send(JSON.stringify(book, null, 4)),
    (err) => res.status(404).send(err.message)
  );
  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  //Write your code here
  const isbn = req.params.isbn;
  if (books[isbn] !== null) {
    res.send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    return res.status(404).json({ message: "Provided book does not exist" });
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
