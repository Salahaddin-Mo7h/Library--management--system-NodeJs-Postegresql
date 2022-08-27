module.exports = (sequelize, Sequelize) => {
  const Book = sequelize.define("book", {
    title: {
      type: Sequelize.STRING,
    },
    author: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.STRING,
    },
    isIssue: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  });

  return Book;
};
