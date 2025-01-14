const express = require('express');
const Purchase = require('../models/Purchase');
const Sales = require('../models/Sales');
const Staff = require('../models/Staff');
const Stock = require('../models/Stock');
const router = express.Router();
const authenticateUser = require('../middleware/verifyToken'); // General user auth
const verifyToken = require('../middleware/authenticateUser'); // Admin-only auth

const jwt = require('jsonwebtoken');


const bcrypt = require('bcrypt');
const saltRounds = 10;

// Function to generate JWT token (without role)
const generateJWTToken = (staff) => {
    const token = jwt.sign(
        { staff_id: staff.staff_id, role: staff.role || 'user' }, // Include role if available
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1h' }
    );
    return token;
};



// Register a new staff member
router.post('/register', async (req, res) => {
    try {
        const { staff_id, name, age, gender, contact, address, password } = req.body;

        // Input validation
        if (!staff_id || !name || !age || !gender || !contact || !address || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Validate gender
        if (!['Male', 'Female'].includes(gender)) {
            return res.status(400).json({ message: 'Gender must be "Male" or "Female"' });
        }

        // Check if staff_id already exists
        const existingStaff = await Staff.findOne({ staff_id });
        if (existingStaff) {
            return res.status(400).json({ message: 'Staff ID already exists. Please choose another.' });
        }

        // Save the new staff member
        const hashedPassword = await bcrypt.hash(password, saltRounds); // Hash the password
        const newStaff = new Staff({ staff_id, name, age, gender, contact, address, password: hashedPassword });
        await newStaff.save();

        res.status(201).json({ message: 'Staff registered successfully!' });
    } catch (err) {
        console.error('Error registering staff:', err);
        res.status(500).json({ message: 'Error registering staff' });
    }
});


// Login route
router.post('/login', async (req, res) => {
    try {
        const { staff_id, password } = req.body;
        const staff = await Staff.findOne({ staff_id });
        if (!staff) return res.status(400).json({ message: 'Invalid staff ID or password' });

        const isMatch = await bcrypt.compare(password, staff.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid staff ID or password' });

        const token = generateJWTToken(staff); // Generate token with `staff_id`
        return res.json({ staff_id: staff.staff_id, token });
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).json({ message: 'Error logging in' });
    }
});

// Handle purchase transactions 
router.post('/purchase', verifyToken, async (req, res) => {
    try {
        console.log("Request body:", req.body);
        console.log("Decoded user:", req.user);

        const staffId = req.user.staff_id; // No ObjectId conversion

        const purchaseData = {
            date: req.body.date,
            seller_name: req.body.seller_name,
            product_name: req.body.product_name,
            rate: req.body.rate,
            quantity: req.body.quantity,
            total: req.body.total,
            staff_id: staffId,
        };

        const purchase = new Purchase(purchaseData); // Assuming `Purchase` is your model
        await purchase.save();

        res.json({ message: 'Successfully Purchased', title: 'purchase' });
    } catch (err) {
        console.error("Error processing purchase:", err);
        res.status(500).send('Error processing purchase');
    }
});

//  sales route
router.get('/sales', async (req, res) => {
    try {
        const sales = await Sales.find(); // Fetch sales data from the database
        if (!Array.isArray(sales)) {
            throw new Error('Sales data is not an array');
        }
        res.json(sales);
    } catch (err) {
        console.error('Error fetching sales:', err);
        res.status(500).json({ error: 'Failed to fetch sales' });
    }
});

router.post('/sales', verifyToken, async (req, res) => {
    console.log('Received request body:', req.body);
    console.log('Decoded user:', req.user);

    const { date, customer_name, products } = req.body;
    const { staff_id } = req.user;

    if (!staff_id) return res.status(400).json({ message: 'Staff ID not found in token' });

    if (!date || !customer_name || !Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Filter out products with invalid fields (empty product_name, null rate, quantity, or total)
    const validProducts = products.filter(product => {
        return product.product_name && product.product_name.trim() !== '' &&
            product.rate != null && product.quantity != null && product.total != null;
    });

    if (validProducts.length === 0) {
        return res.status(400).json({ message: 'All product fields are required' });
    }

    let total_amount = 0;

    // Calculate total_amount
    validProducts.forEach(product => {
        total_amount += product.total;
    });

    try {
        const newSale = new Sales({
            date,
            staff_id,
            customer_name,
            products: validProducts,
            total_amount
        });

        const savedSale = await newSale.save();
        const savedSales = [savedSale];

        // Update stock after sale
        for (const product of validProducts) {
            const { product_name, quantity } = product;
            const stock = await Stock.findOne({ product_name });
            if (stock && stock.quantity >= quantity) {
                stock.quantity -= quantity;
                await stock.save();
            } else if (!stock) {
                return res.status(404).json({ message: `Product ${product_name} not found in stock` });
            } else {
                return res.status(400).json({ message: `Insufficient stock for ${product_name}` });
            }
        }

        return res.status(200).json(savedSale);
    } catch (err) {
        console.error('Error processing sale:', err);
        res.status(500).json({ message: 'Error processing sale' });
    }
});



// Admin login route
router.post('/admin/login', (req, res) => {
    const { userID, password } = req.body;

    // Hardcoded credentials for the sake of the example (You should not hardcode passwords in production)
    if (userID === 'admin' && password === 'admin') {
        // Generate a token for the admin
        const token = jwt.sign({ staff_id: 'admin', role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// Get all staff (accessible only to admin)
router.get('/staff', verifyToken, async (req, res) => {
    try {
        const staff = await Staff.find();
        res.json(staff);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete staff (accessible only to admin)
router.delete('/staff/:id', verifyToken, async (req, res) => {
    try {
        const staff = await Staff.findByIdAndDelete(req.params.id);
        if (!staff) {
            return res.status(404).json({ message: 'Staff not found' });
        }
        res.json({ message: 'Staff deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



// Get all stocks
router.post('/stock', async (req, res) => {
    const { product_name, quantity, rate } = req.body;

    try {
        // Find the stock for the purchased product
        const stock = await Stock.findOne({ product_name });

        if (stock) {
            // Update the quantity if the product exists
            stock.quantity += quantity;
            await stock.save();
        } else {
            // If the product doesn't exist in stock, create a new entry
            const newStock = new Stock({
                product_name,
                quantity,
                rate
            });
            await newStock.save();
        }

        res.status(200).send('Purchase and stock update successful');
    } catch (err) {
        console.error('Error updating stock:', err);
        res.status(500).send('Error updating stock');
    }
});

router.get('/stock', async (req, res) => {
    try {
        const stock = await Stock.find(); // Find all stock entries
        console.log(stock);  // Log the data to verify it's correct
        res.json(stock);
    } catch (err) {
        console.error('Error fetching stock:', err);
        res.status(500).send('Error fetching stock');
    }
});



module.exports = router;
