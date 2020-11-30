require('dotenv').config()

const axios = require('axios')
const config = require('../config')

const CLIENT_ACCESS_TOKEN = process.env.CLIENT_ACCESS_TOKEN

const request = async (url, params = {}) => {
  try {
    const response = await axios.get(url, {
      baseURL: config.baseUrl,
      headers: {
        Authorization: `Bearer ${CLIENT_ACCESS_TOKEN}`
      },
      params
    })

    // console.log(JSON.stringify(response.data))

    return response.data
  } catch (error) {
    console.log(error)
  }
}

// request('search', {q: 'Imagine Dragons'})
// request('songs/378195')

exports.request = request
