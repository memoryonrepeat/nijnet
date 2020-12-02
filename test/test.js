const {server} = require('../mocks/server')
const r = require('../helper/request')
const {getArtistSongs} = require('../handler')

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
      const res = await r.getArtistId('Linkin Park')
      expect(res).toBe(1234)
    })

    it('should return case-insensitive results when fetching artist id', async () => {
      const res1 = await r.getArtistId('Linkin park')
      expect(res1).toBe(1234)

      const res2 = await r.getArtistId('linkin park')
      expect(res2).toBe(1234)
    })

    it('should return undefined on invalid artist', async () => {
      const res = await r.getArtistId('some random guy')
      expect(res).toBe(undefined)
    })

    it('should be able to fetch all songs given valid artistId', async () => {
      const res = await r.getSongs(1234)
      expect(res).toEqual(['From the inside', 'Numb', 'In the end'])
    })

    it('should be able to fetch all songs given valid artist name', async () => {
      const res = await getArtistSongs('linkin park')
      expect(res).toEqual(['From the inside', 'Numb', 'In the end'])
    })
  })

  describe('should be able to handle unhealthy API()', () => {
    it('should not crash on API schema changes', async () => {
      expect(() => { r.getArtistId('schema change') }).not.toThrow()
      expect(await r.getArtistId('schema change')).toBe(undefined)
    })

    it('should be able to retry on unsuccessful response', async () => {
      const spy = jest.spyOn(r, 'axiosRequest')
      await r.getArtistId('5xx error')
      expect(spy).toHaveBeenCalledTimes(5)
    })
  })
})
