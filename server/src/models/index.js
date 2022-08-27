const dbConfig = require("../config/db.config");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.books = require("./books.model")(sequelize, Sequelize);
db.user = require("./users.model")(sequelize, Sequelize);
db.role = require("./role.model")(sequelize, Sequelize);

db.Userbooks = sequelize.define("user_books", {
  // id: {
  //   type: Sequelize.INTEGER,
  //   primaryKey: true,
  //   autoIncrement: true,
  // },
  issuedDate: {
    type: Sequelize.DATEONLY,
  },
  returnDate: {
    type: Sequelize.DATEONLY,
  },
});

db.role.belongsToMany(db.user, {
  through: "user_roles",
  // as: "user",
  foreignKey: "roleId",
  otherKey: "userId",
});

db.user.belongsToMany(db.role, {
  through: "user_roles",
  // as: "role",
  foreignKey: "userId",
  otherKey: "roleId",
});

db.books.belongsToMany(db.user, {
  through: db.Userbooks,
  as: "users",
  foreignKey: "bookId",
  // otherKey: "userId",
});

db.user.belongsToMany(db.books, {
  through: db.Userbooks,
  as: "books",
  foreignKey: "userId",
  // otherKey: "bookId",
});

db.ROLES = ["user", "admin"];

module.exports = db;
