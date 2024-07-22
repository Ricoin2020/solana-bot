const { exec } = require('child_process');
exec('solana-keygen new --outfile payer-keypair.json', (error, stdout, stderr) => {
    if (error) {
        console.error(`Error generating keypair: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});
