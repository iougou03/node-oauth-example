// @ts-check

const { v4: uuidv4 } = require('uuid')

const { getUsersCollection } = require('./mongo')
const { signJWT } = require('./jwt')

/**
 * @param {string} facebookId
 * @returns {Promise<string>}
 */
async function createUserWithFacebookIdAndGetId(facebookId) {
  const users = await getUsersCollection()
  const userId = uuidv4()
  await users.insertOne({
    id: userId,
    facebookId,
  })
  return userId
}

/**
 * @param {string} userId
 */
async function getAccessTokenForUserId(userId) {
  return signJWT(userId)
}

module.exports = {
  createUserWithFacebookIdAndGetId,
  getAccessTokenForUserId,
}
