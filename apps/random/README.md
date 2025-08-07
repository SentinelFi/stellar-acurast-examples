# Random Number Example

Acurast generates a cryptographically secure random number and feeds it to a Soroban smart contract. The smart contract receives and stores the random number along with its creation timestamp. For comparison, random number generation and invocation using env.prng().gen() is also demonstrated.

Note: This basic random number generator code is not production-ready and should serve only for demonstration purposes.

## Quick Start

Contract:

```bash
cd contracts
stellar contract build
stellar contract optimize --wasm target/wasm32v1-none/release/hello_world.wasm
stellar contract deploy --wasm target/wasm32v1-none/release/hello_world.wasm --source alice --network testnet --alias random
```

Oracle:

```bash
cd compute
npm install
npm run bundle
node ./dist/bundle.js
npm run deploy
```
