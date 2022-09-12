import { ethers, upgrades } from 'hardhat'

async function upgrade() {
  const TokenV1 = await forceImport

  const TokenV2 = await ethers.getContractFactory('PoemWikiReputationV2')

  const tokenV2 = await upgrades.upgradeProxy('0xCf20d4559a168aaea8F6781ddFbDD67Ced8948F0', TokenV2)

  console.log('Your upgraded proxy is done!', tokenV2.address)
}

upgrade()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })