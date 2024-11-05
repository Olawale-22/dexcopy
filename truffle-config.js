
const HDWalletProvider = require('@truffle/hdwallet-provider');
const infuraKey = "************"; // Replace with actual Infura project ID
const mnemonic = "***********************"; // Replace with your actual MetaMask mnemonic phrase

module.exports = {
  networks: {
    lineaSepolia: {
      provider: () => new HDWalletProvider({
        mnemonic: {
          phrase: mnemonic
        },
        providerOrUrl: `https://linea-sepolia.infura.io/v3/${infuraKey}`,
        pollingInterval: 8000, // Increase polling interval
        timeout: 3000000 // Further increase timeout
      }),
      network_id: 59141,       // Linea Sepolia's network id
      gas: 4500000,               // Gas limit
      gasPrice: 10000000000,      // 10 gwei
      networkCheckTimeout: 2000000 // Further increase network check timeout
    },
  },
  compilers: {
    solc: {
      version: "0.8.0",           // Fetch exact version from solc-bin (default: truffle's version)
    },
  },
};