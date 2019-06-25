var discovery = require('discovery-swarm')
var pump = require('pump')
var hypercore = require('hypercore')

var multifeed = require('multifeed')

var multi = multifeed(hypercore, './multichat', {
  valueEncoding: 'json'
})

var swarm = discovery()

multi.writer('local', (err, feed) => {
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

// feed.createReadStream({ live: true })
//   .on('data', function (data) {
//   console.log(data)
// })

swarm.join('likecabbage')
swarm.on('connection', (connection) => {
  console.log('new peer connected')
  pump(connection, multi.replicate({ live: true }), connection)
})
