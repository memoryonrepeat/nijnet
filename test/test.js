const {server} = require('../mocks/server')
const {getArtistId, getSongs} = require('../helper/request')
const {getArtistSongs} = require('../handler')

const sleep = (timeout) => {
  console.log(`Going to sleep for ${timeout} milliseconds`)
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Woken up from sleep')
      resolve()
    }, timeout)
  })
}

describe('handlers', () => {
  // Establish API mocking before all tests.
  beforeAll(() => server.listen())
  // Reset any request handlers that we may add during the tests,
  // so they don't affect other tests.
  afterEach(() => server.resetHandlers())
  // Clean up after the tests are finished.
  afterAll(() => server.close())

  describe('should be able to handle healthy API()', () => {
    it('should be able to fetch id of valid artist', async () => {
      const res = await getArtistId('Linkin Park')
      expect(res).toBe(1234)
    })

    it('should return case-insensitive results when fetching artist id', async () => {
      const res1 = await getArtistId('Linkin park')
      expect(res1).toBe(1234)

      const res2 = await getArtistId('linkin park')
      expect(res2).toBe(1234)
    })

    it('should return undefined on invalid artist', async () => {
      const res = await getArtistId('some random guy')
      expect(res).toBe(undefined)
    })

    it('should be able to fetch all songs given valid artistId', async () => {
      const res = await getSongs(1234)
      expect(res).toEqual(['From the inside', 'Numb', 'In the end'])
    })

    it('should be able to fetch all songs given valid artist name', async () => {
      const res = await getArtistSongs('linkin park')
      expect(res).toEqual(['From the inside', 'Numb', 'In the end'])
    })
  })

  describe('should be able to handle unhealthy API()', () => {
    it('should be able to retry on unsuccessful response', async () => {
      const res = await getSongs(1234)
      expect(res).toEqual(['From the inside', 'Numb', 'In the end'])
    })

    it('should be able to retry on timeout', async () => {

    })

    it('should not crash on API schema changes', async () => {

    })
  })
})
