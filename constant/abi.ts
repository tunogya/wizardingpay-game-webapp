export const BACCARAT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  }, {
    "anonymous": false,
    "inputs": [{"indexed": true, "internalType": "uint256", "name": "_cursor", "type": "uint256"}, {
      "indexed": true,
      "internalType": "address",
      "name": "_player",
      "type": "address"
    }, {"indexed": false, "internalType": "address", "name": "_token", "type": "address"}, {
      "indexed": false,
      "internalType": "uint256",
      "name": "_amount",
      "type": "uint256"
    }, {"indexed": false, "internalType": "uint256", "name": "_betType", "type": "uint256"}],
    "name": "Action",
    "type": "event"
  }, {
    "anonymous": false,
    "inputs": [{"indexed": false, "internalType": "uint256", "name": "_amount", "type": "uint256"}],
    "name": "Burning",
    "type": "event"
  }, {
    "anonymous": false,
    "inputs": [{"indexed": true, "internalType": "address", "name": "previousOwner", "type": "address"}, {
      "indexed": true,
      "internalType": "address",
      "name": "newOwner",
      "type": "address"
    }],
    "name": "OwnershipTransferred",
    "type": "event"
  }, {
    "anonymous": false,
    "inputs": [{
      "indexed": true,
      "internalType": "uint256",
      "name": "_cursor",
      "type": "uint256"
    }, {
      "components": [{"internalType": "bool", "name": "banker", "type": "bool"}, {
        "internalType": "bool",
        "name": "player",
        "type": "bool"
      }, {"internalType": "bool", "name": "tie", "type": "bool"}, {
        "internalType": "bool",
        "name": "bankerPair",
        "type": "bool"
      }, {"internalType": "bool", "name": "playerPair", "type": "bool"}, {
        "internalType": "bool",
        "name": "superSix",
        "type": "bool"
      }], "indexed": false, "internalType": "struct IBaccarat.ActionResult", "name": "result", "type": "tuple"
    }, {
      "components": [{"internalType": "uint8", "name": "rank", "type": "uint8"}, {
        "internalType": "uint8",
        "name": "suit",
        "type": "uint8"
      }], "indexed": false, "internalType": "struct IBaccarat.Card[]", "name": "bankerHands", "type": "tuple[]"
    }, {
      "components": [{"internalType": "uint8", "name": "rank", "type": "uint8"}, {
        "internalType": "uint8",
        "name": "suit",
        "type": "uint8"
      }], "indexed": false, "internalType": "struct IBaccarat.Card[]", "name": "playerHands", "type": "tuple[]"
    }],
    "name": "Settle",
    "type": "event"
  }, {
    "anonymous": false,
    "inputs": [{"indexed": false, "internalType": "uint256", "name": "_cursor", "type": "uint256"}, {
      "indexed": false,
      "internalType": "uint256",
      "name": "_nonce",
      "type": "uint256"
    }],
    "name": "Shuffle",
    "type": "event"
  }, {
    "inputs": [{"internalType": "address", "name": "_token", "type": "address"}, {
      "internalType": "uint256",
      "name": "_amount",
      "type": "uint256"
    }, {"internalType": "uint256", "name": "_betType", "type": "uint256"}],
    "name": "action",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }, {
    "inputs": [{"internalType": "uint256", "name": "cursor_", "type": "uint256"}, {
      "internalType": "uint256",
      "name": "count_",
      "type": "uint256"
    }],
    "name": "cardsOf",
    "outputs": [{
      "components": [{"internalType": "uint8", "name": "rank", "type": "uint8"}, {
        "internalType": "uint8",
        "name": "suit",
        "type": "uint8"
      }], "internalType": "struct IBaccarat.Card[]", "name": "", "type": "tuple[]"
    }],
    "stateMutability": "view",
    "type": "function"
  }, {
    "inputs": [{"internalType": "address", "name": "_player", "type": "address"}, {
      "internalType": "address",
      "name": "_token",
      "type": "address"
    }],
    "name": "chequesOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }, {
    "inputs": [],
    "name": "cursor",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }, {
    "inputs": [],
    "name": "layout",
    "outputs": [{
      "components": [{
        "internalType": "address",
        "name": "player",
        "type": "address"
      }, {"internalType": "address", "name": "token", "type": "address"}, {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }, {"internalType": "uint256", "name": "betType", "type": "uint256"}],
      "internalType": "struct IBaccarat.LayoutAction[]",
      "name": "",
      "type": "tuple[]"
    }],
    "stateMutability": "view",
    "type": "function"
  }, {
    "inputs": [],
    "name": "owner",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  }, {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }, {
    "inputs": [{"internalType": "uint256", "name": "nonce", "type": "uint256"}],
    "name": "settle",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }, {
    "inputs": [{"internalType": "uint256", "name": "_nonce", "type": "uint256"}],
    "name": "shuffle",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }, {
    "inputs": [{"internalType": "address", "name": "newOwner", "type": "address"}],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }, {
    "inputs": [{"internalType": "address", "name": "_token", "type": "address"}, {
      "internalType": "uint256",
      "name": "_amount",
      "type": "uint256"
    }], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function"
  }, {
    "inputs": [{"internalType": "address", "name": "_token", "type": "address"}, {
      "internalType": "uint256",
      "name": "_amount",
      "type": "uint256"
    }], "name": "withdrawOnlyOwner", "outputs": [], "stateMutability": "nonpayable", "type": "function"
  }];