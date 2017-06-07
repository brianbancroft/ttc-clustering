exports.homePage = (req, res) => req.useragent.isMobile ?
  res.render('index', {cssSheet: 'mobile'}) :
  res.render('index', {cssSheet: 'desktop'})

exports.view404page = (req, res) => req.useragent.isMobile ?
res.render(
  'mobile/errorpage',
  {
    data: {error: 'Page not found'},
    cssSheet: 'mobile'
  }
) :
res.render(
  'mobile/errorpage',
  {
    data: {error: 'Page not found'},
    cssSheet: 'desktop'
  }
)
