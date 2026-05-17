import mongoose from 'mongoose';

const certificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Certification title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    organization: {
      type: String,
      required: [true, 'Organization is required'],
      trim: true,
    },
    credentialId: {
      type: String,
      trim: true,
    },
    issueDate: {
      type: Date,
      required: [true, 'Issue date is required'],
    },
    expiryDate: {
      type: Date,
    },
    credentialUrl: {
      type: String,
      match: [/^https?:\/\/.+/, 'Please enter a valid URL'],
    },
    image: {
      type: String,
    },
    organizationLogo: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

certificationSchema.index({ credentialId: 1 });
certificationSchema.index({ organization: 1 });
certificationSchema.index({ verified: 1 });

certificationSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

certificationSchema.virtual('isExpired').get(function () {
  if (!this.expiryDate) return false;
  return new Date() > this.expiryDate;
});

certificationSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const Certification = mongoose.model('Certification', certificationSchema);
export default Certification;