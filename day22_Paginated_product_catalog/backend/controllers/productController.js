const Product = require('../models/Product');

const getProducts = async (req, res) => {
  try {
    // 1. Pagination parameters
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // 2. Extract filter parameters
    const { category, minPrice, maxPrice, search } = req.query;

    // 3. Build dynamic query object
    const query = {};
    
    if (category && category !== 'All') {
      query.category = category;
    }
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const [products, totalCount] = await Promise.all([
      Product.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Product.countDocuments(query)
    ]);

    // 5. Send paginated response
    res.status(200).json({
      success: true,
      count: products.length,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      hasMore: page * limit < totalCount,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error: Unable to fetch products',
      error: error.message
    });
  }
};

module.exports = { getProducts };