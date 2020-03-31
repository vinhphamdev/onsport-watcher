const Web3 = require('web3')
const confirmEtherTransaction = require('./confirm')
const TOKEN_ABI = require('./abi')
const TransactionRepository = require('./transactions_repository')
const AppDAO = require('./dao')

function connectDB() {
  const dao = new AppDAO('../transactions.sqlite3')
  this.transactionRepo = new TransactionRepository(dao)
  this.transactionRepo.createTable()
}

async function fetchTransaction() {
  const transactions = await this.transactionRepo.getAllTransaction();
  if (transactions.length == 0) {
    this.tokenContract.getPastEvents('Transfer', {
      fromBlock: 0,
      toBlock: 'latest'
    }, (error, transactions) => {
      for (const transaction of transactions) {
        const { transactionHash, returnValues, blockNumber } = transaction;
        this.transactionRepo.create(blockNumber, transactionHash, returnValues.from, returnValues.to, Web3.utils.fromWei(returnValues.value, 'ether'), 0).then(() => { 
        console.log('creating transaction')
        })
      }
    })
  } else {
    const lastTxInDB = await this.transactionRepo.getLastTransaction();
    this.tokenContract.getPastEvents('Transfer', {
      fromBlock: lastTxInDB['blockNumber'],
      toBlock: 'latest'
    }, (error, transactions) => {
      for(let i = 0; i < transactions.length; i++){
              if(i === 0) { continue }
              const { transactionHash, returnValues, blockNumber } = transactions[i];
              this.transactionRepo.create(blockNumber, transactionHash, returnValues.from, returnValues.to, Web3.utils.fromWei(returnValues.value, 'ether'), 0).then(() => {
                console.log('creating transaction')
              });
      }
    })
  }
}

async function watchTokenTransfers() {
  // Instantiate web3 with WebSocketProvider
  const web3 = new Web3(new Web3.providers.WebsocketProvider("wss://ropsten.infura.io/ws/v3/20096139ce5444f88b69a254103f8c6a"))

  // Instantiate token contract object with JSON ABI and address
  this.tokenContract = new web3.eth.Contract(
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
  this.tokenContract.events.Transfer(options, async (error, event) => {
    if (error) {
      console.log(error)
      return
    }

    const { transactionHash, returnValues, blockNumber } = event;
    this.transactionRepo.create(blockNumber, transactionHash, returnValues.from, returnValues.to, Web3.utils.fromWei(returnValues.value, 'ether'), 0).then(() => { })

    // Initiate transaction confirmation
    // confirmEtherTransaction(event.transactionHash)

    return
  })
}

module.exports = {
  watchTokenTransfers,
  connectDB,
  fetchTransaction
}