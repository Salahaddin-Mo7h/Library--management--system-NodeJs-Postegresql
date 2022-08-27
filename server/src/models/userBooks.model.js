module.exports = (sequelize, Sequelize) => {
  const Userbooks = sequelize.define("userBooks", {
    userId: {
      type: Sequelize.INTEGER,
    },
    bookId: {
      type: Sequelize.INTEGER,
    },
    issuedDate: {
      type: Sequelize.DATEONLY,
    },
    returnDate: {
      type: Sequelize.DATEONLY,
    },
  });

  return Userbooks;
};
