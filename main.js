const TransactionRepository = require('./src/transactions_repository')
const AppDAO = require('./src/dao')

function main() {
const dao = new AppDAO('./transactions.sqlite3')
const transactionRepo = new TransactionRepository(dao)
transactionRepo.createTable()
}


main()
