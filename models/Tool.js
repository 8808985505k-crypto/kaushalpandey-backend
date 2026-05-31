import mongoose from 'mongoose';

const toolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tool name is required'],
      trim: true,
      maxlength: [100, 'Tool name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    githubUrl: {
      type: String,
      required: [true, 'GitHub URL is required'],
      trim: true,
    },
    icon: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Tool', toolSchema);
