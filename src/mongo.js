// @ts-check

const { MongoClient } = require('mongodb')

const { MONGO_PASSWORD, MONGO_CLUSTER, MONGO_USER, MONGO_DBNAME } = process.env

// const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_CLUSTER}/${MONGO_DBNAME}?retryWrites=true&w=majority`
const uri =
  'mongodb+srv://iouogu03:LbCMSAihq1VFOEhl@cluster0.mlavb.mongodb.net/?retryWrites=true&w=majority'

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const DB = 'fc21'

let didConnect = false

async function getUsersCollection() {
  if (!didConnect) {
    await client.connect()

    didConnect = true
  }

  return client.db(DB).collection('users')
}

module.exports = {
  getUsersCollection,
}
