const watcher = require('./watcher')

// watcher.watchEtherTransfers()
// console.log('Started watching Ether transfers')

watcher.connectDB()
watcher.watchTokenTransfers()
console.log('Started watching Pluton token transfers\n')