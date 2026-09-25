import mongoose from 'mongoose';
import { panelSchema } from './Panel.js';

const characterSchema = new mongoose.Schema(
  {
    characterId: { type: String, default: '' },
    name: { type: String, required: true },
    role: { type: String, default: 'Supporting' },
    age: { type: String, default: '' },
    gender: { type: String, default: '' },
    faceDescription: { type: String, default: '' },
    hair: { type: String, default: '' },
    skinTone: { type: String, default: '' },
    bodyType: { type: String, default: '' },
    clothing: { type: String, default: '' },
    accessories: { type: String, default: 'none' },
    personality: { type: String, default: '' },
    visualKeywords: { type: [String], default: [] },
  },
  { _id: false }
);

const comicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      default: 'Untitled Comic Story',
    },
    originalStory: {
      type: String,
      required: true,
      trim: true,
    },
    summary: {
      type: String,
      default: '',
    },
    setting: {
      type: String,
      default: '',
    },
    style: {
      type: String,
      default: 'Superhero',
    },
    panelCount: {
      type: Number,
      default: 6,
    },
    characters: {
      type: [characterSchema],
      default: [],
    },
    panels: {
      type: [panelSchema],
      default: [],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

// Indexes for fast querying
comicSchema.index({ createdAt: -1 });

export const Comic = mongoose.models.Comic || mongoose.model('Comic', comicSchema);
export default Comic;
