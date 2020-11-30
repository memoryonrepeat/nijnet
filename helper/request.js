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

const getArtistId = async (artist) => {
  const searchResults = await request('search', { q: artist })

  // TODO try catch / optional chaining / fallback
  return searchResults?.response?.hits?.find((hit) => hit?.result?.primary_artist?.name === artist)?.result?.primary_artist?.id
}

const getSongs = async (artistId) => {
  let songs = []
  let page = 1

  while (true) {
    const result = await request(`artists/${artistId}/songs`, { page, per_page: config.per_page })

    console.log({ result })

    if (result.meta.status !== 200 || result.response.songs.length === 0) {
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