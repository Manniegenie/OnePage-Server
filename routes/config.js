require("dotenv").config();

module.exports = {
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  port: process.env.PORT || 5000,
  blockchainProvider: process.env.BLOCKCHAIN_PROVIDER,
  contractAddress: process.env.CONTRACT_ADDRESS,
  // Mailgun settings:
  mailgunApiKey: process.env.MAILGUN_API_KEY,
  mailgunDomain: process.env.MAILGUN_DOMAIN,
  // You can add more config items as needed
};
