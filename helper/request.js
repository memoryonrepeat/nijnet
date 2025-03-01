require('dotenv').config()

const Bottleneck = require('bottleneck')

const axios = require('axios')
const config = require('../config')

const CLIENT_ACCESS_TOKEN = process.env.CLIENT_ACCESS_TOKEN
const MAX_RETRY = 5
const RETRY_WAIT = 1000

// Use Bottleneck for rate limiter
// Not really needed in this case since
// there is already custom-made retry mechanism
// But I just put it here as a fallback solution
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

      console.log(message.status, message.statusText, error.response.data)

      if (retryCount === MAX_RETRY) {
        console.log('Max retry reached. Stopping.')
        return
      }

      await sleep(RETRY_WAIT)

      console.log('Retrying. Count: ', retryCount)

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

  const searchResults = await this.request('search', {q: artist})

  return searchResults?.response?.hits?.find(
    (hit) => hit?.result?.primary_artist?.name?.toLowerCase() === artist
  )?.result?.primary_artist?.id
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
    const result = await this.request(
      `artists/${artistId}/songs`,
      {
        page,
        ...config.per_page && {per_page: config.per_page}
      }
    )

    if (!result?.response?.next_page) {
      break
    }

    songs = [...songs, ...result.response.songs.map((song) => song.title)]

    page = result.response.next_page
  }

  // Potentially remove duplicates
  return [...new Set(songs)]
}

exports.axiosRequest = axiosRequest
exports.request = request
exports.getArtistId = getArtistId
exports.getSongs = getSongs
