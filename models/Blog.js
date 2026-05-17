import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    destinationSlug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    thumbnail: {
      type: String,
      required: [true, 'Thumbnail is required'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    excerpt: {
      type: String,
      maxlength: [300, 'Excerpt cannot exceed 300 characters'],
    },
    videoUrl: {
      type: String,
      match: [/^https?:\/\/.+/, 'Please enter a valid video URL'],
    },
    videoType: {
      type: String,
      enum: ['youtube', 'drive'],
      default: 'youtube',
    },
    estimatedCost: {
      type: Number,
      min: [0, 'Cost cannot be negative'],
    },
    travelTags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    published: {
      type: Boolean,
      default: false,
    },
    duration: {
      type: String,
    },
    author: {
      type: String,
      default: 'Kaushal Pandey',
    },
  },
  {
    timestamps: true,
  }
);

blogSchema.index({ slug: 1 });
blogSchema.index({ destinationSlug: 1 });
blogSchema.index({ published: 1 });
blogSchema.index({ travelTags: 1 });
blogSchema.index({ title: 'text', excerpt: 'text', content: 'text' });

blogSchema.pre('save', function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  if (!this.excerpt && this.content) {
    this.excerpt = this.content.replace(/<[^>]*>/g, '').substring(0, 297) + '...';
  }
  next();
});

blogSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

blogSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;