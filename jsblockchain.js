const SHA256 = require("crypto-js/sha256");

class Transaction {
    constructor(toAddress, fromAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block {
    constructor(timestamp, transactions, previousHash = "") {
        //this.index = index;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.CalculateHash();
        this.nonce = 0;

    }

    CalculateHash() {
        return SHA256(this.timestamp + JSON.stringify(this.transactions) + this.previousHash + this.nonce).toString();
    }

    MineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== (new Array(difficulty + 1).join("0"))) {
            this.nonce++;
            this.hash = this.CalculateHash();

        }
    }
}

class Blockchain {
    constructor() {
        const genesisBlock = this.CreateGenesisBlock();
        this.chain = [genesisBlock];
        this.difficulty = 4;
        this.pendingTransactions = [];
        this.miningReward = 10;
    }

    CreateGenesisBlock() {
        var genesisBlock = new Block(new Date, "This is the genesis block", "0000");
        return genesisBlock;
    }

    GetLatestBlock() {
        var lastBlock = this.chain[this.chain.length - 1];
        return lastBlock;
    }

    // AddBlock(newBlock) {
    //     newBlock.previousHash = this.GetLatestBlock().hash;
    //     newBlock.MineBlock(this.difficulty);
    //     this.chain.push(newBlock);
    // }

    MinePendingTransactions(minerAddress) {
        let block = new Block(Date.now(), this.pendingTransactions, this.GetLatestBlock().hash)
        block.MineBlock(this.difficulty);

        console.log("Mined transaction(s) successfully.");
        this.chain.push(block);
        this.pendingTransactions = [new Transaction(minerAddress, null, this.miningReward)];
    }

    CreateTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    GetBalanceOfAddress(address) {
        let balance = 0;

        for (const block of this.chain) {
            for (const transn of block.transactions) {
                if (transn.fromAddress === address) {
                    balance = balance - transn.amount;
                }
                if (transn.toAddress === address)
                {
                    balance = balance + transn.amount;
                }
            }
        }

        return balance;
    }

    IsChainValid() {
        for (var i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if (currentBlock.hash !== currentBlock.CalculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}



//create blocks
let sikkaCoin = new Blockchain();
var transaction1 = new Transaction("Anil", "Mukesh", 1000);
sikkaCoin.CreateTransaction(transaction1);
var transaction2 = new Transaction("Rakesh", "Rajesh", 99.5);
sikkaCoin.CreateTransaction(transaction2);
console.log("Mining block transactions...");
sikkaCoin.MinePendingTransactions("MinerAddress");
console.log("Balance for Anil is: " + sikkaCoin.GetBalanceOfAddress("Anil"));
console.log("Balance for Mukesh is: " + sikkaCoin.GetBalanceOfAddress("Mukesh"));
console.log("Balance for Miner is: " + sikkaCoin.GetBalanceOfAddress("MinerAddress"));
console.log("Mining reward transaction for the block...");
sikkaCoin.MinePendingTransactions("MinerAddress");
console.log("Balance for Miner is: " + sikkaCoin.GetBalanceOfAddress("MinerAddress"));
console.log("Mining reward for reward transaction...");
sikkaCoin.MinePendingTransactions("MinerAddress");
console.log("Balance for Miner is: " + sikkaCoin.GetBalanceOfAddress("MinerAddress"));