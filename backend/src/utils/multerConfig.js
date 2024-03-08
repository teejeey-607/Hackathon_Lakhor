const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Determine the destination folder based on the field name
    const folder = file.fieldname.toLowerCase();
    cb(null, path.join(__dirname, '..', 'uploads', folder));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const fileFilter = function (req, file, cb) {
  // Customize the file filter logic based on your requirements
  if (file.fieldname === 'userprofile') {
    // Check if it's an image or any other validation for userprofile
    // Example: if (file.mimetype.startsWith('image/')) { cb(null, true); }
  } else if (file.fieldname === 'qrcode') {
    // Check if it's a valid QR code or any other validation for qrcode
  }

  // For simplicity, we'll allow all files by default
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

module.exports = upload;
