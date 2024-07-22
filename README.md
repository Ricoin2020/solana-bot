
# Solana Bot

This project contains a Solana program (written in Rust) and a React client application to interact with the program.

## Setup Instructions

### Prerequisites

- Rust and Cargo
- Solana CLI
- Node.js and npm

### Setting Up the Solana Program

1. Navigate to the `bot` directory and build the program:
   ```bash
   cd bot
   cargo build-bpf --manifest-path=Cargo.toml --bpf-out-dir=target/deploy