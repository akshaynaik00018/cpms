const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = uploadsDir;
    
    // Create subdirectories based on file type
    if (file.fieldname === 'resume') {
      uploadPath = path.join(uploadsDir, 'resumes');
    } else if (file.fieldname === 'logo') {
      uploadPath = path.join(uploadsDir, 'logos');
    } else if (file.fieldname === 'document') {
      uploadPath = path.join(uploadsDir, 'documents');
    } else if (file.fieldname === 'offerLetter') {
      uploadPath = path.join(uploadsDir, 'offers');
    } else if (file.fieldname === 'profilePicture') {
      uploadPath = path.join(uploadsDir, 'profiles');
    }
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = {
    resume: ['.pdf', '.doc', '.docx'],
    logo: ['.jpg', '.jpeg', '.png', '.svg'],
    document: ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'],
    offerLetter: ['.pdf'],
    profilePicture: ['.jpg', '.jpeg', '.png']
  };
  
  const ext = path.extname(file.originalname).toLowerCase();
  const fieldAllowedTypes = allowedTypes[file.fieldname] || [];
  
  if (fieldAllowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type for ${file.fieldname}. Allowed types: ${fieldAllowedTypes.join(', ')}`), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB default
  },
  fileFilter: fileFilter
});

module.exports = upload;
