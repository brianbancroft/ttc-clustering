exports.mobileIndex = (req, res) => res.render('mobile/index')
exports.desktopIndex = (req, res) => res.render('desktop/index')
exports.view404page = (req, res) => res.render('mobile/errorpage', {data: {error: 'Page not found'}})