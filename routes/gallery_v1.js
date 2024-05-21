const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery');
const { isAuthenticated } = require('../middleware/isAuthenticated');
const User = require('../models/User');
const upload = require('../config/storage_v2');
const cloudinary = require('cloudinary').v2;
const fs = require("fs");



// Configure Cloudinary with your credentials
cloudinary.config({
    cloud_name: process.env.YOUR_CLOUD_NAME,
    api_key: process.env.YOUR_API_KEY,
    api_secret: process.env.YOUR_API_SECRET
});



// Function to handle Cloudinary uploads
async function uploadToCloudinary(file) {
    return await cloudinary.uploader.upload(file.path, {
        folder: 'gallery_images', // Optional: Specify folder in Cloudinary
        resource_type: 'auto',
    });
}



function asyncGalleryRoute(io) {

    router.post("/create", isAuthenticated, upload.array("images"), async (req, res) => {
        try {
            // Check if files were uploaded
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ status: 'error', message: 'No files uploaded' });
            }

            const imagePromises = req.files.map(async (file) => {
                // Upload each file to Cloudinary
                const cloudinaryRes = await uploadToCloudinary(file);
                return cloudinaryRes.secure_url; // Return Cloudinary URL
            });

            // Wait for all image uploads to complete
            const imageUrls = await Promise.all(imagePromises);

            // Create a new gallery instance for each image URL
            const galleries = await Promise.all(imageUrls.map(async (imageUrl) => {
                const gallery = new Gallery({
                    by: req.user._id,
                    description: req.body.description,
                    image: imageUrl,
                });
                // Save the gallery to the database
                return await gallery.save();
            }));

            const user = req.user || null;

            // Emit event for new galleries
            for (const gallery of galleries) {
                const instance = await Gallery.findById(gallery._id).populate({
                    path: 'by',
                    select: 'full_name is_admin'
                });
                // Emit the event
                io.emit('new-gallery', instance, user);
            }

            res.status(201).json({
                status: 'success',
                message: 'Galleries created successfully',
                galleries,
            });
        } catch (error) {
            console.error('Error creating galleries:', error);
            res.status(500).json({ status: 'error', message: 'Server error' });
        }
    });


    // Delete an Image
    router.delete('/delete/:id', isAuthenticated, async (req, res) => {
        try {
            const { id } = req.params;
            console.log(`gallery_id: ${id}`);
            const gallery = await Gallery.findByIdAndDelete(id);

            if (!gallery) {
                return res.status(404).json({status: 'error', message: 'Media not found'});
            }

            // Fetch user details and populate profile
            const user = await User.findById(gallery.by._id).populate('profile');

            io.emit('delete-gallery', id, user);
            res.status(200).json({status:"success", message: 'Media deleted successfully'});
        } catch (error) {
            console.error('Error deleting Media:', error);
            res.status(500).json({status: "error", message: 'Server Error'});
        }
    });

    return router;
}

module.exports = asyncGalleryRoute;
