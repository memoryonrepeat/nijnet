require('dotenv').config()

const axios = require('axios')
const config = require('../config')

const CLIENT_ACCESS_TOKEN = process.env.CLIENT_ACCESS_TOKEN

const request = async (url, params = {}) => {
  try {
    const response = await axios.get(url, {
      ...config.baseURL && {baseURL: config.baseURL},
      ...config.proxy && {proxy: config.proxy},
      params,
      headers: {
        Authorization: `Bearer ${CLIENT_ACCESS_TOKEN}`
      }
    })

    return response.data
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data)
      console.log(error.response.status)
      console.log(error.response.headers)
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error)
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log(error.message)
    }
    console.log(error.config)
  }
}

const getArtistId = async (artist) => {
  const searchResults = await request('search', {q: artist})

  // TODO try catch / optional chaining / fallback
  return searchResults?.response?.hits?.find((hit) => hit?.result?.primary_artist?.name === artist)?.result?.primary_artist?.id
}

const getSongs = async (artistId) => {
  let songs = []
  let page = 1

  while (true) {
    const result = await request(`artists/${artistId}/songs`, {page, ...config.per_page && {per_page: config.per_page}})

    if (result.response.songs.length === 0) {
      break
    }

    songs = [...songs, ...result.response.songs.map((song) => song.title)]

    page += 1
  }

  return songs
}

// request('search', {q: 'Imagine Dragons'})
// request('songs/378195')

exports.request = request
exports.getArtistId = getArtistId
exports.getSongs = getSongs
