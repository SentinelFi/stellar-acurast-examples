# Weather Example

The code first fetches current weather data for San Francisco city from an external public API, then writes those values (temperature and description) to the Soroban smart contract using Stellar JS SDK.

Note: This basic weather oracle code is not production-ready and should serve only for demonstration purposes.

## Quick Start

Contract:

```bash
cd soroban-acurast
stellar contract build
stellar contract optimize --wasm target/wasm32v1-none/release/hello_world.wasm
stellar contract deploy --wasm target/wasm32v1-none/release/hello_world.wasm --source alice --network testnet --alias weather
```

Oracle:

```bash
cd soroban-oracle
npm install
npm run bundle
node ./dist/bundle.js
npm run deploy
```
