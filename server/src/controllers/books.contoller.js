const db = require("../models");
const Book = db.books;
const Userbooks = db.Userbooks;
const User = db.user;
// const Op = db.Sequelize.Op;

// Create and Save a new Book
exports.saveBook = async (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Save Book detail in the database
  await Book.create(req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the book detail.",
      });
    });
};

// All books -- /api/books
// Available books -- /api/books?isIssue=false
// Not Available books -- /api/books?isIssue=true
// Retrieve all Books from the database.
exports.getBooks = async (req, res) => {
  const isIssue = req.query.isIssue;
  var condition = isIssue ? { isIssue: isIssue } : null;

  await Book.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving books.",
      });
    });
};

// get single book
exports.getBook = async (req, res) => {
  const id = req.params.id;

  await Book.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Book with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Book with id=" + id,
      });
    });
};

// Issue a Book by the id in the request
exports.issueBook = async (req, res) => {
  const id = req.params.id;
  var issuedDate = new Date();
  const data = {
    isIssue: req.body.isIssue,
    userId: req.body.userId,
    bookId: id,
    issuedDate: issuedDate,
  };

  await Book.update(data, {
    where: { id: id },
  })
    .then(() => {
      if (req.body.isIssue) {
        Userbooks.create(data)
          .then((data) => {
            res.send(data);
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message ||
                "Some error occurred while creating the user book detail.",
            });
          });
      } else {
        res.send({
          message: "Book is already issued!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Book with id=" + id,
      });
    });
};

// Return a Book by the id in the request
exports.returnBook = async (req, res) => {
  const id = req.params.id;
  var returnDate = new Date();
  const data = {
    isIssue: req.body.isIssue,
    returnDate: returnDate,
  };

  await Book.update(data, {
    where: { id: id },
  })
    .then(() => {
      if (!req.body.isIssue) {
        Userbooks.update(data, {
          where: { bookId: id },
        })
          .then((data) => {
            res.send(data);
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message ||
                "Some error occurred while creating the user book detail.",
            });
          });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Book with id=" + id,
      });
    });
};

// get all usersBooks
exports.getUsersIssuedBooks = async (req, res) => {
  await Book.findAll({
    include: [
      {
        model: User,
        as: "users",
        attributes: ["id", "username"],
        through: {
          attributes: ["issuedDate", "returnDate"],
        },
      },
    ],
  })
    .then((usersbooks) => {
      res.send(usersbooks);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Some error occurred while retrieving usersbooks.",
      });
    });
};

// get userNot-ReturnBooks
exports.getUserBooks = async (req, res) => {
  const id = req.params.id;
  await User.findByPk(id, {
    include: [
      {
        model: Book,
        as: "books",
        // attributes: ["id", "title", "author", "description", "isIssue"],
        where: { isIssue: true },
        through: {
          attributes: [],
        },
      },
    ],
  })
    .then((userbooks) => {
      if (userbooks == undefined) {
        res.send({ message: "No books is issued" });
      } else {
        res.send(userbooks);
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Some error occurred while retrieving userbooks.",
      });
    });
};

// get userNot-ReturnBooks
exports.getUserReadBooks = async (req, res) => {
  const id = req.params.id;
  await User.findByPk(id, {
    include: [
      {
        model: Book,
        as: "books",
        through: {
          attributes: [],
        },
      },
    ],
  })
    .then((userbooks) => {
      res.send(userbooks);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Some error occurred while retrieving userbooks.",
      });
    });
};

// Issue a Book by the id in the request
exports.updateBook = async (req, res) => {
  const id = req.params.id;

  await Book.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Book was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Book with id=${id}. Maybe Book was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Book with id=" + id,
      });
    });
};

exports.deleteBook = (req, res) => {
  const id = req.params.id;

  Book.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Book was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Book with id=${id}. Maybe Book was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Book with id=" + id,
      });
    });
};
