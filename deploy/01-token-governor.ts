import { HardhatRuntimeEnvironment, Network } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import { ethers, upgrades } from 'hardhat'
import { Manifest, hashBytecodeWithoutMetadata } from '@openzeppelin/upgrades-core'
import {
  developmentChains, QUORUM_PERCENTAGE, THRESHOLD, VOTING_DELAY, VOTING_PERIOD,
} from '../helper-hardhat-config'
import { ContractFactory } from 'ethers'
// import { setGlobalDispatcher, ProxyAgent } from 'undici'
// const proxyAgent = new ProxyAgent('http://127.0.0.1:1087')
// setGlobalDispatcher(proxyAgent)

const deployGovernanceToken: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {

  const { getNamedAccounts, deployments, network } = hre
  const { log } = deployments
  const { deployer } = await getNamedAccounts()

  log('----------------------------------------------------')
  log('Deploying GovernanceToken and waiting for confirmations...')
  const contractName = 'PoemWikiReputation'
  const contract = await ethers.getContractFactory(contractName)
  const governanceToken = await upgrades.deployProxy(contract, [
    contractName, 'PWR'
  ], {
    initializer: 'initialize'
  })

  await governanceToken.deployed()
  log(`GovernanceTokenProxy at ${governanceToken.address}`)

  // const tokenImpl = await getImplimentationContract(contract, network)

  // if (tokenImpl && !developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
  //   await verify(tokenImpl.address, [])
  // }

  // log(`Delegating to ${deployer}`)
  // await delegate(contractName, governanceToken.address, deployer)
  // log('Delegated!')

  await deployGovernor(hre, contractName, governanceToken.address)
}

async function getImplimentationContract(contractFactory: ContractFactory, network: Network) {
  // Peer into OpenZeppelin manifest to extract the implementation address
  const ozUpgradesManifestClient = await Manifest.forNetwork(network.provider)
  const manifest = await ozUpgradesManifestClient.read()
  const bytecodeHash = hashBytecodeWithoutMetadata(contractFactory.bytecode)
  return manifest.impls[bytecodeHash]
}

async function deployGovernor(hre: HardhatRuntimeEnvironment, tokenContractName: string, tokenAdress: string) {
  const { deployments, network } = hre
  const { log } = deployments

  log('----------------------------------------------------')
  console.log('Deploying GovernorContract and waiting for confirmations...')

  const contractName = 'PoemWikiGovernor'
  const contract = await ethers.getContractFactory('PoemwikiGovernor')
  const governor = await upgrades.deployProxy(contract, [
    contractName,
    tokenAdress,
    QUORUM_PERCENTAGE,
    VOTING_PERIOD,
    VOTING_DELAY,
    THRESHOLD
  ], {
    initializer: 'initialize',
  })

  await governor.deployed()
  log(`GovernorProxyContract at ${governor.address}`)

  // const governorImpl = await getImplimentationContract(contract, network)
  // if (governorImpl && !developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
  //   await verify(governorImpl.address, [])
  // }

  return governor
}

async function delegate(contractName: string, governanceTokenAddress: string, delegatedAccount: string) {
  const governanceToken = await ethers.getContractAt(contractName, governanceTokenAddress)
  const transactionResponse = await governanceToken.delegate(delegatedAccount)

  await transactionResponse.wait(1)
  console.log(`Checkpoints: ${await governanceToken.numCheckpoints(delegatedAccount)}`)
}

export default deployGovernanceToken
deployGovernanceToken.tags = ['all', 'token-and-governor']
