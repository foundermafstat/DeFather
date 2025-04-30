import { type Guide, ContentLevel } from './defatherGuideTypes';

// Initial guide state
export const initialGuideState: Guide = {
  title: 'DeFather: Guide to DeFi Development on Rootstock',
  description: 'Step-by-step guide for developing decentralized finance applications on the Rootstock network',
  sections: [
    {
      id: 'intro',
      title: 'Introduction to Rootstock and DeFi',
      level: ContentLevel.UNLOCKED,
      items: [
        {
          id: 'intro-rootstock',
          title: 'What is Rootstock (RSK)',
          description: 'Basic information about the Rootstock blockchain and its features',
          content: `
            # Rootstock (RSK)
            
            Rootstock (RSK) is a smart contract platform that is connected to the Bitcoin network through merged mining.
            
            ## Key Features of Rootstock:
            
            * **Bitcoin-compatible**: RSK works as a Bitcoin sidechain, providing security at the level of the main network
            * **EVM-compatible**: Supports Ethereum-compatible smart contracts, making it easy to port applications
            * **Low fees**: Transaction costs are significantly lower than on the Ethereum network
            * **Scalability**: Provides higher transaction throughput
            
            RSK is particularly attractive for DeFi projects as it combines Bitcoin security with Ethereum smart contract functionality.
          `,
          level: ContentLevel.UNLOCKED,
          triggerPhrases: ['what is rootstock', 'tell me about rootstock', 'information about rootstock'],
          links: [
            { text: 'Official Rootstock Website', url: 'https://rootstock.io/' },
            { text: 'RSK Documentation', url: 'https://dev.rootstock.io/' }
          ]
        },
        {
          id: 'intro-defi',
          title: 'Decentralized Finance (DeFi)',
          description: 'Overview of the DeFi concept and opportunities on Rootstock',
          content: `
            # Decentralized Finance (DeFi)
            
            DeFi (Decentralized Finance) is an ecosystem of financial applications developed on blockchain that offer traditional financial instruments without centralized intermediaries.
            
            ## Main Categories of DeFi Applications:
            
            * **Lending and Borrowing**: Platforms for issuing and receiving loans without intermediaries
            * **Decentralized Exchanges (DEX)**: Trading platforms without a centralized operator
            * **Stablecoins**: Cryptocurrencies pegged to stable assets
            * **Derivatives**: Tokenized derivatives for various assets
            * **Insurance**: Decentralized insurance protocols
            
            ## Advantages of Developing DeFi on Rootstock:
            
            * **Bitcoin Security**: Inherited from merged mining with Bitcoin
            * **EVM Compatibility**: You can use existing Ethereum development tools
            * **Low Gas Costs**: More affordable transactions for users
            * **Growing Ecosystem**: Increasing community and set of tools
          `,
          level: ContentLevel.LOCKED,
          triggerPhrases: ['what is defi', 'decentralized finance', 'tell me about defi'],
          links: [
            { text: 'DeFi protocols on Rootstock', url: 'https://developers.rsk.co/solutions/defi/' }
          ]
        }
      ]
    },
    {
      id: 'environment',
      title: 'Setting Up the Development Environment',
      level: ContentLevel.LOCKED,
      items: [
        {
          id: 'dev-tools',
          title: 'Development Tools',
          description: 'Essential tools for working with Rootstock',
          content: `
            # Development Tools for Rootstock
            
            To develop DeFi applications on Rootstock, you'll need the following tools:
            
            ## Core Tools:
            
            * **Node.js and npm/yarn**: For dependency management and running scripts
            * **Hardhat/Truffle**: Frameworks for smart contract development
            * **Solidity**: Programming language for writing smart contracts
            * **Web3.js/Ethers.js**: Libraries for interacting with the blockchain
            * **MetaMask**: For testing and interacting with your dApp
            
            ## Installing Basic Dependencies:
            
            \`\`\`bash
            # Install Node.js and npm (if not installed)
            # https://nodejs.org/
            
            # Install Hardhat (recommended)
            mkdir my-defi-project
            cd my-defi-project
            npm init -y
            npm install --save-dev hardhat
            npx hardhat init
            \`\`\`
            
            Choose "Create a TypeScript project" for better type support and safer development.
          `,
          level: ContentLevel.LOCKED,
          triggerPhrases: ['development tools', 'installing tools', 'how to start development'],
          codeExample: `
            // package.json
            {
              "name": "my-rootstock-defi",
              "version": "1.0.0",
              "description": "DeFi application on Rootstock",
              "scripts": {
                "compile": "hardhat compile",
                "test": "hardhat test",
                "deploy": "hardhat run scripts/deploy.js --network rskTestnet"
              },
              "devDependencies": {
                "@nomiclabs/hardhat-ethers": "^2.0.2",
                "@nomiclabs/hardhat-waffle": "^2.0.1",
                "chai": "^4.3.4",
                "ethereum-waffle": "^3.4.0",
                "ethers": "^5.4.1",
                "hardhat": "^2.6.0"
              }
            }
          `
        }
      ]
    }
  ],
  currentSection: 'intro',
  currentItem: 'intro-rootstock'
};
