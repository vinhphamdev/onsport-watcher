class TransactionRepository {
    constructor(dao){
        this.dao = dao
    }

    createTable(){

    const sql = `CREATE TABLE IF NOT EXISTS transactions (
        transactionHash TEXT,
        sender TEXT,
        receiver TEXT,
        value INTEGER,
        executed INTEGER)`
    return this.dao.runquery(sql);

    }

    create(transactionHash, sender, receiver, value, executed){
        return this.dao.runquery(
            'INSERT INTO transactions (transactionHash, sender, receiver, value, executed) VALUES (?,?,?,?,?)',
            [transactionHash, sender, receiver, value, executed])
    }

    update(){

    }

    getAllTransaction(){
        return this.dao.all(`SELECT * FROM transactions`)
    }
}

module.exports = TransactionRepository