const faker = require('faker')

class Order {
  constructor(data = {}) {
    const price = faker.random.number({ min: 100, max: 300 })
    const quantity = faker.random.number({ min: 1, max: 100 })
    const status = faker.random.arrayElement([
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
      executedPrice: faker.random.arrayElement([price, price - 1, price + 1]),
      executedQuantity: faker.random.arrayElement([quantity, quantity - 1])
    }
    this.type = faker.random.arrayElement(['buy', 'sell'])
    this.category = faker.random.arrayElement(['Limitada', 'Stop', 'Start', 'Stop Móvel', 'Estratégica', 'Termo'])
    this.status = status
  }
}

module.exports = Order
