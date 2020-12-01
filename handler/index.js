const {getArtistId, getSongs} = require('../helper/request')

exports.getArtistSongs = async (artist) => {
  try {
    const artistId = await getArtistId(artist)
    if (!artistId) {
      console.log('No such artist found.')
      return []
    }

    const songs = await getSongs(artistId)

    console.log(JSON.stringify(songs))

    return songs
  } catch (err) {
    console.log(err)
  }
}
