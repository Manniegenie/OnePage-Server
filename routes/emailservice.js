const axios = require("axios");
const config = require("./config");

/**
 * Sends a verification email via Mailgun using HTTP.
 * @param {string} email - The recipient's email address.
 * @param {string} code - The verification code.
 */
async function sendVerificationEmail(email, code) {
  const mailgunDomain = config.mailgunDomain; // e.g., "yourdomain.com"
  const mailgunApiKey = config.mailgunApiKey; // e.g., "key-XXXXXXXXXXXXXXXXXXXXXX"
  const url = `https://api.mailgun.net/v3/${mailgunDomain}/messages`;

  const params = new URLSearchParams();
  params.append("from", `noreply@${mailgunDomain}`);
  params.append("to", email);
  params.append("subject", "Verify Your Email");
  params.append("text", `Your OnePage verification code is: ${code}. It expires in 10 minutes.`);

  try {
    const response = await axios.post(url, params.toString(), {
      auth: {
        username: "api",
        password: mailgunApiKey,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    console.log(`✅ Verification email sent to ${email}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error sending verification email:", error.response ? error.response.data : error.message);
    throw error;
  }
}

/**
 * Generates a 6-digit verification code.
 * @returns {string}
 */
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

module.exports = { sendVerificationEmail, generateVerificationCode };
