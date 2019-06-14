const axios = require('axios')

class ItemController {
  static getAll (req, res, next) {
    axios({
      method: 'get',
      url: `https://fortnite-api.theapinetwork.com/items/list`,
      headers: {
        Authorization: 'b59aa297eec7913756305ef69c991a7f'
      }
    })
      .then(({data}) => {
        res.status(200).json(data)
      })
      .catch(next)
  }

  static getDetail (req, res, next) {
    axios({
      method: 'get',
      url: `https://fortnite-api.theapinetwork.com/item/get?id=${req.params.id}`,
      headers: {
        Authorization: 'b59aa297eec7913756305ef69c991a7f'
      }
    })
      .then(({data}) => {
        res.status(200).json(data)
        
      })
      .catch(next)
  }
}

module.exports = ItemController