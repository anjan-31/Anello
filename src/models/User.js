import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional for Google Login
  role: { type: String, default: 'user' },
  googleId: { type: String },
  avatar: { type: String }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
