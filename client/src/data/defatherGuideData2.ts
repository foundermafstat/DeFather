import { type GuideSection, ContentLevel } from './defatherGuideTypes';

// Advanced guide sections
export const advancedSections: GuideSection[] = [
  {
    id: 'smart-contracts',
    title: 'Creating Smart Contracts',
    level: ContentLevel.LOCKED,
    items: [
      {
        id: 'smart-contracts-basics',
        title: 'Smart Contract Basics for DeFi',
        description: 'Basic principles and patterns for DeFi smart contracts',
        content: `
          # Smart Contract Basics for DeFi on Rootstock
          
          Creating DeFi applications on Rootstock starts with designing reliable smart contracts. Since RSK is EVM compatible, you can use Solidity similarly to Ethereum.
          
          ## Key Concepts:
          
          * **Tokens**: ERC20, ERC721, and other standards
          * **Liquidity Protocols**: Automated Market Makers (AMM)
          * **Lending**: Contracts for secured lending
          * **Staking**: Mechanisms for receiving rewards
          
          ## Libraries and Frameworks:
          
          * **OpenZeppelin**: Secure, battle-tested contracts
          * **DeFi Legos**: Composable components for rapid development
          
          ## Basic Project Structure:
          
          \`\`\`
          contracts/
          ├── interfaces/     # Interfaces for interaction
          ├── libraries/      # Reusable libraries
          ├── tokens/         # Project tokens
          ├── protocol/       # Core protocol logic
          └── governance/     # Governance mechanisms (optional)
          \`\`\`
        `,
        level: ContentLevel.LOCKED,
        triggerPhrases: ['creating smart contracts', 'smart contracts defi', 'basic contracts'],
        codeExample: `
          // SPDX-License-Identifier: MIT
          pragma solidity ^0.8.0;
          
          import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
          import "@openzeppelin/contracts/access/Ownable.sol";
          
          contract DeFatherToken is ERC20, Ownable {
              constructor(uint256 initialSupply) ERC20("DeFather", "DEFR") {
                  _mint(msg.sender, initialSupply);
              }
              
              // Additional token logic
          }
        `
      },
      {
        id: 'smart-contracts-security',
        title: 'Smart Contract Security',
        description: 'Principles and practices for developing secure DeFi protocols',
        content: `
          # Smart Contract Security for DeFi
          
          Security is critical for DeFi applications, where vulnerabilities can lead to loss of user funds.
          
          ## Major Security Threats:
          
          * **Overflow/Underflow**: Manipulations with integer arithmetic
          * **Reentrancy Attacks**: Recursive contract calls
          * **Frontrunning**: Using public information to get ahead of transactions
          * **Oracle Manipulation**: Attacks on external data sources
          
          ## Best Practices:
          
          * **Use tested libraries** (OpenZeppelin)
          * **Follow the Checks-Effects-Interactions pattern**
          * **Use access modifiers** to restrict functionality
          * **Always conduct security audits** before deployment
          * **Implement circuit breakers** for critical situations
          
          ## Audit Tools:
          
          * **Slither**: Static analyzer for Solidity
          * **Mythril**: Smart contract analysis tool
          * **Echidna**: Property-based contract fuzzer
        `,
        level: ContentLevel.LOCKED,
        triggerPhrases: ['smart contract security', 'contract audit', 'defi vulnerabilities'],
        links: [
          { text: 'Smart Contract Security Guide', url: 'https://github.com/crytic/not-so-smart-contracts' },
          { text: 'Trail of Bits Security Tools', url: 'https://github.com/trailofbits/eth-security-toolbox' }
        ]
      }
    ]
  },
  {
    id: 'frontend',
    title: 'Frontend Integration',
    level: ContentLevel.LOCKED,
    items: [
      {
        id: 'frontend-wallet',
        title: 'Wallet Connection',
        description: 'Integrating with Web3 wallets in client applications',
        content: `
          # Connecting to Wallets
          
          Interacting with the Rootstock blockchain from a frontend application requires connecting to the user's Web3 wallet.
          
          ## Supported Wallets:
          
          * **MetaMask**: The most common wallet
          * **Nifty Wallet**: Wallet with native RSK support
          * **Liquality**: Multi-chain wallet
          
          ## Setting up MetaMask for Rootstock:
          
          **Mainnet:**
          - Network Name: RSK Mainnet
          - RPC URL: https://public-node.rsk.co
          - Chain ID: 30
          - Symbol: RBTC
          - Block Explorer: https://explorer.rsk.co
          
          **Testnet:**
          - Network Name: RSK Testnet
          - RPC URL: https://public-node.testnet.rsk.co
          - Chain ID: 31
          - Symbol: tRBTC
          - Block Explorer: https://explorer.testnet.rsk.co
          
          ## Connecting to a Wallet in React:
          
          For blockchain interaction, the following libraries are recommended:
          - **ethers.js**: A full-featured library for interacting with Ethereum/RSK
          - **web3-react**: Hooks and utilities for React applications
        `,
        level: ContentLevel.LOCKED,
        triggerPhrases: ['wallet connection', 'metamask and rootstock', 'web3 integration'],
        codeExample: `
          // Example of connecting to MetaMask using ethers.js
          import { ethers } from 'ethers';
          
          async function connectWallet() {
            if (window.ethereum) {
              try {
                // Request to connect to the wallet
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                
                // Create provider
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                
                // Check if we're on the Rootstock network
                const network = await provider.getNetwork();
                if (network.chainId !== 30 && network.chainId !== 31) {
                  alert("Please switch to the Rootstock network in your wallet");
                }
                
                return provider;
              } catch (error) {
                console.error("Error connecting to wallet:", error);
              }
            } else {
              alert("MetaMask is not installed. Please install the MetaMask extension.");
            }
          }
        `
      }
    ]
  }
];
