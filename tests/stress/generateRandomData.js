module.exports = {
  generateRandomData
}

const faker = require("faker")

function generateRandomData(userContext, events, done) {
  const userId = faker.internet.userName()
  const position = "student"
  const owner = userId
  const region = faker.address.streetName()
  const schoolName = `${faker.address.streetName()}학교`
  const type = "general"
  const contents = faker.lorem.paragraphs()

  userContext.vars.userId = userId
  userContext.vars.position = position
  userContext.vars.owner = owner
  userContext.vars.region = region
  userContext.vars.schoolName = schoolName
  userContext.vars.type = type
  userContext.vars.contents = contents
  return done()
}
