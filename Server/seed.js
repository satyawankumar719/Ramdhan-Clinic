const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config({ path: './.env' });

const seedDoctors = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Delete existing doctors and admins (optional)
    // await User.deleteMany({ $or: [{ role: 'doctor' }, { role: 'admin' }] });
    // console.log('🧹 Cleared existing doctors and admins');

    const users = [
      {
        name: 'Dr. Ramdhan Parjapat',
        email: 'ramdhan@shivshakti.com',
        password: await bcrypt.hash('password123', 10),
        role:  'doctor',
        specialization: 'General Medicine'
      },
      {
        name: 'Dr. Parveen Parjapat',
        email: 'parveen@shivshakti.com',
        password: await bcrypt.hash('password123', 10),
        role: 'doctor',
        specialization: 'Patient Care Specialist'
      }
    ];

    await User.insertMany(users);
    console.log('✅ Users seeded successfully!');
    console.log('👨‍💼 Dr. Ramdhan Parjapat (Admin)');
    console.log('�‍⚕️ Dr. Parveen Parjapat (Doctor)');
    console.log('🔑 Default password for both: password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDoctors();
