require('dotenv').config()

const axios = require('axios')

const CLIENT_ACCESS_TOKEN = process.env.CLIENT_ACCESS_TOKEN
const PER_PAGE = 50
const artist = 'Imagine Dragons'

const request = async (url, params = {}) => {
  try {
    const response = await axios.get(url, {
      baseURL: 'https://api.genius.com',
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

const getArtistId = async (artist) => {
  const searchResults = await request('search', {q: artist})
  
  // TODO try catch / optional chaining / fallback
  return searchResults?.response?.hits?.find((hit) => hit?.result?.primary_artist?.name === artist)?.result?.primary_artist?.id
}

const getSongs = async (artistId) => {
  let songs = []
  let page = 1

  while (true) {
    const result = await request(`artists/${artistId}/songs`, { page, per_page: PER_PAGE})

    console.log({result})

    if (result.meta.status !== 200 || result.response.songs.length === 0) {
      break
    }

    songs = [...songs, ...result.response.songs.map((song) => song.title)]

    page += 1
  }

  return songs
}

const main = async () => {
  const artistId = await getArtistId(artist)
  if (!artistId){
    console.log('No such artist found.')
    return []
  }

  const songs = await getSongs(artistId)

  console.log(JSON.stringify(songs))

  return songs
}

main()
