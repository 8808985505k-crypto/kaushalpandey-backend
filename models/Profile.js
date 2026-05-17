import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },
    avatar: {
      type: String,
    },
    banner: {
      type: String,
    },
    socialLinks: {
      github: {
        type: String,
        match: [/^https?:\/\/.+/, 'Please enter a valid URL'],
      },
      linkedin: {
        type: String,
        match: [/^https?:\/\/.+/, 'Please enter a valid URL'],
      },
      twitter: {
        type: String,
        match: [/^https?:\/\/.+/, 'Please enter a valid URL'],
      },
      instagram: {
        type: String,
        match: [/^https?:\/\/.+/, 'Please enter a valid URL'],
      },
      youtube: {
        type: String,
        match: [/^https?:\/\/.+/, 'Please enter a valid URL'],
      },
      facebook: {
        type: String,
        match: [/^https?:\/\/.+/, 'Please enter a valid URL'],
      },
    },
    resumeUrl: {
      type: String,
      match: [/^https?:\/\/.+/, 'Please enter a valid URL'],
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    },
    phone: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

profileSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

profileSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const Profile = mongoose.model('Profile', profileSchema);
export default Profile;