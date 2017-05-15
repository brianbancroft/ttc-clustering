// Bus Locations model
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('BusLocation', {
    route: Sequelize.INTEGER,
    time: Sequelize.TIME,
    is_clustered: Sequelize.BOOLEAN,
    direction_tag: Sequelize.STRING,
    heading: Sequelize.INTEGER,
    point: Sequelize.GEOMETRY('POINT')
  })
}