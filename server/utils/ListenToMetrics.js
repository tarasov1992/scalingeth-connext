const vectorUtils = require("@connext/vector-utils")

const listenToMetrics = async (callback) => {
  const signer = vectorUtils.getRandomChannelSigner()
  const messaging = new vectorUtils.NatsBasicMessagingService({
    messagingUrl: "https://messaging.connext.network",
    signer,
  })
  await messaging.connect()
  console.log("Connected to NATS.")
  messaging.subscribe("*.*.metrics", (msg, err) => {
    if (err) {
      console.error("Uh oh: ", err)
      return
    }
    
    callback(msg)
  })
}

module.exports = listenToMetrics