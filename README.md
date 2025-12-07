
# 🔢 Counter dApp - IOTA Blockchain

A decentralized counter application built on IOTA blockchain using Move smart contracts and Next.js. Every count is immutable and stored on-chain!

[![IOTA](https://img.shields.io/badge/IOTA-Testnet-blue)](https://wiki.iota.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.0.3-black)](https://nextjs.org/)
[![Move](https://img.shields.io/badge/Move-Smart%20Contract-orange)](https://move-language.github.io/move/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[Demo](#-usage) • [Installation](#-installation--setup) • [Deploy](#-deploy-smart-contract) • [Documentation](#-smart-contract-api)

## 📋 Table of Contents

- [Introduction](#-introduction)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Tech Stack](#-tech-stack)
- [Installation & Setup](#-installation--setup)
- [Deploy Smart Contract](#-deploy-smart-contract)
- [Usage](#-usage)
- [Smart Contract API](#-smart-contract-api)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 Introduction

Counter dApp is your first decentralized counting application on IOTA blockchain. Every increment/decrement/reset operation is permanently recorded on-chain and cannot be changed or deleted.

**This application is for:**
- 🎓 Beginners learning blockchain and Web3
- 👨‍💻 Developers who want to understand IOTA integration
- 🚀 Anyone wanting to build a simple but complete dApp

## 📸 Screenshots

> *Screenshots will be added soon. Run the app locally to see it in action!*

**Key Features:**
- Modern, gradient UI with smooth animations
- Real-time counter updates with blockchain confirmation
- Achievement system with confetti celebrations
- Responsive design for all screen sizes

## ✨ Features

### Frontend
- ✅ **Connect Wallet** - Connect with IOTA Wallet
- ✅ **Create Counter** - Create counter on-chain
- ✅ **Increment/Decrement** - Increase/Decrease value by +1/-1
- ✅ **Reset** - Set counter to 0
- ✅ **Quick Add** - Quick add +5, +10, +50, +100
- ✅ **Achievement System** - 9 achievements with popup + confetti animation
- ✅ **Achievement Gallery** - Display all unlocked achievements
- ✅ **Progress Bar** - Progress to next achievement
- ✅ **Toast Notifications** - Success/failure notifications for all actions
- ✅ **Smart Polling** - Auto-refresh every 3 seconds, stops after 30s inactivity
- ✅ **Beautiful UI** - Modern animations, gradients and effects

### Smart Contract
- ✅ **Counter Object** - On-chain storage
- ✅ **Events** - Emit events for all operations
- ✅ **Safe Operations** - No negative values allowed
- ✅ **Shared Object** - Multiple users can interact

## 📁 Project Structure

```
counter_dapp_IOTA/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Home page
│   └── globals.css              # Global styles + animations
│
├── components/                   # React Components
│   ├── Counter.tsx              # Main counter UI
│   ├── Provider.tsx             # IOTA + React Query providers
│   ├── Wallet-connect.tsx       # Wallet connection button
│   ├── AchievementGallery.tsx   # Achievement gallery component
│   └── AchievementPopup.tsx     # Achievement popup with confetti
│
├── hooks/                        # Custom React Hooks
│   ├── useCounter.ts            # Counter logic + blockchain interaction
│   └── useContract.ts           # Generic contract hook
│
├── lib/                          # Configuration & Utilities
│   ├── config.ts                # Network config + Package IDs
│   └── achievements.ts          # Achievement definitions
│
├── contract/                     # Move Smart Contracts
│   └── pizza_box/
│       ├── sources/
│       │   ├── counter.move     # Counter smart contract
│       │   └── pizza_box.move   # Pizza contract
│       ├── Move.toml            # Move package manifest
│       └── build/               # Compiled contracts
│
├── scripts/                      # Deployment scripts
│   ├── iota-deploy-wrapper.js
│   └── iota-generate-prompt-wrapper.js
│
├── public/                       # Static assets
├── package.json                  # Dependencies
├── tsconfig.json                # TypeScript config
├── next.config.ts               # Next.js config
└── README.md                    # This file
```

## 🛠️ Tech Stack

### Frontend Stack
- **Framework:** [Next.js 16.0.3](https://nextjs.org/) with App Router
- **Language:** TypeScript 5.x
- **UI Library:** [Radix UI Themes](https://www.radix-ui.com/themes)
- **Styling:** Tailwind CSS 4.x
- **State Management:** React Hooks + TanStack React Query

### Blockchain Stack
- **Blockchain:** [IOTA Testnet](https://wiki.iota.org/)
- **Smart Contract:** Move Language
- **Wallet Integration:** [@iota/dapp-kit](https://www.npmjs.com/package/@iota/dapp-kit)
- **SDK:** [@iota/iota-sdk](https://www.npmjs.com/package/@iota/iota-sdk)

### Development Tools
- **Package Manager:** npm
- **Linter:** ESLint 9
- **IOTA CLI:** iota-cli (for deployment)

## 🚀 Installation & Setup

### System Requirements
- **Node.js:** >= 20.x
- **npm:** >= 10.x
- **IOTA CLI:** >= 1.12.0 (for contract deployment)
- **IOTA Wallet Extension:** Chrome/Edge extension

### Step 1: Clone and install dependencies

```bash
# Clone repository
git clone https://github.com/koangwithluv/counter_dapp_IOTA.git
cd counter_dapp_IOTA

# Install dependencies
npm install --legacy-peer-deps
```

**Note:** You must use the `--legacy-peer-deps` flag due to package version conflicts.

### Step 2: Run development server

```bash
npm run dev
```

Open your browser and navigate to: **http://localhost:3000**

### Other Commands

```bash
# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Deploy contract (requires IOTA CLI)
npm run iota-deploy
```

## 🔐 Deploy Smart Contract

### Install IOTA CLI (on Ubuntu/WSL)

```bash
# Install Rust if not already installed
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install IOTA CLI
cargo install --locked --git https://github.com/iotaledger/iota.git --branch develop iota
```

### Deploy contract to Testnet

```bash
# Navigate to contract directory
cd contract/pizza_box

# 1. Setup testnet environment
iota client new-env --alias testnet --rpc https://api.testnet.iota.cafe:443

# 2. Switch to testnet
iota client switch --env testnet

# 3. Create new address (if you don't have one)
iota client new-address ed25519

# 4. Request gas from faucet
iota client faucet --url https://faucet.testnet.iota.cafe/gas

# 5. Check balance
iota client gas

# 6. Build contract
iota move build

# 7. Deploy contract
iota client publish --gas-budget 100000000
```

### Update Package ID

After successful deployment, copy the **Package ID** from output and update it in `lib/config.ts`:

```typescript
export const TESTNET_PACKAGE_ID = "0x..." // Paste your Package ID here
```

### Network Configuration

Ensure the frontend is connected to the correct network in `components/Provider.tsx`:

```typescript
<IotaClientProvider networks={networkConfig} defaultNetwork="testnet">
```

## 📱 Usage

### 1. Install IOTA Wallet

- Download [IOTA Wallet Extension](https://chrome.google.com/webstore) for Chrome/Edge
- Create or import wallet
- **Switch to Testnet** (top right corner)
- Request gas from: https://faucet.testnet.iota.cafe/

### 2. Connect Wallet

1. Open http://localhost:3000
2. Click "Connect Wallet" button
3. Select wallet and approve connection

### 3. Create Counter

1. Click "Create Counter"
2. Approve transaction in wallet
3. Wait for transaction confirmation (~2-5 seconds)
4. Counter appears with value 0

### 4. Using Counter

- **+1 Button:** Increment counter by 1
- **-1 Button:** Decrement counter by 1 (no negative values)
- **Reset Button:** Set counter to 0
- **+5, +10, +50, +100:** Quick add large amounts

### 5. Achievement System

Scroll down to view the **Achievement Gallery** with 9 achievements:

- 🎯 **First Step** - 1 count (Common)
- 🔥 **Ten Club** - 10 counts (Common)
- 🎖️ **Half Century** - 50 counts (Rare)
- 💯 **The Century!** - 100 counts (Rare)
- ⚡ **Double Century** - 200 counts (Epic)
- 🏆 **Half Thousand** - 500 counts (Epic)
- 👑 **The Thousand!** - 1,000 counts (Legendary)
- 🌟 **Five Thousand** - 5,000 counts (Legendary)
- 💎 **Ten Thousand!** - 10,000 counts (Legendary)

**When unlocking achievement:**
- Full-screen popup with confetti animation 🎊
- Toast notification
- Achievement Gallery auto-updates
- Progress bar shows % to next achievement

## 📜 Smart Contract API

### Module: `counter`

**Package ID:** `0x1b1c01b29d7da78d28baf5a3b8317c0384a1b3450603344b89cb7d3e9a90872a`

### Struct

```move
public struct Counter has key, store {
    id: UID,
    value: u64,
    owner: address,
}
```

### Entry Functions

#### `create(ctx: &mut TxContext)`
Create a new counter with value 0.

**Example:**
```typescript
const tx = new Transaction()
tx.moveCall({
  target: `${packageId}::counter::create`,
})
```

#### `increment(counter: &mut Counter)`
Increment counter by 1.

**Example:**
```typescript
tx.moveCall({
  target: `${packageId}::counter::increment`,
  arguments: [tx.object(counterId)],
})
```

#### `decrement(counter: &mut Counter)`
Decrement counter by 1 (only when value > 0).

**Example:**
```typescript
tx.moveCall({
  target: `${packageId}::counter::decrement`,
  arguments: [tx.object(counterId)],
})
```

#### `reset(counter: &mut Counter)`
Reset counter to 0.

**Example:**
```typescript
tx.moveCall({
  target: `${packageId}::counter::reset`,
  arguments: [tx.object(counterId)],
})
```

#### `add(counter: &mut Counter, amount: u64)`
Add a custom amount to counter.

**Example:**
```typescript
tx.moveCall({
  target: `${packageId}::counter::add`,
  arguments: [tx.object(counterId), tx.pure.u64(50)],
})
```

### View Functions

#### `get_value(counter: &Counter): u64`
Get the current counter value.

#### `get_owner(counter: &Counter): address`
Get the owner address of the counter.

### Events

```move
public struct IncrementEvent has copy, drop {
    counter_id: ID,
    old_value: u64,
    new_value: u64,
}

public struct DecrementEvent has copy, drop {
    counter_id: ID,
    old_value: u64,
    new_value: u64,
}

public struct ResetEvent has copy, drop {
    counter_id: ID,
    old_value: u64,
}
```

## 🐛 Troubleshooting

### Error: `DependentPackageNotFound`

**Cause:** Wallet is connected to wrong network or Package ID is incorrect.

**Solution:**
1. Open IOTA Wallet extension
2. Switch to **Testnet** (not Devnet)
3. Refresh the webpage
4. Try again

### Error: `Insufficient gas`

**Cause:** Not enough IOTA tokens to pay gas fees.

**Solution:**
1. Go to https://faucet.testnet.iota.cafe/
2. Paste your wallet address
3. Click "Request Tokens"
4. Wait a few seconds and try again

### Error: `Transaction failed`

**Cause:** Could be due to network congestion or low gas budget.

**Solution:**
1. Wait a few seconds and try again
2. Check IOTA Explorer to view transaction status
3. Refresh page and reconnect wallet

### Counter not auto-updating

**Cause:** Polling may be stopped due to inactivity.

**Solution:**
- Perform any action to restart polling
- Or refresh page manually
- Polling auto-stops after 30 seconds of inactivity to save resources

### Transaction History not visible

**Cause:** History is stored in session, lost when refreshing.

**Solution:**
- History only displays after performing transactions
- Refreshing page clears history (this is expected behavior)
- Transactions can still be viewed on IOTA Explorer

## 🔗 Useful Links

- **IOTA Documentation:** https://wiki.iota.org/
- **IOTA dApp Kit:** https://github.com/iotaledger/dapp-kit
- **IOTA Testnet Explorer:** https://explorer.testnet.iota.cafe/
- **Testnet Faucet:** https://faucet.testnet.iota.cafe/
- **Move Language:** https://move-language.github.io/move/
- **Next.js Docs:** https://nextjs.org/docs

## 📊 Deployed Contracts

### Testnet
- **Package ID:** `0x1b1c01b29d7da78d28baf5a3b8317c0384a1b3450603344b89cb7d3e9a90872a`
- **Transaction:** `DZuYHg744kRiBaKjLfRxh2mdMiXMvAdBuNi7UsgNLQ3K`
- **Explorer:** [View on Explorer](https://explorer.testnet.iota.cafe/object/0x1b1c01b29d7da78d28baf5a3b8317c0384a1b3450603344b89cb7d3e9a90872a)

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**koangwithluv**
- GitHub: [@koangwithluv](https://github.com/koangwithluv)
- Repository: [counter_dapp_IOTA](https://github.com/koangwithluv/counter_dapp_IOTA)

Built with ❤️ using IOTA Blockchain

---

**Happy Counting on the Blockchain! 🎯🚀**