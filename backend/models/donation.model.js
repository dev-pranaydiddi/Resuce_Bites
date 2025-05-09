import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const DonationSchema = new Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    foodType: {
        type: String,
            required: true,
            enum: ['FRUIT', 'VEGETABLE', 'DAIRY','BAKED_GOODS', 'MEAT', 'OTHERS']},
    quantity: {
        amount: {
            type: Number,
            required: true,
            min: 0.1
        },
        unit: {
            type: String,
            enum: ['kg', 'g', 'l', 'ml', 'packets'],
            required: true
        }
    },
    pickUpAddress: {
        street: String,
        city: String,
        state: String,
        zip: String,
        country: { type: String },
        Geolocation: {
            coordinates: {
                lat: Number,
                long: Number,
            }
        }
    },
    deliveryAddress: {
        orgName: String,
        street: String,
        city: String,
        state: String,
        zip: String,
        country: { type: String },
        Geolocation: {
            coordinates: {
                lat: Number,
                long: Number,
            }
        }
    },
    pickUpTime: {
        type: Date,
        // required: true
    },
    expiryTime: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['AVAILABLE', 'RESERVED','IN_TRANSIT', 'DELIVERED', 'EXPIRED', 'CANCELLED'],
        required: true,
        default: 'AVAILABLE'
    },
    donor: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    requests:{
        type: [Schema.Types.ObjectId],
        ref: 'Request',
        default: []
    },
    recipient: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    delivery: {
        type: Schema.Types.ObjectId,
        ref: 'Delivery'
    },
    volunteer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    description: {
        type: String,
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true }
}
);

// enable geospatial queries
// DonationSchema.index({ pickupAddress: '2dsphere' });
export const Donation = mongoose.model('Donation', DonationSchema);