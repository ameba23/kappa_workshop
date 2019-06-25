var kappa = require('kappa-core')
var memdb = require('memdb')
var list = require('kappa-view-list')
var pump = require('pump')

var discovery = require('discovery-swarm')

var swarm = discovery()

swarm.join('moose-p2p-app')



var timestampView = list(memdb(), function (msg, next) {
  if (msg.value.timestamp && typeof msg.value.timestamp === 'string') {
      // sort on the 'timestamp' field
      next(null, [msg.value.timestamp])
  } else {
      next()
  }
})

var core = kappa('./multichat', {valueEncoding: 'json'})
core.use('chats', timestampView)

core.api.chats.read().on('data', (data) => {
  console.log(data)
})

core.ready(() => {
  core.feed('local', function (err, feed) {
    process.stdin.on('data', (data) => {
      feed.append({
        type: 'chat-message',
        nickname: 'cat-lover',
        text: data.toString().trim(),
        timestamp: new Date().toISOString()
      }, function (err, seq) {
        if (err) throw err
        console.log('Data was appended as entry #' + seq)
      })
    })
  })

  core.api.chats.tail(20, (msgs) => {
    console.log(msgs)
  })


  swarm.on('connection', (connection) => {
    console.log('new peer connected')
    pump(connection, core.replicate({ live: true }), connection)
  })
})


