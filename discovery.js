var discovery = require('discovery-swarm')

var swarm = discovery()

swarm.join('moose-p2p-app')


// this event is fired every time you find and connect to a new peer also on the same key
swarm.on('connection', function (connection, info) {
  // `info `is a simple object that describes the peer we connected to
  console.log('found a peer', info)
  // `connection` is a duplex stream that you read from and write to
  process.stdin.on('data', (data) => {
    connection.write(data.toString().trim())
  })
  connection.on('data', (data)=> {
    console.log(data)
  })
})
