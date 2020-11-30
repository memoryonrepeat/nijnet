const {getArtistId, getSongs} = require('./helper/request')
const config = require('./config')

const artist = 'Imagine Dragons'

const main = async () => {
  const artistId = await getArtistId(artist)
  if (!artistId) {
    console.log('No such artist found.')
    return []
  }

  const songs = await getSongs(artistId)

  console.log(JSON.stringify(songs))

  return songs
}

main()
