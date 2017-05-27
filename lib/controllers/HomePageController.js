const RenderViews = require('../views/RenderViews')

exports.homePage = (req, res) => req.useragent.isMobile ?
  RenderViews.mobileIndex(req, res) :
  RenderViews.desktopIndex(req, res)
