const express = require('express');
const router = express.Router();// Import models
const Tribute = require('../models/Tribute');
const User = require('../models/User');
const {isAuthenticated} = require('../middleware/isAuthenticated');
const {StatusCodes} = require('http-status-codes')
// const formatDate = require('../utils/humanize');


// Define routes
router.get('/tributes', async (req, res) => {
    try {
        const tributes = await Tribute.find().populate({
            path: 'by', // Populate the 'by' field (user reference)
            select: 'full_name', // Select specific fields from the User schema
            populate: {
                path: 'profile', // Populate the 'profile' field
                select: 'image', // Select the 'image' field from the Profile schema
            },
        }).sort({ on: -1 });
        res.render('tribute', { tributes });
    } catch (error) {
        console.error('Error fetching tributes:', error);
        res.status(500).send('Server Error');
    }
});


function asyncTributeRoute(io) {
    router.post('/create', isAuthenticated, async (req, res) => {
        try {
            console.log(req.body);
            const { tribute_text, category } = req.body;

            const tribute = new Tribute({
                tribute_text,
                category,
                by: req.user._id,
                on: new Date(),
            });

            await tribute.save();

            // Retrieve the logged-in user's ID
            const userId = req.user ? req.user._id : null;

            const user = await User.findById(userId).populate('profile');

            // Emit the new tribute to all connected clients

            io.emit('new-tribute', tribute, user);

            res.status(StatusCodes.OK).json({
                status: "success",
                message: "Your tribute was added successfully"
            });
        } catch (error) {
            console.error('Error creating tribute:', error);
            res.status(StatusCodes.BAD_REQUEST).json({
                status: "error",
                message: "An error occurred while uploading you tribute."
            });
        }
    });


    // Update a tribute
    router.put('/update/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const { tribute_text, category } = req.body;

            const tribute = await Tribute.findByIdAndUpdate(id, {
                tribute_text,
                category,
            }, { new: true });

            if (!tribute) {
                return res.status(404).send('Tribute not found');
            }

            // Emit the updated tribute to all connected clients
            io.emit('update-tribute', tribute);

            res.redirect('/');
        } catch (error) {
            console.error('Error updating tribute:', error);
            res.status(500).send('Server Error');
        }
    });


    // Delete a tribute
    router.delete('/delete/:id', async (req, res) => {
        try {
            const { id } = req.params;

            const tribute = await Tribute.findByIdAndDelete(id);

            if (!tribute) {
                return res.status(404).send('Tribute not found');
            }

            // Emit the deleted tribute to all connected clients
            io.emit('delete-tribute', id);

            res.status(200).send('Tribute deleted successfully');
        } catch (error) {
            console.error('Error deleting tribute:', error);
            res.status(500).send('Server Error');
        }
    });


    return router;
}

module.exports = asyncTributeRoute;