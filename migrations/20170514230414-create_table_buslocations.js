'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('bus_locations', { 
      id: {
        type: Sequelize.INTEGER(),
        primaryKey: true,
        autoIncrement: true
      },
      route: {
        type: Sequelize.INTEGER
      },
      time: {
        type: Sequelize.TIME
      },
      is_clustered: {
        type: Sequelize.BOOLEAN
      },
      direction_tag: {
        type: Sequelize.STRING
      },
      heading: {
        type: Sequelize.INTEGER
      },
      point: {
        type: Sequelize.GEOMETRY('POINT')
      }
    });
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('bus_locations');
  }
};
