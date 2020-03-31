const watcher = require('./watcher')

watcher.connectDB()
watcher.fetchTransaction()
watcher.watchTokenTransfers()