const sleep = (timeout) => {
  console.log(`Going to sleep for ${timeout} milliseconds`)
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Woken up from sleep')
      resolve()
    }, timeout)
  })
}

describe('nijnet', () => {
  describe('should be able to handle healthy API()', () => {
    it('should be able to fetch id of valid artist', async () => {

    })

    it('should throw error on invalid artist', async () => {

    })

    it('should be able to fetch all songs from valid artist', async () => {

    })

    it('should return case-insensitive results', async () => {

    })
  })

  describe('should be able to handle unhealthy API()', () => {
    it('should be able to retry on unsuccessful response', async () => {

    })

    it('should be able to retry on timeout', async () => {

    })

    it('should not crash on API schema changes', async () => {

    })
  })
})
