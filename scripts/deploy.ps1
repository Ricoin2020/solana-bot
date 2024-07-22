# Path to Solana CLI
$solanaPath = "C:\solana-platform-tools\solana-release\bin\solana.exe"

# Path to the program binary
$programBinary = "C:\solana-bot\bot\target\deploy\bot.so"

# Check if Solana CLI exists at the path
if (-Not (Test-Path $solanaPath)) {
    Write-Error "Solana CLI not found at path: $solanaPath"
    exit 1
}

# Check if program binary exists at the path
if (-Not (Test-Path $programBinary)) {
    Write-Error "Program binary not found at path: $programBinary"
    exit 1
}

# Deploy the program
try {
    & $solanaPath program deploy $programBinary
    Write-Output "Program deployed successfully."
} catch {
    Write-Error "Failed to deploy program: $_"
    exit 1
}
