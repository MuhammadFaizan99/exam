// Import required modules
const express = require('express');
const AWS = require('aws-sdk');
const fs = require('fs');
const bodyParser = require('body-parser');

// Set up Express app
const app = express();
app.use(bodyParser.json());

// Set the region and credentials
AWS.config.update({
  region: 'your-region', // e.g., 'us-east-1'
  accessKeyId: 'your-access-key-id',
  secretAccessKey: 'your-secret-access-key'
});

// Create S3 service object
const s3 = new AWS.S3();
const bucketName = 'your-bucket-name';

// Upload endpoint
app.post('/upload', (req, res) => {
  const { fileName, fileContent } = req.body;
  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: fileContent
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.error('Upload error:', err);
      res.status(500).json({ error: 'Failed to upload file' });
    } else {
      console.log('Upload successful:', data);
      res.status(200).json({ message: 'File uploaded successfully' });
    }
  });
});

// Download endpoint
app.get('/download/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  const params = {
    Bucket: bucketName,
    Key: fileName
  };

  s3.getObject(params, (err, data) => {
    if (err) {
      console.error('Download error:', err);
      res.status(500).json({ error: 'Failed to download file' });
    } else {
      console.log('Download successful');
      res.status(200).send(data.Body);
    }
  });
});

// List endpoint
app.get('/list', (req, res) => {
  const params = {
    Bucket: bucketName
  };

  s3.listObjects(params, (err, data) => {
    if (err) {
      console.error('List error:', err);
      res.status(500).json({ error: 'Failed to list objects' });
    } else {
      console.log('List successful');
      res.status(200).json(data.Contents);
    }
  });
});

// Delete endpoint
app.delete('/delete/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  const params = {
    Bucket: bucketName,
    Key: fileName
  };

  s3.deleteObject(params, (err, data) => {
    if (err) {
      console.error('Delete error:', err);
      res.status(500).json({ error: 'Failed to delete file' });
    } else {
      console.log('Delete successful');
      res.status(200).json({ message: 'File deleted successfully' });
    }
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
