exports.homePage = (req, res) => {
  res.render('index', {
    data : {
      title: 'Home Page'
    }
  })
}