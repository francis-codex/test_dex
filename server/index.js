import express from 'express';
import { config } from "cloudinary";
import { ethers, formatUnits } from "ethers";

const app = express();
const PORT = process.env.PORT || 3000;

// UncaughtException Error
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  process.exit(1);
});

// Cloudinary configuration
config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Root path
app.get("/", (req, res) => {
  res.send("Welcome to the text dex. Use /CodexApiTest to access the USDC contract information.");
});

// CodexApiTest endpoint
app.get("/CodexApiTest", async (req, res) => {
  try {
    // Connecting to Ethereum network
    const provider = new ethers.JsonRpcProvider("https://mainnet.infura.io/v3/28b69098e1274a15969c703ffe407a86", undefined, { timeout: 30000 });

    // USDC contract address on Ethereum mainnet
    const usdcAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

    // USDC ABI (includes only the functions we need)
    const usdcAbi = [
      "function name() view returns (string)",
      "function symbol() view returns (string)",
      "function totalSupply() view returns (uint256)"
    ];

    // Creating contract instance
    const usdcContract = new ethers.Contract(usdcAddress, usdcAbi, provider);

    // Fetching contract information
    const name = await usdcContract.name();
    const symbol = await usdcContract.symbol();
    const totalSupply = await usdcContract.totalSupply();

    // Format total supply (USDC has 6 decimal places)
    const formattedTotalSupply = formatUnits(totalSupply, 6);

    // Results in console
    console.log("USDC Contract Information:");
    console.log(`Name: ${name}`);
    console.log(`Symbol: ${symbol}`);
    console.log(`Total Supply: ${formattedTotalSupply} USDC`);

    // Sending response
    res.json({
      name,
      symbol,
      totalSupply: formattedTotalSupply
    });
  } catch (error) {
    console.error("Error fetching smart contract data:", error);
    res.status(500).json({ error: "An error occurred while fetching smart contract data" });
  }
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});