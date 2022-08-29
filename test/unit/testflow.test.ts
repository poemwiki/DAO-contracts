import { PoemwikiGovernor, PoemWikiReputation } from '../../typechain-types'
import { deployments, ethers, getNamedAccounts } from 'hardhat'
import { assert, expect } from 'chai'
import {
  VOTING_DELAY,
  VOTING_PERIOD,
  MIN_DELAY,
} from '../../helper-hardhat-config'
import { moveBlocks } from '../../utils/move-blocks'
import { moveTime } from '../../utils/move-time'

describe('Governor Flow', () => {
  let governor: PoemwikiGovernor
  let token: PoemWikiReputation
  const voteWay = 1 // for
  const reason = 'I lika do da cha cha'

  let deployer: string

  beforeEach(async () => {
    await deployments.fixture(['all'])

    governor = await ethers.getContract('PoemwikiGovernor')
    token = await ethers.getContract('PoemWikiReputation')

    const accounts = await getNamedAccounts()
    deployer = accounts.deployer
  })

  it('can only be changed through governance', async () => {
    await expect(token.mint(deployer, 55)).to.be.revertedWith('Ownable: caller is not the owner')
  })

  it('proposes, votes, waits, queues, and then executes', async () => {
    // propose
    const description = `mint for ${deployer}`
    const encodedFunctionCall = token.interface.encodeFunctionData('mint', [deployer, 22])
    const proposeTx = await governor.propose(
      [token.address],
      [0],
      [encodedFunctionCall],
      description
    )

    const proposeReceipt = await proposeTx.wait(1)
    const proposalId = proposeReceipt.events?.[0].args?.proposalId
    let proposalState = await governor.state(proposalId)
    console.log(`Current Proposal State: ${proposalState}`)
    deployments.log(`Current Proposal State: ${proposalState}`)

    await moveBlocks(VOTING_DELAY + 1)
    // vote
    const voteTx = await governor.castVoteWithReason(proposalId, voteWay, reason)
    await voteTx.wait(1)
    proposalState = await governor.state(proposalId)
    assert.equal(proposalState.toString(), '1')
    console.log(`Current Proposal State: ${proposalState}`)
    await moveBlocks(VOTING_PERIOD + 1)

    // queue & execute
    // const descriptionHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(PROPOSAL_DESCRIPTION))
    const descriptionHash = ethers.utils.id(description)
    // const queueTx = await governor.queue([token.address], [0], [encodedFunctionCall], descriptionHash)
    // await queueTx.wait(1)
    await moveTime(MIN_DELAY + 1)
    await moveBlocks(1)

    proposalState = await governor.state(proposalId)
    console.log(`Current Proposal State: ${proposalState}`)
    deployments.log(`Current Proposal State: ${proposalState}`)

    console.log('Executing...')
    console.log
    const exTx = await governor.execute([token.address], [0], [encodedFunctionCall], descriptionHash)
    await exTx.wait(1)
    console.log((await token.balanceOf(deployer)).toString())
  })
})
