/**
 * models/User.js
 * Mongoose schema for Users.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { USER_ROLES } = require('../constants');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Never return password in queries by default
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.USER,
    },
    // TODO: V2 — Add fields for:
    //   - avatar (Cloudinary URL)
    //   - bio
    //   - subscriptionPlan (free | pro | enterprise)
    //   - subscriptionExpiry
    //   - isEmailVerified
    //   - emailVerificationToken
    //   - passwordResetToken
    //   - passwordResetExpiry
    //   - preferredLanguage (for multi-language V3)
    //   - notificationPreferences
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

// ─── Pre-save Hook: Hash Password ────────────────────────────────────────────
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ─── Instance Method: Compare Password ───────────────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ─── Transform: Remove sensitive fields from JSON output ─────────────────────
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
