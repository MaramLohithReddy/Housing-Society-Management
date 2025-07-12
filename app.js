const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Error:', err));

// Routes
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const guestRoutes = require('./routes/guestRoutes'); // add this when you build
const securityRoutes = require('./routes/securityRoutes'); // add this too
const userRoutes= require('./routes/userRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const eventRoutes = require('./routes/eventRoutes');
const forgotPasswordRoutes = require('./routes/forgotPassword');




app.use('/api', authRoutes);
app.use('/api', paymentRoutes);
app.use('/api', maintenanceRoutes);
app.use('/api', guestRoutes);        
app.use('/api', securityRoutes);     
app.use('/api', userRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api', complaintRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/forgot', forgotPasswordRoutes);

// Start server (MUST be last)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
