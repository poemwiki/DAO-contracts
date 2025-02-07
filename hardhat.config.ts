import '@typechain/hardhat'
import '@nomiclabs/hardhat-waffle'
import '@nomicfoundation/hardhat-verify'
import '@nomiclabs/hardhat-ethers'
import 'hardhat-gas-reporter'
import 'dotenv/config'
import 'solidity-coverage'
import 'hardhat-deploy'
import '@openzeppelin/hardhat-upgrades'
import { HardhatUserConfig } from 'hardhat/config'


const AMOY_RPC_URL = process.env.AMOY_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY || 'privatKey'
// const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ''

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      chainId: 31337,
      allowUnlimitedContractSize: true
    },
    // hardhat: {
    //   forking: {
    //     url: process.env.POLYGON_RPC_URL as string
    //   }
    // },
    polygonAmoy: {
      url: AMOY_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 80002,
    },
    polygon: {
      url: process.env.POLYGON_RPC_URL as string,
      accounts: [PRIVATE_KEY],
      chainId: 137,
    }
  },
  solidity: {
    version: '0.8.4',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  etherscan: {
    apiKey: {
      polygonAmoy: process.env.POLYSCAN_API_KEY,
      polygon: process.env.POLYSCAN_API_KEY
    },
  },
  gasReporter: {
    enabled: true,
    currency: 'USD',
    outputFile: 'gas-report.txt',
    noColors: true,
    // coinmarketcap: COINMARKETCAP_API_KEY,
  },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
      1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
    },
    feeCollector: {
      default: 1
    }
  },
  mocha: {
    timeout: 200000, // 200 seconds max for running tests
  },
}

export default config
