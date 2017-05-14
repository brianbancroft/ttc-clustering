'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query('CREATE EXTENSION postgis;')
  }
};
