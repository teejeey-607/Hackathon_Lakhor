// imageUtils.js
const fs = require('fs').promises;

async function encodeImageToBase64(filePath) {
  try {
    const imageData = await fs.readFile(filePath);
    return imageData.toString('base64');
  } catch (error) {
    throw new Error(`Error encoding image to base64: ${error.message}`);
  }
}

module.exports = { encodeImageToBase64 };
