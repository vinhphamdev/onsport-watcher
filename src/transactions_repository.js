class TransactionRepository {
    constructor(dao){
        this.dao = dao
    }

    createTable(){

    const sql = `CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        blockNumber TEXT,
        transactionHash TEXT,
        sender TEXT,
        receiver TEXT,
        value INTEGER,
        executed INTEGER)`
    return this.dao.runquery(sql);

    }

    create(blockNumber, transactionHash, sender, receiver, value, executed){
        return this.dao.runquery(
            'INSERT INTO transactions (blockNumber, transactionHash, sender, receiver, value, executed) VALUES (?,?,?,?,?,?)',
            [blockNumber, transactionHash, sender, receiver, value, executed])
    }

    update(){

    }

    getAllTransaction(){
        return this.dao.all(`SELECT * FROM transactions`)
    }

    getLastTransaction(){
        const sql = `SELECT * FROM transactions ORDER BY id DESC LIMIT 1`
        return this.dao.get(sql);
    }
}

module.exports = TransactionRepository