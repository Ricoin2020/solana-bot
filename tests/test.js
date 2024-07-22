const assert = require('assert');
const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    Transaction,
    SystemProgram,
    TransactionInstruction,
    sendAndConfirmTransaction
} = require('@solana/web3.js');
const BN = require('bn.js');
const { TOKEN_PROGRAM_ID, AccountLayout } = require('@solana/spl-token');

const PROGRAM_ID = new PublicKey('GKb17PhyqakyZ6A29QRRS69vvPZuvqPPA5PKR4UyxYVx'); // Your actual program ID

describe('Solana Bot Tests', function () {
    this.timeout(100000); // Extend timeout for airdrop and transactions

    it('should generate a valid keypair', () => {
        const keypair = Keypair.generate();
        assert.strictEqual(keypair.secretKey.length, 64);
        assert.strictEqual(keypair.publicKey.toBase58().length, 44);
    });

    it('Should interact with the deployed program', async function () {
        // Connect to the Solana testnet
        const connection = new Connection(clusterApiUrl('testnet'), 'confirmed');

        // Generate a new keypair to act as the payer
        const payer = Keypair.generate();
        
        // Airdrop SOL to the payer for transaction fees
        await connection.requestAirdrop(payer.publicKey, 1e9); // 1 SOL

        // Wait for the transaction confirmation
        await connection.confirmTransaction(await connection.getLatestBlockhash(), 'confirmed');

        // Generate keypairs for user accounts involved in the test
        const userAccount = Keypair.generate();
        const userTokenAccount = Keypair.generate();
        const dexAccount = Keypair.generate();
        const dexTokenAccount = Keypair.generate();

        // Airdrop SOL to user accounts for setting up token accounts
        await connection.requestAirdrop(userAccount.publicKey, 1e9); // 1 SOL

        // Wait for the transaction confirmation
        await connection.confirmTransaction(await connection.getLatestBlockhash(), 'confirmed');

        // Define the instruction data for placing a buy order (e.g., action 1, amount 1000)
        const instructionData = Buffer.from(Uint8Array.of(1, ...new BN(1000).toArray("le", 8)));

        // Create a transaction
        let transaction = new Transaction().add(
            SystemProgram.createAccount({
                fromPubkey: payer.publicKey,
                newAccountPubkey: userTokenAccount.publicKey,
                lamports: await connection.getMinimumBalanceForRentExemption(AccountLayout.span),
                space: AccountLayout.span,
                programId: TOKEN_PROGRAM_ID,
            }),
            SystemProgram.createAccount({
                fromPubkey: payer.publicKey,
                newAccountPubkey: dexTokenAccount.publicKey,
                lamports: await connection.getMinimumBalanceForRentExemption(AccountLayout.span),
                space: AccountLayout.span,
                programId: TOKEN_PROGRAM_ID,
            }),
            // Instruction to interact with the deployed program
            new TransactionInstruction({
                keys: [
                    { pubkey: payer.publicKey, isSigner: true, isWritable: true },
                    { pubkey: userAccount.publicKey, isSigner: false, isWritable: true },
                    { pubkey: userTokenAccount.publicKey, isSigner: false, isWritable: true },
                    { pubkey: dexAccount.publicKey, isSigner: false, isWritable: true },
                    { pubkey: dexTokenAccount.publicKey, isSigner: false, isWritable: true },
                ],
                programId: PROGRAM_ID,
                data: instructionData,
            })
        );

        // Sign and send the transaction
        await sendAndConfirmTransaction(connection, transaction, [payer, userAccount, userTokenAccount, dexAccount, dexTokenAccount]);

        // Fetch the accounts to verify the result of the transaction
        const userTokenAccountInfo = await connection.getAccountInfo(userTokenAccount.publicKey);
        const dexTokenAccountInfo = await connection.getAccountInfo(dexTokenAccount.publicKey);

        // Add assertions to verify the expected outcome
        assert.ok(userTokenAccountInfo !== null, "User token account should exist");
        assert.ok(dexTokenAccountInfo !== null, "DEX token account should exist");
    });
});
