import mongoose from 'mongoose';

const userTicketingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserDetails',
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    sub: {
        type: String,
        required: true,
    },
    complement: {
        type: String,
        required: String,
    },
    status: {
        type: String,
        enum: ["pending", "reviewed", "completed"],
        default: "pending"
    },
}, { timestamps: true });

const UserTicketing = mongoose.model('UserTicketing', userTicketingSchema);

export default UserTicketing;

