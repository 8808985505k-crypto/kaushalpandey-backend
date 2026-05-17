import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [100, 'Company name cannot exceed 100 characters'],
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
      maxlength: [100, 'Role cannot exceed 100 characters'],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
    },
    description: {
      type: String,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    logo: {
      type: String,
    },
    current: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

experienceSchema.index({ startDate: -1 });
experienceSchema.index({ current: 1 });

experienceSchema.pre('save', function (next) {
  if (this.current) {
    this.endDate = undefined;
  }
  next();
});

experienceSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

experienceSchema.virtual('duration').get(function () {
  const end = this.endDate || new Date();
  const months = Math.floor((end - this.startDate) / (1000 * 60 * 60 * 24 * 30));
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  if (years === 0) return `${remainingMonths} months`;
  if (remainingMonths === 0) return `${years} year${years > 1 ? 's' : ''}`;
  return `${years} year${years > 1 ? 's' : ''} ${remainingMonths} months`;
});

experienceSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const Experience = mongoose.model('Experience', experienceSchema);
export default Experience;