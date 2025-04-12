import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const DonationSchema = new Schema({
    foodType: {
        type: String,
        required: true,
        enum: ['FRUIT', 'VEGETABLE', 'DAIRY', 'BAKED_GOODS', 'MEAT', 'OTHER']
    },
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
    pickupAddress: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true,
            validate: {
                validator: coords => coords.length === 2,
                message: 'Coordinates must be [lng, lat]'
            }
        }
    },
    pickupLocationName: {
        type: String,
        required: true,
        trim: true
    },
    pickupTime: {
        type: Date,
        required: true,
        validate: {
            validator: dt => dt > new Date(),
            message: 'Pickup time must be in the future'
        }
    },
    expiryTime: {
        type: Date,
        required: true,
        validate: {
            validator: function (dt) { return dt > this.pickupTime; },
            message: 'Expiry time must be after pickup time'
        }
    },
    status: {
        type: String,
        enum: ['AVAILABLE', 'RESERVED', 'IN_TRANSIT', 'DELIVERED', 'EXPIRED', 'CANCELLED'],
        required: true,
        default: 'AVAILABLE'
    },
    donor: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipient: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    delivery: {
        type: Schema.Types.ObjectId,
        ref: 'Delivery'
    },
    request: {
        type: Schema.Types.ObjectId,
        ref: 'Request'
    },
    description: {
        Notes: {
            type: String,
            trim: true
        },
        images: [{
            url: String,
            caption: String
        }]
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true }
}
);

// enable geospatial queries
// DonationSchema.index({ pickupAddress: '2dsphere' });
export const Donation = mongoose.model('Donation', DonationSchema);