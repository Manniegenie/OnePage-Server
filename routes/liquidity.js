const express = require("express");
const { ethers } = require("ethers");
const config = require("./config");


const router = express.Router();



// **Smart Contract Setup**
const provider = "https://data-seed-prebsc-1-s1.binance.org:8545/";
const wallet = new ethers.Wallet(config.privateKey, provider);
const contract = new ethers.Contract(config.contractAddress, [
    "function addPair(address tokenA, address tokenB, uint256 fee) external",
    "function removePair(address tokenA, address tokenB) external",
    "function depositLiquidity(address tokenA, address tokenB, uint256 amountA, uint256 amountB) external",
    "function swap(address tokenIn, address tokenOut, uint256 amountIn, uint256 minAmountOut) external",
    "function withdrawFromPair(address tokenA, address tokenB, uint256 amountA, uint256 amountB) external",
], wallet);


// **Validation Functions**
const isValidAddress = (address) => ethers.utils.isAddress(address);
const isPositiveNumber = (num) => Number(num) > 0;

// **POST /addPair** - Add Liquidity Pair
router.post("/addPair", async (req, res) => {
    const { tokenA, tokenB, fee } = req.body;

    if (!tokenA || !tokenB || !fee) {
        return res.status(400).json({ success: false, error: "All fields required" });
    }
    if (!isValidAddress(tokenA) || !isValidAddress(tokenB)) {
        return res.status(400).json({ success: false, error: "Invalid token address" });
    }
    if (!isPositiveNumber(fee)) {
        return res.status(400).json({ success: false, error: "Fee must be a positive number" });
    }

    try {
        const tx = await contract.addPair(tokenA, tokenB, fee);
        await tx.wait();
        res.json({ success: true, message: "Pair added successfully", txHash: tx.hash });
    } catch (error) {
        console.error("Add pair error:", error);
        res.status(500).json({ success: false, error: "Failed to add pair" });
    }
});

// **POST /removePair** - Remove Liquidity Pair
router.post("/removePair", async (req, res) => {
    const { tokenA, tokenB } = req.body;

    if (!tokenA || !tokenB) {
        return res.status(400).json({ success: false, error: "All fields required" });
    }
    if (!isValidAddress(tokenA) || !isValidAddress(tokenB)) {
        return res.status(400).json({ success: false, error: "Invalid token address" });
    }

    try {
        const tx = await contract.removePair(tokenA, tokenB);
        await tx.wait();
        res.json({ success: true, message: "Pair removed", txHash: tx.hash });
    } catch (error) {
        console.error("Remove pair error:", error);
        res.status(500).json({ success: false, error: "Failed to remove pair" });
    }
});

// **POST /deposit** - Deposit Liquidity
router.post("/deposit", async (req, res) => {
    const { tokenA, tokenB, amountA, amountB } = req.body;

    if (!tokenA || !tokenB || !amountA || !amountB) {
        return res.status(400).json({ success: false, error: "All fields required" });
    }
    if (!isValidAddress(tokenA) || !isValidAddress(tokenB)) {
        return res.status(400).json({ success: false, error: "Invalid token address" });
    }
    if (!isPositiveNumber(amountA) || !isPositiveNumber(amountB)) {
        return res.status(400).json({ success: false, error: "Amounts must be positive numbers" });
    }

    try {
        const tx = await contract.depositLiquidity(tokenA, tokenB, amountA, amountB);
        await tx.wait();
        res.json({ success: true, message: "Liquidity deposited", txHash: tx.hash });
    } catch (error) {
        console.error("Deposit liquidity error:", error);
        res.status(500).json({ success: false, error: "Failed to deposit liquidity" });
    }
});

// **POST /swap** - Swap Tokens
router.post("/swap", async (req, res) => {
    const { tokenIn, tokenOut, amountIn, minAmountOut } = req.body;

    if (!tokenIn || !tokenOut || !amountIn || !minAmountOut) {
        return res.status(400).json({ success: false, error: "All fields required" });
    }
    if (!isValidAddress(tokenIn) || !isValidAddress(tokenOut)) {
        return res.status(400).json({ success: false, error: "Invalid token address" });
    }
    if (!isPositiveNumber(amountIn) || !isPositiveNumber(minAmountOut)) {
        return res.status(400).json({ success: false, error: "Amounts must be positive numbers" });
    }

    try {
        const tx = await contract.swap(tokenIn, tokenOut, amountIn, minAmountOut);
        await tx.wait();
        res.json({ success: true, message: "Swap successful", txHash: tx.hash });
    } catch (error) {
        console.error("Swap error:", error);
        res.status(500).json({ success: false, error: "Failed to swap tokens" });
    }
});

// **POST /withdraw** - Withdraw Liquidity
router.post("/withdraw", async (req, res) => {
    const { tokenA, tokenB, amountA, amountB } = req.body;

    if (!tokenA || !tokenB || !amountA || !amountB) {
        return res.status(400).json({ success: false, error: "All fields required" });
    }
    if (!isValidAddress(tokenA) || !isValidAddress(tokenB)) {
        return res.status(400).json({ success: false, error: "Invalid token address" });
    }
    if (!isPositiveNumber(amountA) || !isPositiveNumber(amountB)) {
        return res.status(400).json({ success: false, error: "Amounts must be positive numbers" });
    }

    try {
        const tx = await contract.withdrawFromPair(tokenA, tokenB, amountA, amountB);
        await tx.wait();
        res.json({ success: true, message: "Liquidity withdrawn", txHash: tx.hash });
    } catch (error) {
        console.error("Withdraw liquidity error:", error);
        res.status(500).json({ success: false, error: "Failed to withdraw liquidity" });
    }
});

module.exports = router;