import mongoose from 'mongoose';

const betaAppSchema = new mongoose.Schema(
  {
    appName: {
      type: String,
      required: [true, 'App name is required'],
      trim: true,
    },
    description: {
      type: String,
    },
    apkUrl: {
      type: String,
      required: [true, 'APK URL is required'],
    },
    version: {
      type: String,
      required: [true, 'Version is required'],
    },
    icon: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

betaAppSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

betaAppSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const BetaApp = mongoose.model('BetaApp', betaAppSchema);
export default BetaApp;
