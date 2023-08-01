const config = require('./index');

module.exports = {
  development: {
    "username": process.env.POSTGRESQL_DB_USER,
    "password": null,
    "database": process.env.POSTGRESQL_DB_NAME,
    "host": 'localhost',
    "dialect": 'postgres'
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    seederStorage: 'sequelize',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
}
