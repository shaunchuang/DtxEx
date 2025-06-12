require('dotenv').config();

module.exports = {
  "development": {
    "username": process.env.DB_USER || "root",
    "password": process.env.DB_PASSWORD || "",
    "database": process.env.DB_NAME || "medical_questionnaire",
    "host": process.env.DB_HOST || "localhost",
    "port": process.env.DB_PORT || 3306,
    "dialect": "mariadb",
    "logging": console.log,
    "pool": {
      "max": 10,
      "min": 0,
      "acquire": 30000,
      "idle": 10000
    }
  },
  "test": {
    "username": process.env.DB_USER || "root",
    "password": process.env.DB_PASSWORD || "",
    "database": process.env.DB_NAME + "_test" || "medical_questionnaire_test",
    "host": process.env.DB_HOST || "localhost",
    "port": process.env.DB_PORT || 3306,
    "dialect": "mariadb",
    "logging": false
  },
  "production": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "port": process.env.DB_PORT,
    "dialect": "mariadb",
    "logging": false,
    "pool": {
      "max": 20,
      "min": 5,
      "acquire": 30000,
      "idle": 10000
    }
  }
};
