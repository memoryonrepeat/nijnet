const {getArtistSongs} = require('./handler')

const artist = 'linkin park'

const main = async () => {
  return getArtistSongs(artist)
}

main()
