

Counter dApp – IOTA Blockchain

A decentralized counter application built on the IOTA blockchain using Move smart contracts and Next.js. Every count is immutable and stored on-chain.








Table of Contents

Introduction

Features

Project Structure

Tech Stack

Installation & Setup

Deploy Smart Contract

Usage

Smart Contract API

Troubleshooting

Useful Links

Deployed Contracts

Contributing

License

Author

Introduction

Counter dApp is a decentralized counting application on the IOTA blockchain. Every increment, decrement, and reset action is permanently recorded on-chain.

This application is ideal for:

Beginners learning blockchain and Web3

Developers exploring IOTA

Anyone wanting to build a complete end-to-end dApp

Features
Frontend

Connect Wallet (IOTA Wallet Extension)

Create Counter on-chain

Increment / Decrement / Reset

Quick Add: +5, +10, +50, +100

Achievement System with 9 achievements

Achievement Gallery

Progress Bar

Toast Notifications

Auto-refresh (Smart Polling)

Modern UI with animations

Smart Contract

On-chain counter object

Safe operations (no negative values)

Event system

Shared object for multi-user interaction

Project Structure
pizza_box/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── components/
│   ├── Counter.tsx
│   ├── Provider.tsx
│   ├── Wallet-connect.tsx
│   └── sample.tsx
│
├── hooks/
│   ├── useCounter.ts
│   └── useContract.ts
│
├── lib/
│   └── config.ts
│
├── contract/
│   └── pizza_box/
│       ├── sources/
│       │   ├── counter.move
│       │   └── pizza_box.move
│       ├── Move.toml
│       └── build/
│
├── scripts/
│   ├── iota-deploy-wrapper.js
│   └── iota-generate-prompt-wrapper.js
│
├── public/
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md

Tech Stack
Frontend

Next.js 16

TypeScript

Tailwind CSS

Radix UI Themes

React Query

Blockchain

IOTA Testnet

Move smart contracts

@iota/dapp-kit

@iota/iota-sdk

Dev Tools

Node.js 20

npm 10

IOTA CLI 1.12

ESLint

Installation & Setup
Requirements

Node.js ≥ 20

npm ≥ 10

IOTA Wallet Extension

IOTA CLI

1. Clone and install
git clone <repository-url>
cd pizza_box
npm install --legacy-peer-deps

2. Run development server
npm run dev


Open: http://localhost:3000

Other scripts
npm run build
npm start
npm run lint
npm run iota-deploy

Deploy Smart Contract
Install IOTA CLI (Ubuntu / WSL)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
cargo install --locked --git https://github.com/iotaledger/iota.git --branch develop iota

Deploy to Testnet
cd contract/pizza_box

iota client new-env --alias testnet --rpc https://api.testnet.iota.cafe:443
iota client switch --env testnet
iota client new-address ed25519
iota client faucet --url https://faucet.testnet.iota.cafe/gas
iota client gas
iota move build
iota client publish --gas-budget 100000000

Update package ID

Edit:

export const TESTNET_PACKAGE_ID = "0x...";

Usage
1. Install IOTA Wallet Extension

Switch to Testnet → request gas at: https://faucet.testnet.iota.cafe/

2. Connect Wallet

Open the dApp → click Connect Wallet.

3. Create Counter

Click "Create Counter" → approve transaction.

4. Counter Actions

+1 → increment

–1 → decrement

Reset → set to 0

+5 / +10 / +50 / +100 → quick add

5. Achievements

Unlock milestones: 1, 10, 50, 100, 200, 500, 1000, 5000, 10000.

Displays popup + confetti + gallery update.

Smart Contract API
Module: counter

Package ID:
0x1b1c01b29d7da78d28baf5a3b8317c0384a1b3450603344b89cb7d3e9a90872a

Struct
public struct Counter has key, store {
    id: UID,
    value: u64,
    owner: address,
}

Entry Functions
create(ctx: &mut TxContext)

Creates a new counter with value = 0.

increment(counter: &mut Counter)

Increase by 1.

decrement(counter: &mut Counter)

Decrease by 1 if value > 0.

reset(counter: &mut Counter)

Set value to 0.

add(counter: &mut Counter, amount: u64)

Add any amount.

Events
struct IncrementEvent { counter_id: ID, old_value: u64, new_value: u64 }
struct DecrementEvent { counter_id: ID, old_value: u64, new_value: u64 }
struct ResetEvent     { counter_id: ID, old_value: u64 }

Troubleshooting
DependentPackageNotFound

Switch wallet to Testnet → refresh.

Insufficient gas

Request tokens at: https://faucet.testnet.iota.cafe/

Transaction failed

Try again after a few seconds.

Counter not updating

Polling pauses after 30s inactivity.

Useful Links

https://wiki.iota.org/

https://github.com/iotaledger/dapp-kit

https://explorer.testnet.iota.cafe/

https://faucet.testnet.iota.cafe/

https://move-language.github.io/move/

Deployed Contracts (Testnet)

Package ID:
0x1b1c01b29d7da78d28baf5a3b8317c0384a1b3450603344b89cb7d3e9a90872a

Transaction:
DZuYHg744kRiBaKjLfRxh2mdMiXMvAdBuNi7UsgNLQ3K

Explorer:
https://explorer.testnet.iota.cafe/object/0x1b1c01b29d7da78d28baf5a3b8317c0384a1b3450603344b89cb7d3e9a90872a

Contributing

Pull requests are welcome.
For major changes, open an issue first.

License

MIT License.

Author

Built with ❤️ on IOTA Blockchain.
