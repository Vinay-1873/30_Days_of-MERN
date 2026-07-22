const NodeCache = require('node-cache');
const weatherCache = new NodeCache({ stdTTL: 600 }); 

const checkCache = (req, res, next) => {
    const { city } = req.params; 
    
    const cacheKey = city.toLowerCase();
    const cachedData = weatherCache.get(cacheKey);

    if (cachedData) {
        console.log(`✅ Cache HIT for: ${city}`);
        return res.status(200).json(cachedData);
    }

    console.log(`Cache MISS for: ${city}. Fetching from API...`);
    req.weatherCache = weatherCache;
    next();
};

module.exports = checkCache;