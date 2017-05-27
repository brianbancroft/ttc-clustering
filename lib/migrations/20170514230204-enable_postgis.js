module.exports = {
  up: function (queryInterface) {
    return queryInterface.sequelize.query('CREATE EXTENSION postgis;')
  }
}
