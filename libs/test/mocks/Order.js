const { faker } = require('@faker-js/faker')

class Order {
  constructor (data = {}) {
    const price = faker.number.int({ min: 100, max: 300 })
    const quantity = faker.number.int({ min: 1, max: 100 })
    const status = faker.helpers.arrayElement([
      {
        id: 1,
        description: 'executed'
      },
      {
        id: 2,
        description: 'partialy executed'
      },
      {
        id: 3,
        description: 'canceled'
      },
      {
        id: 4,
        description: 'in process'
      }
    ])

    this.symbol = {
      name: data.name,
      description: data.description,
      requiredPrice: price,
      requiredQuantity: quantity,
      executedPrice: faker.helpers.arrayElement([price, price - 1, price + 1]),
      executedQuantity: faker.helpers.arrayElement([quantity, quantity - 1])
    }
    this.type = faker.helpers.arrayElement(['buy', 'sell'])
    this.category = faker.helpers.arrayElement(['Limitada', 'Stop', 'Start', 'Stop Móvel', 'Estratégica', 'Termo'])
    this.status = status
  }
}

module.exports = Order
