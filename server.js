const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors middleware



const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://127.0.0.1:5500' // Allow only this origin
}));


// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/reviewdb')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Review Schema
const reviewSchema = new mongoose.Schema({
  username: String,
  reviewText: String,
  createdAt: { type: Date, default: Date.now }
});

const Review = mongoose.model('Review', reviewSchema);

// Routes
app.get('/reviews', async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/reviews', async (req, res) => {
  const { username, reviewText } = req.body;
  try {
    const newReview = new Review({ username, reviewText });
    await newReview.save();
    res.status(201).json(newReview);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.put('/reviews/:id', async (req, res) => {
  const { reviewText } = req.body;
  try {
    const updatedReview = await Review.findByIdAndUpdate(req.params.id, { reviewText }, { new: true });
    if (!updatedReview) return res.status(404).send('Review not found');
    res.json(updatedReview);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
