import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    shortDescription: {
      type: String,
      maxlength: [200, 'Short description cannot exceed 200 characters'],
    },
    thumbnail: {
      type: String,
      required: [true, 'Thumbnail is required'],
    },
    techStack: [
      {
        type: String,
        trim: true,
      },
    ],
    features: [
      {
        type: String,
        trim: true,
      },
    ],
    githubUrl: {
      type: String,
      match: [/^https?:\/\/.+/, 'Please enter a valid URL'],
    },
    liveUrl: {
      type: String,
      match: [/^https?:\/\/.+/, 'Please enter a valid URL'],
    },
    screenshots: [
      {
        type: String,
      },
    ],
    category: {
      type: String,
      enum: ['web', 'mobile', 'desktop', 'api', 'other'],
      default: 'web',
    },
    status: {
      type: String,
      enum: ['draft', 'completed', 'in-progress', 'archived'],
      default: 'draft',
    },
  },
  {
    timestamps: true,
  }
);

projectSchema.index({ slug: 1 });
projectSchema.index({ category: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ title: 'text', description: 'text', shortDescription: 'text' });

projectSchema.pre('save', function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

projectSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

projectSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const Project = mongoose.model('Project', projectSchema);
export default Project;