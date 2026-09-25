import mongoose from 'mongoose';

const storySchema = new mongoose.Schema(
  {
    rawText: {
      type: String,
      required: true,
      trim: true,
    },
    language: {
      type: String,
      default: 'en',
    },
    requestedStyle: {
      type: String,
      default: 'Superhero',
    },
    requestedPanelCount: {
      type: Number,
      default: 6,
    },
    status: {
      type: String,
      enum: ['pending', 'analyzed', 'generated', 'failed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

export const Story = mongoose.models.Story || mongoose.model('Story', storySchema);
export default Story;
