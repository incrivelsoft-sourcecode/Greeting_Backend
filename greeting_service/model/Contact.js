import mongoose from 'mongoose';

const { Schema } = mongoose;

const dataSchema = new Schema({
    fullName: {
        type: String,
    },
    email: {
        type: String,
    },
    message: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    whatsappNumber: {
        type: String,
    },
    status: {
        type: String,
        enum: ["pending", "contacted"],
        default: "pending",
    }
}, { timestamps: true });



const ContactDetails = mongoose.model('contact_details', dataSchema);

export { ContactDetails };