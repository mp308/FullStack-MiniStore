const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const multer = require('multer');
const path = require('path');

// Configure Multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Save the uploaded images in the 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Rename the file with a timestamp
    }
});

const upload = multer({ storage: storage }).single('image'); // For handling single image upload

// Insert one product with image upload
const createProduct = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error uploading file', error: err.message });
        }
        
        const { product_id, name, description, price, category } = req.body;
        const image_url = req.file ? req.file.path : ''; // Save the image path if uploaded

        try {
            // Create a new product with image URL
            const prod = await prisma.products.create({
                data: {
                    product_id,
                    name,
                    description,
                    price,
                    category,
                    image_url
                }
            });
    
            // Send response on success
            res.status(200).json({
                status: "ok",
                message: `Product with ID = ${prod.product_id} is created`,
                product: prod
            });
        } catch (err) {
            // Handle errors
            res.status(500).json({
                status: "error",
                message: "Failed to create product",
                error: err.message
            });
        }
    });
};

// Update one product with optional image upload
const updateProduct = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error uploading file', error: err.message });
        }

        const { name, description, price, category } = req.body;
        const { id } = req.params; // Get the product ID from the URL parameter

        // Build the data object for the update
        const data = {};
        if (name) data.name = name;
        if (description) data.description = description;
        if (price) data.price = price;
        if (category) data.category = category;
        if (req.file) data.image_url = req.file.path; // Update the image URL if a new image is uploaded

        // Check if there's any data to update
        if (Object.keys(data).length === 0) {
            return res.status(400).json({ 
                status: 'error',
                message: 'No data provided for update.'
            });
        }

        try {
            const prod = await prisma.products.update({
                data,
                where: { product_id: Number(id) } // Use the ID from the URL
            });
            res.status(200).json({
                status: 'ok',
                message: `Product with ID = ${id} is updated`,
                product: prod
            });
        } catch (err) {
            if (err.code === 'P2002') {
                res.status(400).json({ 
                    status: 'error',
                    message: 'Product name already exists.' 
                });
            } else if (err.code === 'P2025') {
                res.status(404).json({ 
                    status: 'error',
                    message: `Product with ID = ${id} not found.` 
                });
            } else {
                console.error('Update product error: ', err);
                res.status(500).json({ 
                    status: 'error',
                    message: 'An unexpected error occurred.' 
                });
            }
        }
    });
};

// Delete product by product_id
const deleteProduct = async (req, res) => {
    const id = req.params.id;
  
    try {
      // ตรวจสอบว่าผลิตภัณฑ์มีอยู่หรือไม่
      const existingProduct = await prisma.products.findUnique({
        where: {
          product_id: Number(id),  // ตรวจสอบว่า product_id เป็นตัวเลข
        },
      });
  
      // ถ้าไม่พบผลิตภัณฑ์
      if (!existingProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      // ลบผลิตภัณฑ์
      await prisma.products.delete({
        where: {
          product_id: Number(id),
        },
      });
  
      // ส่งข้อความเมื่อทำการลบสำเร็จ
      res.status(200).json({
        status: "ok",
        message: `Product with ID = ${id} is deleted`  // แสดง ID ที่ถูกลบ
      });
    } catch (err) {
      console.error('Delete product error: ', err);  // แสดงข้อผิดพลาดใน console
      res.status(500).json({ error: err.message });  // ส่งข้อความข้อผิดพลาดกลับไปที่ client
    }
};

// get all products
const getProducts = async (req, res) => {
    const prods = await prisma.products.findMany();
    res.json(prods);
};

// get only one product by product_id
const getProduct = async (req, res) => {
    const id = req.params.id;
    try {
        const prod = await prisma.products.findUnique({
            where: { product_id: Number(id) },
        });
        if (!prod) {
            res.status(404).json({ 'message': 'Product not found!' });
        } else {
            res.status(200).json(prod);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

// search any product by name or description
const getProductsByTerm = async (req, res) => {
    const searchString = req.params.term;
    try {
        const prods = await prisma.products.findMany({
            where: {
                OR: [
                    {
                        name: {
                            contains: searchString
                        }
                    },
                    {
                        description: {
                            contains: searchString
                        }
                    }
                ]
            },
        });
        if (!prods || prods.length === 0) {
            res.status(404).json({ 'message': 'Product not found!' });
        } else {
            res.status(200).json(prods);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = {
    createProduct,
    updateProduct,
    deleteProduct,
    getProducts,
    getProduct,
    getProductsByTerm
};
