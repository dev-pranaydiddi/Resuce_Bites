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
    active: {
        type: Boolean,
        required: true
    },
    status: {
        type: String,
        enum: ['PENDING','REJECTED', 'ACCEPTED','FULFILLED',"ON_THE_WAY_ORG"],
        required: true,
        default: 'PENDING'
    },
    donor: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    donation: {
        type: Schema.Types.ObjectId,
        ref: 'Donation',
        required: true,

    },
    delivery: {
        type: Schema.Types.ObjectId,
        ref: 'Delivery'
    },
    applicant: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });


export const Request = mongoose.model('Request', RequestSchema);