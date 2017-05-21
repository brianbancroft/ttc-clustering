'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('BusLocations', { 
      id: {
        type: Sequelize.INTEGER(),
        primaryKey: true,
        autoIncrement: true
      },
      route: {
        type: Sequelize.STRING
      },
      timeSinceLast: {
        type: Sequelize.INTEGER
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
      }, 
      createdAt: {
        type: Sequelize.TIME
      },
      updatedAt: {
        type: Sequelize.TIME
      }
    });
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('BusLocations');
  }
};
