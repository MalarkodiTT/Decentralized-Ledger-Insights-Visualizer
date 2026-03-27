function simpleHash(data) {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
        const char = data.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; 
    }
    return Math.abs(hash).toString(16);
}

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return simpleHash(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data));
    }
}

class Blockchain {
    constructor() {
        // DB-ku pogama local-ah chain-ah maintain panrom
        this.chain = [new Block(0, new Date().toLocaleDateString(), "Genesis Block", "0")];
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newData) {
        const prevBlock = this.getLatestBlock();
        const newBlock = new Block(
            this.chain.length, 
            new Date().toLocaleTimeString(), 
            newData, 
            prevBlock.hash
        );
        this.chain.push(newBlock);
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            if (currentBlock.hash !== currentBlock.calculateHash()) return false;
            if (currentBlock.previousHash !== previousBlock.hash) return false;
        }
        return true;
    }
}

const myBlockchain = new Blockchain();

function updateUI() {
    const display = document.getElementById('blockchain-display');
    display.innerHTML = ''; 

    myBlockchain.chain.forEach(block => {
        const blockDiv = document.createElement('div');
        blockDiv.className = 'block-card';
        blockDiv.innerHTML = `
            <h3>Block #${block.index}</h3>
            <p><strong>Time:</strong> ${block.timestamp}</p>
            <p><strong>Data:</strong> ${typeof block.data === 'object' ? JSON.stringify(block.data) : block.data}</p>
            <p><strong>Prev Hash:</strong> <span class="hash-text">${block.previousHash}</span></p>
            <p><strong>Hash:</strong> <span class="hash-text">${block.hash}</span></p>
        `;
        display.appendChild(blockDiv);
    });
}

function addNewBlock() {
    const amountInput = document.getElementById('amount');
    const amountValue = amountInput.value;

    if(amountValue === "") {
        alert("Please enter an amount!");
        return;
    }

    myBlockchain.addBlock({ amount: amountValue });
    updateUI();
    amountInput.value = "";
}

function validateChain() {
    const status = document.getElementById('status-message');
    const isValid = myBlockchain.isChainValid();
    status.innerText = isValid ? "✅ Blockchain is Valid!" : "❌ Warning: Chain Tampered!";
    status.style.color = isValid ? "green" : "red";
}

function tamperData() {
    if(myBlockchain.chain.length > 1) {
        // Memory-la irukka data-va change panrom
        myBlockchain.chain[1].data = { amount: "999999" }; 
        updateUI(); 
        alert("Block #1 data has been hacked!");
    } else {
        alert("Add some blocks first!");
    }
}

// Just local initial update
window.onload = updateUI;
