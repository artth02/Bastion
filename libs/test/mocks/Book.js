const { faker } = require('@faker-js/faker')

class Book {
  constructor (data = {}) {
    this.symbol = data
    this.bid = {
      quantity: faker.number.int({ min: 100, max: 5000 }),
      value: Number(faker.helpers.arrayElement([data.lastPrice, data.lastPrice - 0.01, data.lastPrice + 0.01])).toFixed(2)
    }
    this.ask = {
      quantity: faker.number.int({ min: 100, max: 5000 }),
      value: Number(faker.helpers.arrayElement([data.lastPrice, data.lastPrice - 0.01, data.lastPrice + 0.01])).toFixed(2)
    }
  }
}

module.exports = Book
