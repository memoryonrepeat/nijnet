const deepEqualInAnyOrder = require('deep-equal-in-any-order')
const chai = require('chai')

chai.use(deepEqualInAnyOrder)

const {expect} = chai

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
  describe('#alerting()', () => {

  })
})
