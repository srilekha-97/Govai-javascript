import mongoose, { Schema } from 'mongoose';
const UserSchema = new Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    role: {
        type: String,
        enum: ['Admin', 'AI Reviewer', 'Data Scientist', 'Compliance Officer', 'MLOps Engineer', 'Auditor'],
        required: true,
    },
    department: String,
    avatar: String,
    email: String,
}, { timestamps: true });
const User = mongoose.models.User ||
    mongoose.model('User', UserSchema, 'users');
export default User;
