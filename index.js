const {getArtistSongs} = require('./handler')

const artist = 'Imagine Dragons'

const main = async () => {
  return getArtistSongs(artist)
}

main()
