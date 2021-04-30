const vectorUtils = require("@connext/vector-utils")
const fs = require('fs')

const listenToMetrics = async () => {
  const signer = vectorUtils.getRandomChannelSigner();
  const messaging = new vectorUtils.NatsBasicMessagingService({
    messagingUrl: "https://messaging.connext.network",
    signer,
  });
  await messaging.connect();
  console.log("CONNECTED");
  messaging.subscribe("*.*.metrics", (msg, err) => {
    if (err) {
      console.error("Uh oh: ", err);
      return;
    }
    console.log('dumped')
    console.log(msg)
    const data = JSON.stringify(msg)
    fs.writeFileSync('dump.json', data)
  });
};

listenToMetrics();
