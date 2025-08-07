// Example of random number generator. Not for production use.
// In Soroban smart contracts, generating random numbers should not rely on 
// predictable blockchain attributes like ledger timestamps or sequence numbers, 
// as these are publicly visible and can be manipulated or predicted by attackers.

import {
    Account,
    BASE_FEE,
    Contract,
    Keypair,
    Networks,
    rpc,
    TransactionBuilder,
    xdr
} from "@stellar/stellar-sdk";

const RPC_URL = "https://soroban-testnet.stellar.org";
const CONTRACT_ID = "YOUR_CONTRACT_ID"; // Replace with your testnet contract ID

// For testing purposes, we use new account every time
const generateAndFundRandomKeypair = async () => {
    const keypair = Keypair.random();
    const server = new rpc.Server(RPC_URL);
    await server.requestAirdrop(keypair.publicKey());
    return keypair;
};

const generateRandomBytes = async () => {
    try {
        // Generate cryptographically secure random bytes
        const randomBytes = crypto.getRandomValues(new Uint8Array(8));
        // Timestamp when it was generated
        const timestamp = Date.now();
        return {
            randomBytes,
            timestamp
        };
    } catch (e) {
        console.log("Unexpected error:", e);
    }
};

async function callContractRnd() {
    const random = await generateRandomBytes();
    if (!random) throw Error("Random is undefined");
    const bytesScVal = xdr.ScVal.scvBytes(Buffer.from(random.randomBytes));
    const uint64Value = new xdr.Uint64(BigInt.asUintN(64, BigInt(random.timestamp)));
    const timestampScVal = xdr.ScVal.scvU64(uint64Value);
    await callContract("set_random", [bytesScVal, timestampScVal]);
}

async function callContractPrng() {
    await callContract("generate_prng");
}

async function callContract(operationName: string, params: any[] = []) {
    try {
        console.log(`Calling contract operation: ${operationName}`);
        const operation = new Contract(CONTRACT_ID).call(operationName, ...params);
        const keypair = await generateAndFundRandomKeypair();
        const server = new rpc.Server(RPC_URL);

        const accountResponse = await server.getAccount(keypair.publicKey());
        const account = new Account(accountResponse.accountId(), accountResponse.sequenceNumber());

        const transaction = new TransactionBuilder(account, {
            fee: BASE_FEE,
            networkPassphrase: Networks.TESTNET,
        })
            .addOperation(operation)
            .setTimeout(30)
            .build();

        const tx = await server.prepareTransaction(transaction);
        tx.sign(keypair);

        let response = await server.sendTransaction(tx);
        const hash = response.hash;
        console.log(`Transaction hash: ${hash}`);

        let r: any = null;
        while (true) {
            r = await server.getTransaction(hash);
            if (r.status !== "NOT_FOUND") {
                break;
            }
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        if (r.status === "SUCCESS") {
            console.log("Transaction successful.");
            return r;
        } else {
            console.log("Transaction failed.");
            throw new Error("Transaction failed");
        }
    } catch (e) {
        console.log("Unexpected error:", e);
    }
}

(async () => {
    await callContractRnd();
    await callContractPrng();
})().catch(console.error);