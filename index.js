const {getArtistSongs} = require('./handler')

const artist = 'Linkin park'

const main = async () => {
  return getArtistSongs(artist)
}

main()
