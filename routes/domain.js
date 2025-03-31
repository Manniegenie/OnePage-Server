const express = require("express");
const { Domain } = require("./Userschema"); // Import the Domain model (ensure correct casing)
const router = express.Router();

// **Validation Functions**
const validateUsername = (username) => /^[a-zA-Z0-9]{3,20}$/.test(username);
const validateDomain = (domain) => /^[a-zA-Z0-9-]{3,30}$/.test(domain);

// **POST /register** - Register a Custom Domain
router.post("/register", async (req, res) => {
  const { username, domain, swapConfig, template } = req.body;

  if (!username || !domain || !swapConfig) {
    return res.status(400).json({ success: false, error: "Username, domain, and swapConfig are required" });
  }
  if (!validateUsername(username)) {
    return res.status(400).json({ success: false, error: "Invalid username format" });
  }
  if (!validateDomain(domain)) {
    return res.status(400).json({ success: false, error: "Invalid domain format" });
  }

  try {
    const existingDomain = await Domain.findOne({ domain });
    if (existingDomain) {
      return res.status(400).json({ success: false, error: "Domain already taken" });
    }

    const newDomain = new Domain({ username, domain, swapConfig, template });
    await newDomain.save();
    res.json({ success: true, message: "Domain registered", data: newDomain });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: "Domain or username already in use" });
    }
    console.error("Register domain error:", error);
    res.status(500).json({ success: false, error: "Failed to register domain" });
  }
});

// **GET /:username** - Fetch User Domains
router.get("/:username", async (req, res) => {
  const { username } = req.params;

  if (!validateUsername(username)) {
    return res.status(400).json({ success: false, error: "Invalid username format" });
  }

  try {
    const domains = await Domain.find({ username });
    res.json({ success: true, data: domains });
  } catch (error) {
    console.error("Fetch domains error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch domains" });
  }
});

module.exports = router;
