const express = require('express');
const router = express.Router();// Import models
const Tribute = require('../models/Tribute');
const {isAuthenticated} = require('../middleware/isAuthenticated')


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


// Create a new tribute
function createTributeRoute(io) {
    router.post('/create', isAuthenticated, async (req, res) => {
        try {
            const { tribute_text, category } = req.body;
            console.log(tribute_text, category);

            const tribute = new Tribute({
                tribute_text,
                category,
                by: req.user._id,  // Correct the `by` assignment
                on: new Date(),
            });

            await tribute.save();

            // Emit the new tribute to all connected clients
            io.emit('new-tribute', tribute);

            res.redirect('/');
        } catch (error) {
            console.error('Error creating tribute:', error);
            res.status(500).send('Server Error');
        }
    });

    return router;
}

module.exports = {router, createTributeRoute};



function asyncTributeRoute(io) {
    router.post('/create', isAuthenticated, async (req, res) => {
        try {
            const { tribute_text, category } = req.body;

            const tribute = new Tribute({
                tribute_text,
                category,
                by: req.user._id,
                on: new Date(),
            });

            await tribute.save();

            // Emit the new tribute to all connected clients
            io.emit('new-tribute', tribute);

            res.redirect('/');
        } catch (error) {
            console.error('Error creating tribute:', error);
            res.status(500).send('Server Error');
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