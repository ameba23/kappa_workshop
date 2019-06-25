var discovery = require('discovery-swarm')
var hypercore = require('hypercore')
var pump = require('pump')

var feed = hypercore('./single-chat-feed-clone', '248d02e10bec9d08ed54d5fb438faf7d7b9208d655eb61d9ba85b4cceb817050', {
  valueEncoding: 'json'
})

feed.createReadStream({ live: true})
  .on('data', function (data) {
    console.log(data)
  })

var swarm = discovery()

feed.ready(function () {
  // we use the discovery as the topic
  swarm.join(feed.discoveryKey)
  swarm.on('connection', function (connection) {
    console.log('(New peer connected!)')

    // We use the pump module instead of stream.pipe(otherStream)
    // as it does stream error handling, so we do not have to do that
    // manually.

    // See below for more detail on how this work.
    pump(connection, feed.replicate({ live: true }), connection)
  })
})
