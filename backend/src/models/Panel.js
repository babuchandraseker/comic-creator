import mongoose from 'mongoose';

export const panelSchema = new mongoose.Schema(
  {
    panelNumber: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
      default: '',
    },
    sceneDescription: {
      type: String,
      default: '',
    },
    dialogue: {
      type: String,
      default: '',
    },
    dialogueType: {
      type: String,
      enum: ['speech', 'thought', 'shout', 'whisper'],
      default: 'speech',
    },
    caption: {
      type: String,
      default: '',
    },
    imagePrompt: {
      type: String,
      default: '',
    },
    characters: {
      type: [String],
      default: [],
    },
    action: {
      type: String,
      default: '',
    },
    emotion: {
      type: String,
      default: 'neutral',
    },
    cloudinaryPublicId: {
      type: String,
      default: null,
    },
    isCloudinaryHosted: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  }
);

export const Panel = mongoose.models.Panel || mongoose.model('Panel', panelSchema);
export default Panel;
