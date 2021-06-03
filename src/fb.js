/* eslint-disable prefer-destructuring */

const { default: fetch } = require('node-fetch')
const {
  getAccessTokenForUserId,
  createUserWithFacebookIdAndGetId,
} = require('./auth')
const { getUsersCollection } = require('./mongo')

/** @type {string} */
const FB_APP_ID = process.env.FB_APP_ID
/** @type {string} */
const FB_CLIENT_SECRET = process.env.FB_CLIENT_SECRET

/**
 * @param {string} accessToken
 * @returns {Promise<string>}
 */
async function getFacebookIdFromAccessToken(accessToken) {
  const fbAccessTokenRes = await fetch(
    `https://graph.facebook.com/oauth/access_token?client_id=${FB_APP_ID}&client_secret=${FB_CLIENT_SECRET}&grant_type=client_credentials`
  )
  const fbAppAccessToken = (await fbAccessTokenRes.json()).access_token

  const fbRes = await fetch(
    `https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${fbAppAccessToken}`
  )
  const final = await fbRes.json()

  if (final.data.app_id !== FB_APP_ID) {
    throw new Error('Not a valid access token.')
  }

  return final.data.user_id
}

/**
 * @param {string} facebookId
 * @returns {Promise<string | undefined>}
 */
async function getUserIdWithFacebookId(facebookId) {
  const users = await getUsersCollection()
  const user = await users.findOne({
    facebookId,
  })

  if (!user) {
    return undefined
  }

  return user.id
}

/**
 * @param {string} token
 */
async function getUserAccessTokenForFacebookAccessToken(token) {
  const facebookId = await getFacebookIdFromAccessToken(token)
  const existingUserId = await getUserIdWithFacebookId(facebookId)

  if (existingUserId) {
    return getAccessTokenForUserId(existingUserId)
  }
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
