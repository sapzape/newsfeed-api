const faker = require('faker');

module.exports = {
  generates(count, attrs = {}) {
    let datas = [];
    for (i = 0; i < count; i++) {
      if (whileList.indexOf(key) > -1) {
        datas.push(this.generate(attrs));
      }
    }
      return datas;
  },

  generate(attrs) {
    return Object.assign({}, {
      userId: faker.internet.userName,
    }, attrs);
  }
};