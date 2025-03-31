const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
    const { walletAddress } = req.body;

    if (!walletAddress) return res.status(400).json({ success: false, error: "Wallet address is required" });

    // Here, you would check if the wallet is already linked or store the new wallet.
    return res.json({ success: true, message: "Wallet connected successfully", walletAddress });
});

module.exports = router;
