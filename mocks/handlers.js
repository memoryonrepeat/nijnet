import {rest} from 'msw'
const config = require('../config')

export const handlers = [
  rest.get(`${config.baseURL}/search?q=linkin%20park`, (req, res, ctx) => {
    // If authenticated, return a mocked user details
    return res(
      ctx.status(200),
      ctx.json({
        response: {
          hits: [
            {
              result: {
                title: 'Numb',
                primary_artist: {
                  name: 'Linkin Park'
                }
              }
            },
            {
              result: {
                title: 'From the inside',
                primary_artist: {
                  name: 'Linkin Park'
                }
              }
            },
            {
              result: {
                title: 'In the end',
                primary_artist: {
                  name: 'Linkin Park'
                }
              }
            }
          ]
        }
      })
    )
  })
]
