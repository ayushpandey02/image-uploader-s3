const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const multer = require("multer")
const upload = multer({dest: 'upload/'});
const AWS = require('aws-sdk');
const fs = require('fs');
const stream = require('stream');

const app = express();

const port = process.env.PORT;


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const s3 = new AWS.S3({
    accessKeyId: 'YOUR_ACCESS_KEY',
    secretAccessKey: 'YOUR_SECRET_ACCESS_KEY'
});

app.get("/", (req, res)=>{
    res.sendFile(__dirname+"/public/html/home.html");
})
app.post("/upload", upload.single('image'),async (req, res)=>{
    const file = req.file
    
const filePath = file.path;
const fileName = file.originalname
// Read the image file
const buffer = fs.readFileSync(filePath);

// Create a Readable stream from the buffer
const readableStream = new stream.PassThrough();
readableStream.end(buffer);

// Upload the image to S3
const uploadedImage = await s3.upload({
  Bucket: 'react-node-images-uploads',
  Key: fileName,
  Body: readableStream,
}).promise();

res.write(`<h1 style="text-align: center; color: green; font-family: 'Kanit', sans-serif;">Upload Status</h1>`);
res.write(`<p style="text-align: center; color: red; font-family: 'Kanit', sans-serif;">Image Uploaded Successfully</p>`);
res.send("");

})


app.listen(3000, ()=>console.log("Server running on port 3000"));



