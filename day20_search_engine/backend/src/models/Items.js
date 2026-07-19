import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    category: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

itemSchema.index(
  { title: 'text', description: 'text' },
  { weights: { title: 3, description: 1 }, name: 'TextSearchIndex' }
);

const Item = mongoose.model('Item', itemSchema);
export default Item;