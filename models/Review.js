import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  blogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
    required: [true, 'Blog ID is required'],
  },
  type: {
    type: String,
    enum: ['like', 'comment'],
    required: [true, 'Review type is required'],
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters'],
  },
  content: {
    type: String,
    maxlength: [500, 'Comment cannot exceed 500 characters'],
  },
}, {
  timestamps: true,
});

reviewSchema.index({ blogId: 1, type: 1 });
reviewSchema.index({ createdAt: -1 });

const Review = mongoose.model('Review', reviewSchema);
export default Review;
