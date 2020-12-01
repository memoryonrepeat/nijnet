const {rest} = require('msw')
const config = require('../config')
const ARTIST_ID = 1234

const getArtistIdHandler = rest.get(`${config.baseURL}/search?q=linkin%20park`, (req, res, ctx) => {
  // console.log('Request is being intercepted:', req.url)
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
