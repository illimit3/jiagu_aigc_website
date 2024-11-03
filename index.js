import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

// Load environment variables from .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

const STABLE_DIFFUSION_API_KEY = process.env.STABLE_DIFFUSION_API_KEY;
const API_HOST = 'https://stablediffusionapi.com/api/v3/text2img';

// In-memory storage for uploaded images
const uploadedImages = [];

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: 'public/uploads/',
  filename: (req, file, cb) => {
    const uniqueId = uuidv4();
    const extension = path.extname(file.originalname);
    cb(null, `${uniqueId}${extension}`);
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'));
    }
  }
});

// Add debug logging
console.log('API Key status:', STABLE_DIFFUSION_API_KEY ? 'Set' : 'Not set');

app.use(express.json());
app.use(express.static('public'));

// Create uploads directory if it doesn't exist
import { mkdir } from 'fs/promises';
try {
  await mkdir('public/uploads', { recursive: true });
} catch (err) {
  if (err.code !== 'EEXIST') {
    console.error('Failed to create uploads directory:', err);
  }
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Get all images
app.get('/images', (req, res) => {
  res.json(uploadedImages);
});

// Handle image upload
app.post('/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    const imageData = {
      id: uuidv4(),
      url: imageUrl,
      filename: req.file.filename,
      uploadedAt: new Date().toISOString()
    };

    uploadedImages.unshift(imageData);
    res.json(imageData);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

app.get('/test-api-key', async (req, res) => {
  try {
    if (!STABLE_DIFFUSION_API_KEY) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'API key is not set' 
      });
    }

    console.log('Testing API key...');
    
    const response = await fetch(API_HOST, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key: STABLE_DIFFUSION_API_KEY,
        prompt: 'test',
        width: 256,
        height: 256,
        samples: 1,
        num_inference_steps: 1
      }),
    });

    const data = await response.json();
    console.log('API Response:', data);

    if (response.ok && !data.error) {
      res.json({ 
        status: 'success', 
        message: 'API key is valid' 
      });
    } else {
      res.status(401).json({ 
        status: 'error', 
        message: data.message || 'Invalid API key' 
      });
    }
  } catch (error) {
    console.error('API test error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: error.message || 'Failed to verify API key' 
    });
  }
});

app.post('/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({
        status: 'error',
        message: 'Prompt is required'
      });
    }
    const response = await fetch(API_HOST, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key: STABLE_DIFFUSION_API_KEY,
        prompt: prompt,
        width: 512,
        height: 512,
        samples: 1,
        num_inference_steps: 20,
        safety_checker: 'yes',
        enhance_prompt: 'yes',
        seed: null,
        guidance_scale: 7.5,
        webhook: null,
        track_id: null
      }),
    });
    const data = await response.json();
    
    if (data.status === 'processing') {
      res.json({
        status: 'processing',
        fetch_result: data.fetch_url,
        eta: data.eta || 30
      });
    } else if (data.output && data.output[0]) {
      res.json({
        status: 'success',
        imageUrl: data.output[0]
      });
    } else {
      throw new Error(data.message || 'Failed to generate image');
    }
  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to generate image'
    });
  }
});

app.get('/fetch-result', async (req, res) => {
  try {
    const { fetch_result } = req.query;
    
    if (!fetch_result) {
      return res.status(400).json({
        status: 'error',
        message: 'Fetch URL is required'
      });
    }

    const response = await fetch(fetch_result);
    const data = await response.json();

    if (data.status === 'success' && data.output && data.output[0]) {
      res.json({
        status: 'success',
        imageUrl: data.output[0]
      });
    } else if (data.status === 'processing') {
      res.json({
        status: 'processing',
        eta: data.eta || 30
      });
    } else {
      throw new Error(data.message || 'Failed to fetch result');
    }
  } catch (error) {
    console.error('Fetch result error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to fetch result'
    });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});