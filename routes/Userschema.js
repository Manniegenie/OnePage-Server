const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// **Domain Schema**
const DomainSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  domain: { type: String, required: true, unique: true },
  swapConfig: { type: Object, required: true },
  template: { type: String, enum: ["simple", "advanced"], default: "simple" },
});

// **User Schema**
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  walletAddress: { type: String },
});

// **Pending User Schema**
const pendingUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  verificationCode: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

// Pre-save hook for password hashing (for UserSchema)
UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Create models. (Mongoose caches models to avoid overwrite errors.)
const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Domain = mongoose.models.Domain || mongoose.model("Domain", DomainSchema);
const PendingUser =
  mongoose.models.PendingUser || mongoose.model("PendingUser", pendingUserSchema);

module.exports = { User, Domain, PendingUser };
