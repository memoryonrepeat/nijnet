require('dotenv').config()

const axios = require('axios')

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const CLIENT_ACCESS_TOKEN = process.env.CLIENT_ACCESS_TOKEN

const request = async (url, params) => {
  try {
    const response = await axios.get(url, {
      baseURL: 'https://api.genius.com',
      headers: {
        Authorization: `Bearer ${CLIENT_ACCESS_TOKEN}`
      },
      params: params || {}
    })

    // console.log(JSON.stringify(response.data))

    return response.data
  } catch (error) {
    console.log(error)
  }
}

// request('search', {q: 'Imagine Dragons'})
// request('songs/378195')

const getArtistId = async (artist) => {
  const searchResults = await request('search', {q: artist})
  
  // TODO try catch / optional chaining / fallback
  return searchResults?.response?.hits?.find((hit) => hit?.result?.primary_artist?.name === artist)?.result?.primary_artist?.id
}

const main = async () => {
  const artistId = await getArtistId('Imagine Dragons')
  console.log({artistId})
}

main()
