// user name = broker then login fails ortherwise success

class Login {
  constructor (data = {}) {
    this.user = {
      name: data.userName
    }

    this.authenticated = data.userName !== 'broker'
  }
}

module.exports = Login
