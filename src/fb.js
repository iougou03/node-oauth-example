/* eslint-disable prefer-destructuring */

const fetch = require('node-fetch')
const { v4: uuidv4 } = require('uuid')
const { getAccessTokenForUserId } = require('./auth')
const { getUsersCollection } = require('./mongo')

/** @type {string} */
const FB_APP_ID = process.env.FB_APP_ID
/** @type {string} */
const FB_CLIENT_SECRET = process.env.FB_CLIENT_SECRET

/**
 * @param {string} facebookId
 * @returns {Promise<string>}
 */
async function createUserWithFacebookIdAndGetId(facebookId) {
  // TOOD: implement it
  const users = await getUsersCollection()
  const userId = uuidv4()
  await users.insertOne({
    id: userId,
    facebookId,
  })

  return userId
}

/**
 * @param {string} accessToken
 * @returns {Promise<string>}
 */
async function getFacebookIdFromAccessToken(accessToken) {
  // TODO: implement the function using Facebook API
  // https://developers.facebook.com/docs/facebook-login/access-tokens/#generating-an-app-access-token
  const appAccessTokenReq = await fetch(
    `https://graph.facebook.com/oauth/access_token?client_id=${FB_APP_ID}&client_secret=${FB_CLIENT_SECRET}&grant_type=client_credentials`
  )

  const appAccessToken = (await appAccessTokenReq.json()).access_token

  // https://developers.facebook.com/docs/graph-api/reference/v10.0/debug_token
  const debugReq = await fetch(
    `https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${appAccessToken}`
  )

  const debugResult = await debugReq.json()

  if (debugResult.data.app_id !== FB_APP_ID) {
    throw new Error('Not a valid access token')
  }

  return debugResult.data.user_id
}

/**
 * @param {string} facebookId
 * @returns {Promise<string | undefined>}
 */
async function getUserIdWithFacebookId(facebookId) {
  // TODO: implement it
  const users = await getUsersCollection()
  const user = await users.findOne({
    facebookId,
  })

  if (user) {
    return user.id
  }

  return undefined
}

/**
 * @param {string} token
 */
async function getUserAccessTokenForFacebookAccessToken(token) {
  // TODO: implement it
  const facebookId = await getFacebookIdFromAccessToken(token)

  const existingUserId = await getUserIdWithFacebookId(facebookId)

  // 1. facebook id is in client's(my app) database
  if (existingUserId) {
    return getAccessTokenForUserId(existingUserId)
  }

  // 2. facebook id is not in client's(my app) database
  const userId = await createUserWithFacebookIdAndGetId(facebookId)

  return getAccessTokenForUserId(userId)
}

module.exports = {
  FB_APP_ID,
  FB_CLIENT_SECRET,
  getFacebookIdFromAccessToken,
  getUserIdWithFacebookId,
  getUserAccessTokenForFacebookAccessToken,
}
