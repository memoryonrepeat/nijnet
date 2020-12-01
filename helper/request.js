require('dotenv').config()
const Bottleneck = require('bottleneck')

const axios = require('axios')
const config = require('../config')

const CLIENT_ACCESS_TOKEN = process.env.CLIENT_ACCESS_TOKEN
const MAX_RETRY = 5
const RETRY_WAIT = 2000

const limiter = new Bottleneck({
  minTime: 333,
  maxConcurrent: 1
})

const sleep = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, timeout)
  })
}

const axiosRequest = async (url, params = {}, retryCount = 0) => {
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
    if (error.response || error.request) {
      // Response is not 2xx or not exists due to timeout
      // In either case, retry until MAX_RETRY
      const message = error.response || error.request

      console.log(`Request failed on ${retryCount} try`, message)

      if (retryCount === MAX_RETRY) {
        console.log('Max retry reached. Stopping.')
        return
      }

      await sleep(RETRY_WAIT)

      return this.axiosRequest(url, params, retryCount + 1)
    } else {
      // Something happened in setting up the request that triggered an Error
      // No retry in this case as the result will be the same
      console.log(error.message)
    }
  }
}

const request = limiter.wrap(axiosRequest)

const getArtistId = async (artist) => {
  artist = artist.toLowerCase() // Make search case-insensitive

  const searchResults = await request('search', {q: artist})

  // TODO try catch / optional chaining / fallback
  return searchResults?.response?.hits?.find((hit) => hit?.result?.primary_artist?.name?.toLowerCase() === artist)?.result?.primary_artist?.id
}

const getSongs = async (artistId) => {
  if (!artistId) {
    console.log('Invalid artistId')
    return []
  }

  let songs = []
  let page = 1

  while (true) {
    console.log(`Fetching page ${page}`)
    const result = await request(`artists/${artistId}/songs`, {page, ...config.per_page && {per_page: config.per_page}})

    if (!result?.response?.next_page) {
      break
    }

    songs = [...songs, ...result.response.songs.map((song) => song.title)]

    page = result.response.next_page
  }

  return songs
}

// request('search', {q: 'Imagine Dragons'})
// request('songs/378195')

exports.axiosRequest = axiosRequest
exports.request = request
exports.getArtistId = getArtistId
exports.getSongs = getSongs
