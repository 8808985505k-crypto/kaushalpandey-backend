import mongoose from 'mongoose';

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Destination name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    bannerImage: {
      type: String,
    },
    about: {
      type: String,
    },
    thumbnail: {
      type: String,
    },
    location: {
      type: String,
      trim: true,
    },
    mapCoordinates: {
      lat: {
        type: Number,
        min: -90,
        max: 90,
      },
      lng: {
        type: Number,
        min: -180,
        max: 180,
      },
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

destinationSchema.index({ slug: 1 });
destinationSchema.index({ featured: 1 });
destinationSchema.index({ tags: 1 });
destinationSchema.index({ name: 'text', about: 'text', location: 'text' });

destinationSchema.pre('save', function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

destinationSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

destinationSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const Destination = mongoose.model('Destination', destinationSchema);
export default Destination;