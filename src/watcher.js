const Web3 = require('web3')
const validateTransaction = require('./validate')
const confirmEtherTransaction = require('./confirm')
const TOKEN_ABI = require('./abi')
const TransactionRepository = require('./transactions_repository')
const AppDAO = require('./dao')

function connectDB() {
  const dao = new AppDAO('../transactions.sqlite3')
  this.transactionRepo = new TransactionRepository(dao)
  this.transactionRepo.createTable()
}

function watchTokenTransfers() {
  // Instantiate web3 with WebSocketProvider
  const web3 = new Web3(new Web3.providers.WebsocketProvider("wss://ropsten.infura.io/ws/v3/20096139ce5444f88b69a254103f8c6a"))

  // Instantiate token contract object with JSON ABI and address
  const tokenContract = new web3.eth.Contract(
    TOKEN_ABI, "0x9f58c816a5bb5dede128a490058854c8f1913fe5",
    (error, result) => { if (error) console.log(error) }
  )

  // Generate filter options
  const options = {
    filter: {
      _from: process.env.WALLET_FROM,
      _to: process.env.WALLET_TO,
      _value: process.env.AMOUNT
    },
    fromBlock: 'latest'
  }

  // Subscribe to Transfer events matching filter criteria
  tokenContract.events.Transfer(options, async (error, event) => {
    if (error) {
      console.log(error)
      return
    }

    console.log('event', event)
    const { transactionHash, returnValues } = event;
    console.log(transactionHash, returnValues)
    this.transactionRepo.create(transactionHash, returnValues.from, returnValues.to, returnValues.value, 0).then(() => {
    })

    // Initiate transaction confirmation
    confirmEtherTransaction(event.transactionHash)

    return
  })
}

module.exports = {
  watchTokenTransfers,
  connectDB
}