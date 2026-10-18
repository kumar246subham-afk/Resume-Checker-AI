const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    preferences: {
      currentStatus: {
        type: String,
        enum: ['Student', 'Fresher', 'Experienced', 'Career Switcher', 'Not Specified'],
        default: 'Not Specified'
      },
      targetJobRole: {
        type: String,
        default: 'Software Engineer'
      },
      experienceLevel: {
        type: String,
        enum: ['Entry Level (0-2 yrs)', 'Mid Level (3-5 yrs)', 'Senior (5-8 yrs)', 'Lead/Executive (8+ yrs)'],
        default: 'Entry Level (0-2 yrs)'
      },
      preferredTemplate: {
        type: String,
        default: 'ats-classic'
      },
      targetIndustry: {
        type: String,
        default: 'Technology'
      },
      onboardingCompleted: {
        type: Boolean,
        default: false
      }
    },
    subscription: {
      plan: {
        type: String,
        enum: ['free', 'pro', 'career_plus'],
        default: 'free'
      },
      analysesLimit: {
        type: Number,
        default: 15
      },
      analysesUsed: {
        type: Number,
        default: 0
      }
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
  },
  {
    timestamps: true
  }
);

// Hash password before save
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash reset token
UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour
  return resetToken;
};

module.exports = mongoose.model('User', UserSchema);
