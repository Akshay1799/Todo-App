// user.model.js

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase:true },
  password: { type: String, required: true, minlength: 6 },
  passwordResetToken: String,
  passwordResetExpires: Date

}, {timestamps:true});

userSchema.pre("save", async function () {
  if (!this.isModified('password')) return;

  const hashedPassword = await bcrypt.hash(this.password, 10);
  this.password = hashedPassword;
});

userSchema.methods.comparePassword = async function (enterPassword) {
  return await bcrypt.compare(enterPassword, this.password);
};

userSchema.methods.createPasswordResetToken = function(){
  const resetToken =  crypto.randomBytes(32).toString('hex')

  this.passwordResetToken =  crypto.createHash('sha256').update(resetToken).digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
}

const User = mongoose.model("Users", userSchema);
export default User;
