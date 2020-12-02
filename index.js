const {getArtistSongs} = require('./handler')

const artist = process.argv[2] || 'linkin park'

const main = async () => {
  return getArtistSongs(artist)
}

main()
