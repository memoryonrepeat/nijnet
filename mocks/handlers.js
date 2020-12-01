const {rest} = require('msw')
const config = require('../config')
const ARTIST_ID = 1234

const getArtistIdHandler = rest.get(`${config.baseURL}/search`, (req, res, ctx) => {
  // console.log('Request is being intercepted:', req.url)
  const q = req.url.searchParams.get('q')

  if (q.toLowerCase() === 'linkin park') {
    return res(
      ctx.status(200),
      ctx.json({
        response: {
          hits: [
            {
              result: {
                title: 'Numb',
                primary_artist: {
                  id: ARTIST_ID,
                  name: 'Linkin Park'
                }
              }
            },
            {
              result: {
                title: 'From the inside',
                primary_artist: {
                  id: ARTIST_ID,
                  name: 'Linkin Park'
                }
              }
            },
            {
              result: {
                title: 'In the end',
                primary_artist: {
                  id: ARTIST_ID,
                  name: 'Linkin Park'
                }
              }
            }
          ]
        }
      })
    )
  }

  if (q.toLowerCase() === 'schema change') {
    return res(
      ctx.status(200),
      ctx.json({
        response: { // Assuming this API suddenly becomes a movie database
          movies: [
            {
              result: 'Westworld'
            },
            {
              result: 'The boys'
            }
          ]
        }
      })
    )
  }

  if (q.toLowerCase() === '5xx error') {
    return res(
      ctx.status(500),
      ctx.json({
        response: 'Internal server error'
      })
    )
  }
})

const getSongsHandler = rest.get(`${config.baseURL}/artists/${ARTIST_ID}/songs`, (req, res, ctx) => {
  // console.log('Request is being intercepted:', req.url)
  const page = req.url.searchParams.get('page')

  if (page === '1') {
    return res(
      ctx.status(200),
      ctx.json({
        response: {
          songs: [
            {
              title: 'From the inside'
            },
            {
              title: 'Numb'
            },
            {
              title: 'In the end'
            }
          ],
          next_page: 2
        }
      })
    )
  }

  return res(
    ctx.status(200),
    ctx.json({
      response: {
        songs: [],
        next_page: null
      }
    })
  )
})

exports.handlers = [
  getArtistIdHandler,
  getSongsHandler
]
