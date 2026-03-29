// const express = require('express');
// const router = express.Router();
// const pool = require('../db');

// router.get('/categories/all', async (req, res) => {
//   try {
//     const categories = await pool.query(
//       'SELECT DISTINCT category FROM products ORDER BY category'
//     );
//     res.status(200).json({ categories: categories.rows.map(r => r.category) });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// router.get('/', async (req, res) => {
//   try {
//     const { search, category } = req.query;

//     const synonyms = {
//       'phone': ['smartphone', 'mobile', 'iphone', 'samsung', 'oneplus'],
//       'mobile': ['smartphone', 'phone', 'iphone', 'samsung'],
//       'smartphone': ['phone', 'mobile', 'iphone'],
//       'shoes': ['footwear', 'running', 'sneakers', 'nike'],
//       'footwear': ['shoes', 'running', 'sneakers', 'nike'],
//       'sneakers': ['shoes', 'footwear', 'nike', 'running'],
//       'headphone': ['audio', 'headphones', 'earphone', 'boat', 'sony'],
//       'headphones': ['audio', 'headphone', 'earphone', 'boat', 'sony'],
//       'audio': ['headphone', 'headphones', 'earphone', 'boat', 'sony'],
//       'tv': ['television', 'smart tv', 'led', 'oled'],
//       'television': ['tv', 'smart tv', 'led', 'oled'],
//       'laptop': ['computer', 'macbook', 'notebook', 'dell', 'hp'],
//       'computer': ['laptop', 'macbook', 'notebook'],
//       'fridge': ['refrigerator', 'whirlpool'],
//       'refrigerator': ['fridge', 'whirlpool'],
//       'ac': ['air conditioner', 'voltas', 'inverter'],
//       'washing machine': ['washer', 'lg', 'laundry'],
//       'camera': ['dslr', 'mirrorless', 'canon', 'gopro'],
//       'shirt': ['fashion', 'clothing', 'formal'],
//       'dress': ['fashion', 'clothing', 'casual'],
//       'jeans': ['fashion', 'clothing', 'denim', 'levis'],
//       'book': ['books', 'novel', 'reading', 'paperback'],
//       'books': ['book', 'novel', 'reading', 'paperback'],
//       'food': ['tea', 'chocolate', 'snacks', 'organic'],
//       'furniture': ['chair', 'table', 'mattress', 'sofa'],
//       'tablet': ['ipad', 'samsung tab', 'electronics'],
//     };

//     let conditions = [];
//     let params = [];
//     let paramCount = 1;

//     if (search) {
//       const searchLower = search.toLowerCase();
//       const relatedTerms = synonyms[searchLower] || [];
//       const allTerms = [search, ...relatedTerms];

//       let termConditions = [];
//       for (const term of allTerms) {
//         termConditions.push(`
//           name ILIKE $${paramCount} OR
//           brand ILIKE $${paramCount + 1} OR
//           category ILIKE $${paramCount + 2} OR
//           description ILIKE $${paramCount + 3}
//         `);
//         params.push(`%${term}%`, `%${term}%`, `%${term}%`, `%${term}%`);
//         paramCount += 4;
//       }

//       conditions.push(`(${termConditions.join(' OR ')})`);
//     }

//     if (category) {
//       conditions.push(`category = $${paramCount}`);
//       params.push(category);
//       paramCount++;
//     }

//     let query = 'SELECT * FROM products';
//     if (conditions.length > 0) {
//       query += ' WHERE ' + conditions.join(' AND ');
//     }
//     query += ' ORDER BY created_at DESC';

//     const products = await pool.query(query, params);
//     res.status(200).json({ products: products.rows });

//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// router.get('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const product = await pool.query(
//       'SELECT * FROM products WHERE id = $1', [id]
//     );
//     if (product.rows.length === 0) {
//       return res.status(404).json({ message: 'Product not found' });
//     }
//     res.status(200).json({ product: product.rows[0] });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// module.exports = router;



const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/categories/all', async (req, res) => {
  try {
    const categories = await pool.query(
      'SELECT DISTINCT category FROM products ORDER BY category'
    );
    res.status(200).json({ categories: categories.rows.map(r => r.category) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;

    // Synonym map — maps user typed word to category name or keywords
    const synonyms = {
      'phone': 'Smartphones',
      'mobile': 'Smartphones',
      'mobiles': 'Smartphones',
      'smartphone': 'Smartphones',
      'smartphones': 'Smartphones',
      'laptop': 'Laptops',
      'laptops': 'Laptops',
      'computer': 'Laptops',
      'notebook': 'Laptops',
      'headphone': 'Headphones',
      'headphones': 'Headphones',
      'earphone': 'Headphones',
      'audio': 'Headphones',
      'wireless': 'Headphones',
      'bluetooth': 'Headphones',
      'tv': 'Televisions',
      'television': 'Televisions',
      'televisions': 'Televisions',
      'smart tv': 'Televisions',
      'led tv': 'Televisions',
      'appliance': 'Appliances',
      'appliances': 'Appliances',
      'washing machine': 'Appliances',
      'fridge': 'Appliances',
      'refrigerator': 'Appliances',
      'ac': 'Appliances',
      'air conditioner': 'Appliances',
      'camera': 'Cameras',
      'cameras': 'Cameras',
      'dslr': 'Cameras',
      'mirrorless': 'Cameras',
      'shirt': 'Fashion',
      'dress': 'Fashion',
      'jeans': 'Fashion',
      'clothing': 'Fashion',
      'clothes': 'Fashion',
      'wear': 'Fashion',
      'shoes': 'Footwear',
      'footwear': 'Footwear',
      'sneakers': 'Footwear',
      'running shoes': 'Footwear',
      'nike': 'Footwear',
      'electronics': 'Electronics',
      'tablet': 'Electronics',
      'ipad': 'Electronics',
      'gopro': 'Electronics',
      'home': 'Home',
      'kitchen': 'Home',
      'vacuum': 'Home',
      'purifier': 'Home',
      'furniture': 'Furniture',
      'chair': 'Furniture',
      'table': 'Furniture',
      'mattress': 'Furniture',
      'sofa': 'Furniture',
      'food': 'Food',
      'tea': 'Food',
      'chocolate': 'Food',
      'snacks': 'Food',
      'drink': 'Food',
      'grocery': 'Food',
      'book': 'Books',
      'books': 'Books',
      'novel': 'Books',
      'reading': 'Books',
      'paperback': 'Books',
    };

    let conditions = [];
    let params = [];
    let paramCount = 1;

    if (search) {
      const searchLower = search.toLowerCase().trim();

      // Check if search term maps to a category
      const mappedCategory = synonyms[searchLower];

      if (mappedCategory) {
        // If synonym found — search by category + name/brand
        conditions.push(`(
          category ILIKE $${paramCount} OR
          name ILIKE $${paramCount + 1} OR
          brand ILIKE $${paramCount + 2}
        )`);
        params.push(
          `%${mappedCategory}%`,
          `%${search}%`,
          `%${search}%`
        );
        paramCount += 3;
      } else {
        // No synonym — search across all fields
        conditions.push(`(
          name ILIKE $${paramCount} OR
          brand ILIKE $${paramCount + 1} OR
          category ILIKE $${paramCount + 2} OR
          description ILIKE $${paramCount + 3}
        )`);
        params.push(
          `%${search}%`,
          `%${search}%`,
          `%${search}%`,
          `%${search}%`
        );
        paramCount += 4;
      }
    }

    if (category) {
      conditions.push(`category = $${paramCount}`);
      params.push(category);
      paramCount++;
    }

    let query = 'SELECT * FROM products';
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ORDER BY created_at DESC';

    const products = await pool.query(query, params);
    res.status(200).json({ products: products.rows });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await pool.query(
      'SELECT * FROM products WHERE id = $1', [id]
    );
    if (product.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ product: product.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;