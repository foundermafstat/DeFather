import { type GuideSection, ContentLevel } from './defatherGuideTypes';

// Final guide sections
export const finalSections: GuideSection[] = [
  {
    id: 'deployment',
    title: 'Deployment and Testing',
    level: ContentLevel.LOCKED,
    items: [
      {
        id: 'deployment-testnet',
        title: 'Testnet Deployment',
        description: 'Deploying smart contracts to the Rootstock testnet',
        content: `
          # Deploying to Rootstock Testnet
          
          Before releasing to the mainnet, it's recommended to test your smart contracts in the Rootstock testnet (RSK Testnet).
          
          ## Preparation for Deployment:
          
          1. **Getting Test RBTC**:
             - Use the [RSK Testnet Faucet](https://faucet.rsk.co/) to get test RBTC
             - Ensure your MetaMask is configured for RSK Testnet (Chain ID: 31)
          
          2. **Hardhat Configuration**:
             Add RSK Testnet configuration to your hardhat.config.js/ts:
             
          3. **Creating a Deployment Script**:
             Create a script that will deploy your contracts to the network
          
          ## Deployment Process:
          
          1. Compile contracts: \`npx hardhat compile\`
          2. Run deployment: \`npx hardhat run scripts/deploy.js --network rskTestnet\`
          3. Save the addresses of deployed contracts
          
          ## Verifying Deployment:
          
          - Use the [RSK Testnet Explorer](https://explorer.testnet.rsk.co/) to verify transactions
          - Interact with the contract through your frontend or Hardhat scripts
        `,
        level: ContentLevel.LOCKED,
        triggerPhrases: ['deploy contracts', 'testnet deployment', 'rsk testnet'],
        codeExample: `
          // hardhat.config.ts
          import { HardhatUserConfig } from "hardhat/config";
          import "@nomiclabs/hardhat-ethers";
          import "@nomiclabs/hardhat-waffle";
          
          // Load environment variables
          import * as dotenv from "dotenv";
          dotenv.config();
          
          // Get private key from environment variables
          const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000000";
          
          const config: HardhatUserConfig = {
            solidity: "0.8.4",
            networks: {
              // Configuration for RSK Testnet
              rskTestnet: {
                url: "https://public-node.testnet.rsk.co",
                chainId: 31,
                accounts: [PRIVATE_KEY],
                gasMultiplier: 1.1
              },
              // Configuration for RSK Mainnet (when you're ready)
              rskMainnet: {
                url: "https://public-node.rsk.co",
                chainId: 30,
                accounts: [PRIVATE_KEY]
              }
            }
          };
          
          export default config;
          
          // scripts/deploy.ts
          import { ethers } from "hardhat";
          
          async function main() {
            // Get account for deployment
            const [deployer] = await ethers.getSigners();
            console.log("Deploying contracts with the account:", deployer.address);
            
            // Deploy token
            const DeFatherToken = await ethers.getContractFactory("DeFatherToken");
            const token = await DeFatherToken.deploy(ethers.utils.parseEther("1000000"));
            await token.deployed();
            console.log("Token deployed to:", token.address);
            
            // Deploy other contracts...
            
            console.log("All contracts deployed successfully!");
          }
          
          main().then(() => process.exit(0)).catch((error) => {
            console.error(error);
            process.exit(1);
          });
        `
      },
      {
        id: 'deployment-mainnet',
        title: 'Preparing for Mainnet',
        description: 'Steps for secure deployment to the Rootstock mainnet',
        content: `
          # Preparing for Rootstock Mainnet Deployment
          
          Deploying to the mainnet requires additional preparation and security measures.
          
          ## Pre-Deployment Checklist:
          
          1. **Security Audit**:
             - Professional audit of all smart contracts
             - Review of all identified vulnerabilities
          
          2. **Comprehensive Testing**:
             - Unit tests with high coverage
             - Integration tests for all components
             - Simulation of various edge cases
          
          3. **Documentation**:
             - Technical documentation for developers
             - User documentation for protocol participants
          
          4. **Economic Security**:
             - Modeling economic attacks
             - Protection against liquidity manipulation
          
          ## Deployment Process:
          
          1. **RBTC Preparation**:
             - Ensure you have enough RBTC for deploying all contracts
          
          2. **Deployment Strategy**:
             - Consider using a multi-sig wallet for deployment
             - Have a clear rollback plan in case of issues
          
          3. **Verification**:
             - Verify contract code on RSK Explorer
             - Compare deployed bytecode with compiled bytecode
          
          ## Post-Deployment:
          
          - Monitor contract activity during initial period
          - Implement governance mechanisms
          - Build a community around your project
        `,
        level: ContentLevel.LOCKED,
        triggerPhrases: ['mainnet deployment', 'mainnet launch', 'secure deployment'],
        links: [
          { text: 'RSK Mainnet Explorer', url: 'https://explorer.rsk.co/' },
          { text: 'DeFi Economic Security', url: 'https://medium.com/coinmonks/defi-security-best-practices-d921146cc459' }
        ]
      }
    ]
  },
  {
    id: 'resources',
    title: 'Additional Resources',
    level: ContentLevel.LOCKED,
    items: [
      {
        id: 'resources-community',
        title: 'Rootstock Community',
        description: 'Community resources for developers',
        content: `
          # Rootstock Community
          
          Joining the Rootstock developer community gives you access to support, resources, and networking opportunities.
          
          ## Community Channels:
          
          * **Discord**: The primary communication channel for developers
          * **Telegram**: Community groups for different regions
          * **Forum**: Technical discussions and proposals
          * **GitHub**: Repositories and issue tracking
          * **Twitter**: [@RSKsmart](https://twitter.com/rsksmart)
          
          ## Grants and Funding:
          
          * **RSK Grants**: Program to fund projects in the Rootstock ecosystem
          * **IOV Labs Ventures**: Investments in promising RSK projects
          
          ## Education:
          
          * **Tutorials**: Extensive guides for beginner and experienced developers
          * **Webinars**: Regular technical webinars from the Rootstock team
          * **Code Examples**: Ready-to-use examples for various types of DeFi applications
          
          ## Events:
          
          * **Hackathons**: Regular competitions for developers
          * **Meetups**: Local and online community meetups
          * **Conferences**: Annual RSK/Bitcoin conferences
        `,
        level: ContentLevel.LOCKED,
        triggerPhrases: ['rootstock community', 'developer resources', 'development help'],
        links: [
          { text: 'RSK Developer Portal', url: 'https://developers.rsk.co/' },
          { text: 'RSK Discord', url: 'https://rootstock.io/discord' },
          { text: 'RSK Grants', url: 'https://rootstock.io/grants/' }
        ]
      },
      {
        id: 'resources-examples',
        title: 'Project Examples',
        description: 'Existing DeFi projects on Rootstock',
        content: `
          # DeFi Project Examples on Rootstock
          
          Studying existing projects can provide valuable ideas for your own DeFi application.
          
          ## Notable Projects:
          
          * **Sovryn**: Decentralized trading and lending platform
          * **Money on Chain**: Stablecoins and financial instruments
          * **RSK Swap**: Automated Market Maker (AMM)
          * **TEX**: Decentralized exchange for tokens
          
          ## Open Source Repositories:
          
          * **[RSK Smart Contracts](https://github.com/rsksmart/rsk-contract-parser)**: Library for contract analysis
          * **[RSK Token Bridge](https://github.com/rsksmart/tokenbridge)**: Two-way pegging between RSK and Ethereum
          
          ## Starter Templates:
          
          * **[RSK Truffle Box](https://github.com/rsksmart/rsk-starter-box)**: Template for quick start with Truffle
          * **[RSK Hardhat Template](https://github.com/rsksmart/hardhat-template)**: Project template with Hardhat
          
          Studying these projects will help you understand best practices for Rootstock development and avoid common mistakes.
        `,
        level: ContentLevel.LOCKED,
        triggerPhrases: ['project examples', 'defi on rootstock', 'existing applications'],
        links: [
          { text: 'Sovryn', url: 'https://sovryn.app/' },
          { text: 'Money on Chain', url: 'https://moneyonchain.com/' },
          { text: 'RSK DeFi Ecosystem', url: 'https://developers.rsk.co/solutions/defi/' }
        ]
      }
    ]
  }
];
