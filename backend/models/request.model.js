import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const RequestSchema = new Schema({
    deliveryAddress: {
        geometry: {
            type: {
                type: String,
                enum: ['Point'],
                // required: true
            },
            coordinates: {
                type: [Number],
                // required: true,
                index: '2dsphere'
            }
        },
        location: {
            type: String,
            // required: true,
            trim: true
        }
    },
    notes: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['PENDING', 'NETWORK_ERROR', 'APPROVED' , 'FULFILLED'],
        required: true,
        default: 'PENDING'
    },
    donation: {
        type: Schema.Types.ObjectId,
        ref: 'Donation',
        required: true,
        unique: true
    },
    delivery: {
        type: Schema.Types.ObjectId,
        ref: 'Delivery'
    },
    recipient: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        // required: true,
        unique: true
    }
}, { timestamps: true });


export const Request = mongoose.model('Request', RequestSchema);