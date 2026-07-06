import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// 1. Define the Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: {
    type: String,
    default: "",
  },
}, { timestamps: true });

// 2. Pre-Save Hook (Modern Async Pattern)
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// 3. Instance Methods MUST go here (Before the export)
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 4. Compile and Export the Model (MUST be the absolute last line)
export default mongoose.model('User', userSchema);