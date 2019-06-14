const axios = require('axios')

class NewsController {
  static getAll (req, res, next) {
    axios({
      method: 'get',
      url: `https://newsapi.org/v2/everything?q=fortnite&apiKey=c56cdc238523471c9667a15ef25180f7`
    })
      .then(({data}) => {
        res.status(200).json(data)
      })
      .catch(next)
  }
}

module.exports = NewsController