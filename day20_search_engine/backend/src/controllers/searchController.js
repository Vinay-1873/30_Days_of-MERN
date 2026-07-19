import Item from '../models/Items.js';
import asyncHandler from '../middleware/asyncHandler.js';

export const searchItems = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q) {
    const items = await Item.find({}).limit(20);
    return res.status(200).json({ success: true, count: items.length, data: items });
  }

  const items = await Item.find(
    { $text: { $search: q } },
    { score: { $meta: 'textScore' } }
  ).sort({ score: { $meta: 'textScore' } });

  res.status(200).json({
    success: true,
    count: items.length,
    data: items,
  });
});

export const seedItems = asyncHandler(async (req, res) => {
  await Item.deleteMany({});
  
  const dummyData = [
    { title: 'MERN Stack Handbook', description: 'A comprehensive roadmap for mastering full stack development building practical applications.', category: 'Education' },
    { title: 'Full-Text Search Engine Guide', description: 'Learn how to configure text indexes and build fuzzy keyword search algorithms in MongoDB.', category: 'Tech' },
    { title: 'React Performance Tips', description: 'Deep dive into optimization, dynamic states, and debounced API calls for standard UIs.', category: 'Tech' }
  ];
  
  await Item.insertMany(dummyData);
  res.status(201).json({ success: true, message: 'Database seeded successfully!' });
});