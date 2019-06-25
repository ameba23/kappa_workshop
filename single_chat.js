// Save this file as single-chat.js

var hypercore = require('hypercore')
var feed = hypercore('./single-chat-feed', {
  valueEncoding: 'json'
})
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

feed.createReadStream({ live: true })
  .on('data', function (data) {
    console.log(data)
})
