import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/.+@.+\..+/, 'Must be a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    name: {
        first: { type: String, required: true, trim: true },
        last: { type: String, required: true, trim: true }
    },
    phone: {
        type: String,
        match: [/^\+\d{1,3}\s?\d{4,14}$/, 'Must be a valid international phone number']
    },
    role: {
        type: String,
        enum: ['DONOR', 'VOLUNTEER', 'RECIPIENT', 'ADMIN'],
        required: true,
        default: 'RECIPIENT'
    },
    address: {
        street: String,
        city: String,
        state: String,
        zip: String,
        country: { type: String, default: 'USA' },
        Geolocation: {
            coordinates:{
                lat: Number,
                long: Number,
            }
        }
    },
    donation: [{
        type: Schema.Types.ObjectId,
        ref: 'Donation'
    }],
    delivery: [{
        type: Schema.Types.ObjectId,
        ref: 'Delivery'
    }],
    request: [{
        type: Schema.Types.ObjectId,
        ref: 'Request'
    }]
}, { timestamps: true });

export const User = mongoose.model("User", UserSchema);