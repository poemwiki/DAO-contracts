export interface networkConfigItem {
  ethUsdPriceFeed?: string
  blockConfirmations?: number
}

export interface networkConfigInfo {
  [key: string]: networkConfigItem
}

export const networkConfig: networkConfigInfo = {
  localhost: {},
  hardhat: {},
  // Price Feed Address, values can be obtained at https://docs.chain.link/docs/reference-contracts
  // Default one is ETH/USD contract on Kovan
  kovan: {
    blockConfirmations: 6,
  },
}

export const developmentChains = ['hardhat', 'localhost']
export const proposalsFile = 'proposals.json'

// Governor Values
// if quorum(proposalSnapshot(proposalId)) <= proposalvote.forVotes + proposalvote.abstainVotes, quorum is reached
export const QUORUM_PERCENTAGE = 70
// 1 hour - (only for timelock contract)after a vote passes, you have 1 hour before you can enact
export const MIN_DELAY = 3600
// export const VOTING_PERIOD = 45818 // 1 week - how long the vote lasts.
export const VOTING_PERIOD = 43200 // blocks
export const VOTING_DELAY = 1 // 1 Block - How many blocks till a proposal vote becomes active
export const THRESHOLD = '500000000000000000000000'
export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'

export const MINT_FUNC = 'mint'
export const PROPOSAL_DESCRIPTION = 'Mint new tokens'