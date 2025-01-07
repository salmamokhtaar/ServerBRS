// const express = require('express');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const cors = require('cors');
// const multer = require('multer');
// const User = require('./models/User');
// const Business = require('./models/Business');

// dotenv.config(); // Ensure this is at the top

// const app = express();
// const port = process.env.PORT || 3000;
// app.use(cors());
// app.use(express.json());
// app.use('/uploads', express.static('uploads'));

// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.log(err));

// // Multer setup for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + '-' + file.originalname);
//   },
// });

// const upload = multer({ storage });

// // Signup route
// app.post('/api/signup', async (req, res) => {
//   const { username, email, password } = req.body;

//   try {
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ error: 'User already exists' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = new User({
//       username,
//       email,
//       password: hashedPassword,
//     });

//     await user.save();

//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

//     res.status(201).json({ message: 'Signup successful!', token });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Login route
// app.post('/api/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ error: 'Invalid credentials' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ error: 'Invalid credentials' });
//     }

//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

//     res.status(200).json({ message: 'Login successful!', token });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Business registration route
// app.post('/api/register-business', upload.array('documents', 5), async (req, res) => {
//   const {
//     businessName,
//     ownerName,
//     contactEmail,
//     contactPhone,
//     contactAddress,
//     businessAddress,
//     businessType,
//     registrationNumber,
//     licenses,
//   } = req.body;

//   console.log('Files:', req.files); // Log the files to see if they are being received

//   const documents = req.files.map(file => file.path);

//   try {
//     const existingBusinessName = await Business.findOne({ businessName });
//     if (existingBusinessName) {
//       return res.status(400).json({ error: 'Business name already exists' });
//     }

//     const existingLicense = await Business.findOne({ licenses });
//     if (existingLicense) {
//       return res.status(400).json({ error: 'License is already taken' });
//     }

//     const existingRegistrationNumber = await Business.findOne({ registrationNumber });
//     if (existingRegistrationNumber) {
//       return res.status(400).json({ error: 'Registration number is already taken' });
//     }

//     const business = new Business({
//       businessName,
//       ownerName,
//       contactEmail,
//       contactPhone,
//       contactAddress,
//       businessAddress,
//       businessType,
//       registrationNumber,
//       licenses,
//       documents,
//     });

//     await business.save();

//     res.status(201).json({ message: 'Business registered successfully!' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Get approved businesses route
// app.get('/api/businesses/approved', async (req, res) => {
//   try {
//     const businesses = await Business.find({ status: 'approved' });
//     res.status(200).json(businesses);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Get rejected businesses route
// app.get('/api/businesses/rejected', async (req, res) => {
//   try {
//     const businesses = await Business.find({ status: 'rejected' });
//     res.status(200).json(businesses);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Get all businesses route
// app.get('/api/businesses', async (req, res) => {
//   try {
//     const businesses = await Business.find();
//     res.status(200).json(businesses);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Get total number of businesses route
// app.get('/api/businesses/total', async (req, res) => {
//   try {
//     const totalBusinesses = await Business.countDocuments();
//     res.status(200).json({ total: totalBusinesses });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Get business by ID route
// app.get('/api/businesses/:id', async (req, res) => {
//   const { id } = req.params;

//   try {
//     const business = await Business.findById(id);
//     if (!business) {
//       return res.status(404).json({ error: 'Business not found' });
//     }
//     res.status(200).json(business);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Get business by registration number route
// app.get('/api/businesses/registration/:number', async (req, res) => {
//   const { number } = req.params;

//   try {
//     const business = await Business.findOne({ registrationNumber: number });
//     if (!business) {
//       return res.status(404).json({ error: 'Business not found' });
//     }
//     res.status(200).json(business);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Delete business by ID route
// app.delete('/api/businesses/:id', async (req, res) => {
//   const { id } = req.params;

//   try {
//     const business = await Business.findByIdAndDelete(id);
//     if (!business) {
//       return res.status(404).json({ error: 'Business not found' });
//     }
//     res.status(200).json({ message: 'Business deleted successfully!' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Update business status route
// app.patch('/api/update-business-status/:id', async (req, res) => {
//   const { id } = req.params;
//   const { status } = req.body;

//   if (!['waiting', 'rejected', 'approved'].includes(status)) {
//     return res.status(400).json({ error: 'Invalid status' });
//   }

//   try {
//     const business = await Business.findByIdAndUpdate(id, { status }, { new: true });

//     if (!business) {
//       return res.status(404).json({ error: 'Business not found' });
//     }

//     res.status(200).json({ message: 'Business status updated successfully!', business });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Update business route
// app.put('/api/businesses/:id', upload.array('documents', 5), async (req, res) => {
//   const { id } = req.params;
//   const {
//     businessName,
//     ownerName,
//     contactEmail,
//     contactPhone,
//     contactAddress,
//     businessAddress,
//     businessType,
//     registrationNumber,
//     licenses,
//     status,
//   } = req.body;

//   const documents = req.files.map(file => file.path);

//   try {
//     const business = await Business.findById(id);
//     if (!business) {
//       return res.status(404).json({ error: 'Business not found' });
//     }

//     business.businessName = businessName || business.businessName;
//     business.ownerName = ownerName || business.ownerName;
//     business.contactEmail = contactEmail || business.contactEmail;
//     business.contactPhone = contactPhone || business.contactPhone;
//     business.contactAddress = contactAddress || business.contactAddress;
//     business.businessAddress = businessAddress || business.businessAddress;
//     business.businessType = businessType || business.businessType;
//     business.registrationNumber = registrationNumber || business.registrationNumber;
//     business.licenses = licenses || business.licenses;
//     business.status = status || business.status;
//     business.documents = documents.length > 0 ? documents : business.documents;

//     await business.save();

//     res.status(200).json({ message: 'Business updated successfully!', business });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });


// const express = require('express');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const cors = require('cors');
// const multer = require('multer');
// const User = require('./models/User');
// const Business = require('./models/Business');

// dotenv.config(); // Ensure this is at the top

// const app = express();
// const port = process.env.PORT || 3000;
// app.use(cors());
// app.use(express.json());
// app.use('/uploads', express.static('uploads'));

// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.log(err));

// // Multer setup for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + '-' + file.originalname);
//   },
// });

// const upload = multer({ storage });

// // Signup route
// app.post('/api/signup', async (req, res) => {
//   const { username, email, password } = req.body;

//   try {
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ error: 'User already exists' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = new User({
//       username,
//       email,
//       password: hashedPassword,
//     });

//     await user.save();

//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

//     res.status(201).json({ message: 'Signup successful!', token });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Login route
// app.post('/api/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ error: 'Invalid credentials' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ error: 'Invalid credentials' });
//     }

//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

//     res.status(200).json({ message: 'Login successful!', token });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Business registration route
// app.post('/api/register-business', upload.array('documents', 5), async (req, res) => {
//   const {
//     businessName,
//     ownerName,
//     contactEmail,
//     contactPhone,
//     contactAddress,
//     businessAddress,
//     businessType,
//     registrationNumber,
//     licenses,
//   } = req.body;

//   console.log('Files:', req.files); // Log the files to see if they are being received

//   const documents = req.files.map(file => file.path);

//   try {
//     const existingBusinessName = await Business.findOne({ businessName });
//     if (existingBusinessName) {
//       return res.status(400).json({ error: 'Business name already exists' });
//     }

//     const existingLicense = await Business.findOne({ licenses });
//     if (existingLicense) {
//       return res.status(400).json({ error: 'License is already taken' });
//     }

//     const existingRegistrationNumber = await Business.findOne({ registrationNumber });
//     if (existingRegistrationNumber) {
//       return res.status(400).json({ error: 'Registration number is already taken' });
//     }

//     const business = new Business({
//       businessName,
//       ownerName,
//       contactEmail,
//       contactPhone,
//       contactAddress,
//       businessAddress,
//       businessType,
//       registrationNumber,
//       licenses,
//       documents,
//     });

//     await business.save();

//     res.status(201).json({ message: 'Business registered successfully!' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Get approved businesses route
// app.get('/api/businesses/approved', async (req, res) => {
//   try {
//     const businesses = await Business.find({ status: 'approved' });
//     res.status(200).json(businesses);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Get rejected businesses route
// app.get('/api/businesses/rejected', async (req, res) => {
//   try {
//     const businesses = await Business.find({ status: 'rejected' });
//     res.status(200).json(businesses);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Get all businesses route
// app.get('/api/businesses', async (req, res) => {
//   try {
//     const businesses = await Business.find();
//     res.status(200).json(businesses);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Get total number of businesses route
// app.get('/api/businesses/total', async (req, res) => {
//   try {
//     const totalBusinesses = await Business.countDocuments();
//     res.status(200).json({ total: totalBusinesses });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Get business by ID route
// app.get('/api/businesses/:id', async (req, res) => {
//   const { id } = req.params;

//   try {
//     const business = await Business.findById(id);
//     if (!business) {
//       return res.status(404).json({ error: 'Business not found' });
//     }
//     res.status(200).json(business);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Get business by registration number route
// app.get('/api/businesses/registration/:number', async (req, res) => {
//   const { number } = req.params;

//   try {
//     const business = await Business.findOne({ registrationNumber: number });
//     if (!business) {
//       return res.status(404).json({ error: 'Business not found' });
//     }
//     res.status(200).json(business);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Delete business by ID route
// app.delete('/api/businesses/:id', async (req, res) => {
//   const { id } = req.params;

//   try {
//     const business = await Business.findByIdAndDelete(id);
//     if (!business) {
//       return res.status(404).json({ error: 'Business not found' });
//     }
//     res.status(200).json({ message: 'Business deleted successfully!' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Update business status route
// app.patch('/api/update-business-status/:id', async (req, res) => {
//   const { id } = req.params;
//   const { status } = req.body;

//   if (!['waiting', 'rejected', 'approved'].includes(status)) {
//     return res.status(400).json({ error: 'Invalid status' });
//   }

//   try {
//     const business = await Business.findByIdAndUpdate(id, { status }, { new: true });

//     if (!business) {
//       return res.status(404).json({ error: 'Business not found' });
//     }

//     res.status(200).json({ message: 'Business status updated successfully!', business });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Update business route
// app.put('/api/businesses/:id', upload.array('documents', 5), async (req, res) => {
//   const { id } = req.params;
//   const {
//     businessName,
//     ownerName,
//     contactEmail,
//     contactPhone,
//     contactAddress,
//     businessAddress,
//     businessType,
//     registrationNumber,
//     licenses,
//     status,
//   } = req.body;

//   const documents = req.files.map(file => file.path);

//   try {
//     const business = await Business.findById(id);
//     if (!business) {
//       return res.status(404).json({ error: 'Business not found' });
//     }

//     business.businessName = businessName || business.businessName;
//     business.ownerName = ownerName || business.ownerName;
//     business.contactEmail = contactEmail || business.contactEmail;
//     business.contactPhone = contactPhone || business.contactPhone;
//     business.contactAddress = contactAddress || business.contactAddress;
//     business.businessAddress = businessAddress || business.businessAddress;
//     business.businessType = businessType || business.businessType;
//     business.registrationNumber = registrationNumber || business.registrationNumber;
//     business.licenses = licenses || business.licenses;
//     business.status = status || business.status;
//     business.documents = documents.length > 0 ? documents : business.documents;

//     await business.save();

//     res.status(200).json({ message: 'Business updated successfully!', business });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });





const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const User = require('./models/User');
const Business = require('./models/Business');

dotenv.config(); // Ensure this is at the top

const app = express();
const port = process.env.PORT || 3000;
app.use(cors()); // Allow all origins
app.use(cors({
  origin: 'https://brs-liart.vercel.app' // No trailing slash
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Signup route
app.post('/api/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: 'Signup successful!', token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful!', token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Business registration route
app.post('/api/register-business', upload.array('documents', 5), async (req, res) => {
  const {
    businessName,
    ownerName,
    contactEmail,
    contactPhone,
    contactAddress,
    businessAddress,
    businessType,
    registrationNumber,
    licenses,
  } = req.body;

  console.log('Files:', req.files); // Log the files to see if they are being received

  const documents = req.files ? req.files.map(file => file.path) : [];

  try {
    const existingBusinessName = await Business.findOne({ businessName });
    if (existingBusinessName) {
      return res.status(400).json({ error: 'Business name already exists' });
    }

    const existingLicense = await Business.findOne({ licenses });
    if (existingLicense) {
      return res.status(400).json({ error: 'License is already taken' });
    }

    const existingRegistrationNumber = await Business.findOne({ registrationNumber });
    if (existingRegistrationNumber) {
      return res.status(400).json({ error: 'Registration number is already taken' });
    }

    const business = new Business({
      businessName,
      ownerName,
      contactEmail,
      contactPhone,
      contactAddress,
      businessAddress,
      businessType,
      registrationNumber,
      licenses,
      documents,
    });

    await business.save();

    res.status(201).json({ message: 'Business registered successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get approved businesses route
app.get('/api/businesses/approved', async (req, res) => {
  try {
    const businesses = await Business.find({ status: 'approved' });
    res.status(200).json(businesses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get rejected businesses route
app.get('/api/businesses/rejected', async (req, res) => {
  try {
    const businesses = await Business.find({ status: 'rejected' });
    res.status(200).json(businesses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all businesses route
app.get('/api/businesses', async (req, res) => {
  try {
    const businesses = await Business.find();
    res.status(200).json(businesses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get total number of businesses route
app.get('/api/businesses/total', async (req, res) => {
  try {
    const totalBusinesses = await Business.countDocuments();
    res.status(200).json({ total: totalBusinesses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get business by ID route
app.get('/api/businesses/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const business = await Business.findById(id);
    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }
    res.status(200).json(business);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get business by registration number route
app.get('/api/businesses/registration/:number', async (req, res) => {
  const { number } = req.params;

  try {
    const business = await Business.findOne({ registrationNumber: number });
    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }
    res.status(200).json(business);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete business by ID route
app.delete('/api/businesses/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const business = await Business.findByIdAndDelete(id);
    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }
    res.status(200).json({ message: 'Business deleted successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update business status route
app.patch('/api/update-business-status/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['waiting', 'rejected', 'approved'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const business = await Business.findByIdAndUpdate(id, { status }, { new: true });

    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    res.status(200).json({ message: 'Business status updated successfully!', business });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update business route
app.put('/api/businesses/:id', upload.array('documents', 5), async (req, res) => {
  const { id } = req.params;
  const {
    businessName,
    ownerName,
    contactEmail,
    contactPhone,
    contactAddress,
    businessAddress,
    businessType,
    registrationNumber,
    licenses,
    status,
  } = req.body;

  const documents = req.files ? req.files.map(file => file.path) : [];

  try {
    const business = await Business.findById(id);
    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    business.businessName = businessName || business.businessName;
    business.ownerName = ownerName || business.ownerName;
    business.contactEmail = contactEmail || business.contactEmail;
    business.contactPhone = contactPhone || business.contactPhone;
    business.contactAddress = contactAddress || business.contactAddress;
    business.businessAddress = businessAddress || business.businessAddress;
    business.businessType = businessType || business.businessType;
    business.registrationNumber = registrationNumber || business.registrationNumber;
    business.licenses = licenses || business.licenses;
    business.status = status || business.status;
    business.documents = documents.length > 0 ? documents : business.documents;

    await business.save();

    res.status(200).json({ message: 'Business updated successfully!', business });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Get all users route
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user by ID route
app.get('/api/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Update user route
app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.username = username || user.username;
    user.email = email || user.email;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.status(200).json({ message: 'User updated successfully!', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add this route to your existing server.js file

// Filter businesses by type, date, or region
app.get('/api/businesses/report', async (req, res) => {
  const { type, startDate, endDate, region } = req.query;

  let filter = {};

  if (type) {
    filter.businessType = type;
  }

  if (startDate && endDate) {
    filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }

  if (region) {
    filter.contactAddress = { $regex: region, $options: 'i' };
  }

  try {
    const businesses = await Business.find(filter);
    res.status(200).json(businesses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add this route to your existing server.js file

// Middleware to authenticate the user
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Get logged-in user's data
app.get('/api/users/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});