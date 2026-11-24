require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "dog_sanctuary_super_secret_key_2026";

const ADMIN_EMAILS = (
  process.env.ADMIN_EMAILS ||
  "kanhaiya121@gmail.com,atul7179@gmail.com,sumit77@gmail.com"
)
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

// =====================================================
// MIDDLEWARE
// =====================================================
app.use(cors());
app.use(express.json());

// =====================================================
// MONGODB CONNECTION
// =====================================================
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/dog_sanctuary";

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected successfully");
    await seedInitialData();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// =====================================================
// MONGOOSE SCHEMAS & MODELS
// =====================================================

// 1. User Schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);

// 2. Dog Schema (Includes Medical, Staff Assignment & Diet Plan)
const dogSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    breed: { type: String, required: true, trim: true },
    age: { type: String, required: true, trim: true },
    gender: { type: String, default: "Male" },
    description: { type: String, required: true },
    image: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1000&q=90",
    },
    status: {
      type: String,
      enum: ["Available", "Adopted"],
      default: "Available",
    },
    // Medical & Diet Fields
    assignedDoctor: { type: String, default: "Dr. Aarav Sharma (Chief Vet)" },
    assignedCaretaker: { type: String, default: "Ramesh Kumar (Kennel Boy)" },
    medicalStatus: {
      type: String,
      enum: ["Healthy & Vaccinated", "Under Medication", "Deworming Due", "Post-Surgery Recovery"],
      default: "Healthy & Vaccinated",
    },
    currentMedicine: { type: String, default: "Multivitamin Syrup + Monthly Dewormer" },
    dietPlan: {
      type: String,
      default: "Morning: Boiled Eggs & Kibble | Evening: Boiled Chicken, Rice & Pumpkin",
    },
    restrictedFoods: {
      type: String,
      default: "No Chocolate, Onion, Spicy Food, Sweets, or Cooked Chicken Bones",
    },
    feedingStatus: {
      type: String,
      enum: ["Fed Today", "Pending Meal", "Special Vet Diet"],
      default: "Fed Today",
    },
  },
  { timestamps: true }
);
const Dog = mongoose.model("Dog", dogSchema);

// 3. Staff & Veterinary Team Schema
const staffSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: {
      type: String,
      enum: ["Vet Doctor", "Kennel Caretaker", "Rescue Driver", "Pharmacy & Diet"],
      required: true,
    },
    specialization: { type: String, default: "General Canine Care", trim: true },
    phone: { type: String, required: true, trim: true },
    shift: {
      type: String,
      enum: ["Morning (7 AM - 3 PM)", "Evening (3 PM - 11 PM)", "Night Emergency"],
      default: "Morning (7 AM - 3 PM)",
    },
    assignedKennel: { type: String, default: "Kennel Block A" },
    status: {
      type: String,
      enum: ["On Duty", "On Leave"],
      default: "On Duty",
    },
  },
  { timestamps: true }
);
const Staff = mongoose.model("Staff", staffSchema);

// 4. Adoption Schema
const adoptionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    dog: { type: String, required: true, trim: true },
    message: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);
const Adoption = mongoose.model("Adoption", adoptionSchema);

// 5. Volunteer Schema
const volunteerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    activity: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);
const Volunteer = mongoose.model("Volunteer", volunteerSchema);

// 6. Contact Message Schema
const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);
const Contact = mongoose.model("Contact", contactSchema);

// 7. Rescue Report Schema
const rescueSchema = new mongoose.Schema(
  {
    reporterName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    condition: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["Reported", "In Treatment", "Rescued"],
      default: "Reported",
    },
  },
  { timestamps: true }
);
const Rescue = mongoose.model("Rescue", rescueSchema);

// 8. Donation Schema
const donationSchema = new mongoose.Schema(
  {
    donorName: { type: String, default: "Kind Supporter", trim: true },
    email: { type: String, default: "", trim: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, default: "UPI / Online" },
    transactionId: { type: String, required: true },
  },
  { timestamps: true }
);
const Donation = mongoose.model("Donation", donationSchema);

// =====================================================
// SEED INITIAL DOGS & STAFF
// =====================================================
async function seedInitialData() {
  try {
    const dogCount = await Dog.countDocuments();
    if (dogCount === 0) {
      await Dog.insertMany([
        {
          name: "Bruno",
          breed: "Labrador",
          age: "2 Years",
          gender: "Male",
          description: "Friendly, playful and full of love.",
          image:
            "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1000&q=90",
          status: "Available",
          assignedDoctor: "Dr. Aarav Sharma (Chief Vet)",
          assignedCaretaker: "Ramesh Kumar (Kennel Boy)",
          medicalStatus: "Healthy & Vaccinated",
          currentMedicine: "Rabies Booster + Calcium Supplement",
          dietPlan: "Morning: 2 Boiled Eggs + Dry Kibble | Evening: Boiled Chicken, Rice & Carrots",
          restrictedFoods: "No Chocolate, Grapes, Onion, Dairy Excess, or Spicy Food",
          feedingStatus: "Fed Today",
        },
        {
          name: "Bella",
          breed: "Golden Retriever",
          age: "3 Years",
          gender: "Female",
          description: "Gentle and perfect for a loving family.",
          image:
            "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=1000&q=90",
          status: "Available",
          assignedDoctor: "Dr. Priya Nair (Senior Vet)",
          assignedCaretaker: "Suresh Patel (Kennel Boy)",
          medicalStatus: "Under Medication",
          currentMedicine: "Skin Coat Omega-3 + Antibiotic Course (5 Days)",
          dietPlan: "Morning: Curd Rice + Puppy/Adult Kibble | Evening: Boiled Fish/Soyabean & Pumpkin",
          restrictedFoods: "Strictly No Chicken Allergy, No Sugar, No Onion/Garlic",
          feedingStatus: "Special Vet Diet",
        },
        {
          name: "Rocky",
          breed: "Indie",
          age: "1 Year",
          gender: "Male",
          description: "Energetic, smart and very affectionate.",
          image:
            "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1000&q=90",
          status: "Available",
          assignedDoctor: "Dr. Aarav Sharma (Chief Vet)",
          assignedCaretaker: "Ramesh Kumar (Kennel Boy)",
          medicalStatus: "Healthy & Vaccinated",
          currentMedicine: "Monthly Deworming Tablet",
          dietPlan: "Morning: Milk-free Dalia + Kibble | Evening: Chicken Broth, Rice & Boiled Beans",
          restrictedFoods: "No Chocolate, Fried Food, Raw Bones, or Sweets",
          feedingStatus: "Fed Today",
        },
      ]);
      console.log("Initial sanctuary dogs seeded.");
    }

    const staffCount = await Staff.countDocuments();
    if (staffCount === 0) {
      await Staff.insertMany([
        {
          name: "Dr. Aarav Sharma",
          role: "Vet Doctor",
          specialization: "Trauma Surgery & Orthopedics",
          phone: "+91 98250 11223",
          shift: "Morning (7 AM - 3 PM)",
          assignedKennel: "Medical Ward & ICU",
          status: "On Duty",
        },
        {
          name: "Dr. Priya Nair",
          role: "Vet Doctor",
          specialization: "Vaccination, Skin & Nutrition",
          phone: "+91 98250 44556",
          shift: "Evening (3 PM - 11 PM)",
          assignedKennel: "Puppy & Recovery Wing",
          status: "On Duty",
        },
        {
          name: "Ramesh Kumar",
          role: "Kennel Caretaker",
          specialization: "Daily Feeding, Walking & Hygiene",
          phone: "+91 97123 77889",
          shift: "Morning (7 AM - 3 PM)",
          assignedKennel: "Kennel Block A & B",
          status: "On Duty",
        },
        {
          name: "Suresh Patel",
          role: "Kennel Caretaker",
          specialization: "Special Diet Prep & Grooming",
          phone: "+91 97123 99001",
          shift: "Evening (3 PM - 11 PM)",
          assignedKennel: "Recovery & Senior Block",
          status: "On Duty",
        },
      ]);
      console.log("Initial sanctuary staff seeded.");
    }
  } catch (err) {
    console.error("Error seeding initial data:", err);
  }
}

// =====================================================
// VALIDATION HELPERS, AUTH & ADMIN MIDDLEWARE
// =====================================================
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const isValidPhone = (phone) => {
  const digits = String(phone || "").replace(/\D/g, "");
  const normalized =
    digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits;
  return /^[6-9]\d{9}$/.test(normalized);
};

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email || "").trim());
};

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No authentication token provided.",
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "Invalid or expired token. Please login again.",
      });
    }
    req.user = decoded;
    next();
  });
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required.",
    });
  }
  next();
}

// =====================================================
// AUTH ROUTES
// =====================================================

// 1. Signup (Returns Token + Role so Admin redirects straight to /admin)
app.post("/api/auth/signup", async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!name || !email || !isValidEmail(email) || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Name, valid email (e.g. name@gmail.com), and a password (min 6 chars) are required.",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const assignedRole = ADMIN_EMAILS.includes(email) ? "admin" : "user";

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: assignedRole,
    });

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: assignedRole },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      message: "Account created successfully!",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during registration.",
    });
  }
});

// 2. Standard User Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!email || !isValidEmail(email) || !password) {
      return res.status(400).json({
        success: false,
        message: "Valid email and password are required.",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const effectiveRole = ADMIN_EMAILS.includes(email) ? "admin" : user.role;
    if (user.role !== effectiveRole) {
      user.role = effectiveRole;
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: effectiveRole },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: effectiveRole,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login.",
    });
  }
});

// 3. Strict Admin-Only Login
app.post("/api/auth/admin-login", async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!email || !isValidEmail(email) || !password) {
      return res.status(400).json({
        success: false,
        message: "Valid admin email and password are required.",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials.",
      });
    }

    const isAuthorizedAdmin =
      user.role === "admin" || ADMIN_EMAILS.includes(email);

    if (!isAuthorizedAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access Denied: Only authorized Admins can login here.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials.",
      });
    }

    if (user.role !== "admin") {
      user.role = "admin";
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: "admin" },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: "admin",
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during admin login.",
    });
  }
});

// 4. Forgot / Reset Password
app.post("/api/auth/forgot-password", async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const newPassword = String(req.body.newPassword || "");

    if (!email || !isValidEmail(email) || !newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Valid email and at least 6-character new password required.",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email address.",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password reset successfully! Redirecting to login...",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while resetting password.",
    });
  }
});

// =====================================================
// STAFF & VETERINARY DOCTORS ROUTES
// =====================================================

app.get("/api/staff", async (req, res) => {
  try {
    const staff = await Staff.find().sort({ createdAt: -1 });
    res.json({ success: true, staff });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch staff" });
  }
});

app.post("/api/staff", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, role, specialization, phone, shift, assignedKennel } = req.body;
    if (!name || !role || !phone) {
      return res.status(400).json({
        success: false,
        message: "Staff name, role, and phone number are required.",
      });
    }
    if (!isValidPhone(phone)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 10-digit mobile number.",
      });
    }

    const member = await Staff.create({
      name: name.trim(),
      role,
      specialization: specialization?.trim() || "General Canine Care",
      phone: phone.trim(),
      shift: shift || "Morning (7 AM - 3 PM)",
      assignedKennel: assignedKennel?.trim() || "Kennel Block A",
    });

    res.status(201).json({ success: true, member });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to add staff member" });
  }
});

app.patch("/api/staff/:id/status", authenticateToken, requireAdmin, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid staff ID" });
    }
    const { status } = req.body;
    const member = await Staff.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json({ success: true, member });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update staff status" });
  }
});

app.delete("/api/staff/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid staff ID" });
    }
    await Staff.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Staff member removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to remove staff" });
  }
});

// =====================================================
// DOGS, MEDICAL & DIET ROUTES
// =====================================================

app.get("/api/dogs", async (req, res) => {
  try {
    const dogs = await Dog.find().sort({ createdAt: -1 });
    res.json({ success: true, dogs });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch dogs" });
  }
});

app.post("/api/dogs", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      name,
      breed,
      age,
      gender,
      description,
      image,
      assignedDoctor,
      assignedCaretaker,
      medicalStatus,
      currentMedicine,
      dietPlan,
      restrictedFoods,
    } = req.body;

    if (!name || !breed || !age || !description) {
      return res.status(400).json({
        success: false,
        message: "Name, breed, age, and description are required.",
      });
    }

    const dog = await Dog.create({
      name: name.trim(),
      breed: breed.trim(),
      age: age.trim(),
      gender: gender || "Male",
      description: description.trim(),
      image:
        image && image.trim()
          ? image.trim()
          : "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1000&q=90",
      assignedDoctor: assignedDoctor || "Dr. Aarav Sharma (Chief Vet)",
      assignedCaretaker: assignedCaretaker || "Ramesh Kumar (Kennel Boy)",
      medicalStatus: medicalStatus || "Healthy & Vaccinated",
      currentMedicine: currentMedicine || "Monthly Dewormer & Multivitamin",
      dietPlan:
        dietPlan ||
        "Morning: Boiled Eggs & Kibble | Evening: Boiled Chicken, Rice & Pumpkin",
      restrictedFoods:
        restrictedFoods ||
        "No Chocolate, Onion, Garlic, Spicy Food, or Cooked Bones",
    });

    res.status(201).json({ success: true, dog });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to add dog" });
  }
});

// Update Dog Care, Diet, Medicine & Feeding Status
app.patch("/api/dogs/:id/care", authenticateToken, requireAdmin, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid dog ID" });
    }
    const allowedUpdates = [
      "assignedDoctor",
      "assignedCaretaker",
      "medicalStatus",
      "currentMedicine",
      "dietPlan",
      "restrictedFoods",
      "feedingStatus",
      "status",
    ];
    const updates = {};
    allowedUpdates.forEach((key) => {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    });

    const dog = await Dog.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json({ success: true, dog });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update dog care details" });
  }
});

app.delete("/api/dogs/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid dog ID" });
    }
    await Dog.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Dog removed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete dog" });
  }
});

// =====================================================
// ADOPTION ROUTES
// =====================================================

app.post("/api/adoption", async (req, res) => {
  try {
    const { name, email, phone, dog, message } = req.body;
    if (!name || !email || !phone || !dog) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address (e.g. name@gmail.com).",
      });
    }
    if (!isValidPhone(phone)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 10-digit mobile number.",
      });
    }

    const application = await Adoption.create({
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      phone: String(phone).trim(),
      dog: String(dog).trim(),
      message: message || "",
    });

    res.status(201).json({
      success: true,
      message: "Adoption application submitted successfully!",
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to submit adoption application.",
    });
  }
});

app.get("/api/adoption", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const applications = await Adoption.find().sort({ createdAt: -1 });
    res.json({ success: true, applications });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch adoption applications.",
    });
  }
});

app.patch("/api/adoption/:id/status", authenticateToken, requireAdmin, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }
    const { status } = req.body;
    if (!["Pending", "Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }
    const application = await Adoption.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update status" });
  }
});

app.delete("/api/adoption/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }
    await Adoption.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Adoption application deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete application" });
  }
});

// =====================================================
// VOLUNTEER ROUTES
// =====================================================

app.post("/api/volunteer", async (req, res) => {
  try {
    const { name, email, phone, activity } = req.body;
    if (!name || !email || !phone || !activity) {
      return res.status(400).json({
        success: false,
        message: "All volunteer registration fields are required.",
      });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address (e.g. name@gmail.com).",
      });
    }
    if (!isValidPhone(phone)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 10-digit mobile number.",
      });
    }

    const volunteer = await Volunteer.create({
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      phone: String(phone).trim(),
      activity: String(activity).trim(),
    });

    res.status(201).json({
      success: true,
      message: "Volunteer registration submitted!",
      volunteer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to submit volunteer registration.",
    });
  }
});

app.get("/api/volunteer", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const applications = await Volunteer.find().sort({ createdAt: -1 });
    res.json({ success: true, applications });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch volunteer applications.",
    });
  }
});

app.patch("/api/volunteer/:id/status", authenticateToken, requireAdmin, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }
    const { status } = req.body;
    if (!["Pending", "Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }
    const volunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json({ success: true, volunteer });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update volunteer" });
  }
});

app.delete("/api/volunteer/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }
    await Volunteer.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Volunteer request deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete volunteer" });
  }
});

// =====================================================
// CONTACT MESSAGE ROUTES
// =====================================================

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required.",
      });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address (e.g. name@gmail.com).",
      });
    }

    const contact = await Contact.create({
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      message: String(message).trim(),
    });
    res.status(201).json({
      success: true,
      message: "Message sent successfully!",
      contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send message.",
    });
  }
});

app.get("/api/contact", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages.",
    });
  }
});

app.delete("/api/contact/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Message deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete message" });
  }
});

// =====================================================
// EMERGENCY RESCUE ROUTES
// =====================================================

app.post("/api/rescue", async (req, res) => {
  try {
    const { reporterName, phone, location, condition } = req.body;
    if (!reporterName || !phone || !location || !condition) {
      return res.status(400).json({
        success: false,
        message: "All rescue report fields are required.",
      });
    }
    if (!isValidPhone(phone)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 10-digit mobile number.",
      });
    }

    const rescue = await Rescue.create({
      reporterName: String(reporterName).trim(),
      phone: String(phone).trim(),
      location: String(location).trim(),
      condition: String(condition).trim(),
    });

    res.status(201).json({
      success: true,
      message: "Rescue report submitted! Our emergency team has been alerted.",
      rescue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to submit rescue report.",
    });
  }
});

app.get("/api/rescue", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const rescues = await Rescue.find().sort({ createdAt: -1 });
    res.json({ success: true, rescues });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch rescue reports.",
    });
  }
});

app.patch("/api/rescue/:id/status", authenticateToken, requireAdmin, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }
    const { status } = req.body;
    if (!["Reported", "In Treatment", "Rescued"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }
    const rescue = await Rescue.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json({ success: true, rescue });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update rescue status.",
    });
  }
});

// =====================================================
// DONATION ROUTES
// =====================================================

app.post("/api/donation", async (req, res) => {
  try {
    const amount = Number(req.body.amount);
    if (!amount || isNaN(amount) || amount < 1) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid donation amount.",
      });
    }

    const rawEmail = String(req.body.email || "").trim();
    if (rawEmail && !isValidEmail(rawEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address (e.g. name@gmail.com).",
      });
    }

    const transactionId = `DCS-${Date.now()}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    const donation = await Donation.create({
      donorName: String(req.body.donorName || "Kind Supporter").trim(),
      email: rawEmail.toLowerCase(),
      amount,
      paymentMethod: req.body.paymentMethod || "UPI / Online",
      transactionId,
    });

    res.status(201).json({
      success: true,
      message: "Donation recorded successfully!",
      donation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to record donation.",
    });
  }
});

app.get("/api/donation", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.json({ success: true, donations });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch donations.",
    });
  }
});

// =====================================================
// ADMIN USERS LIST ROUTE
// =====================================================

app.get("/api/admin/users", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.find({}, "-password").sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load users list.",
    });
  }
});

// =====================================================
// HEALTH CHECK & START SERVER
// =====================================================

app.get("/", (req, res) => {
  res.send("Dog Canine Sanctuary API is running...");
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});