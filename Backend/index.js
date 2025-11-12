import express from "express";

import { addAddress, getJSONData, mapEmail } from "./controllers/getJSONData.js";

const app = express();


import multer from "multer";
import cors from "cors";
import path from 'path';
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
import { fileURLToPath } from 'url';
import { ConnectDB } from "./db.js";
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

ConnectDB()


const Storage = multer.diskStorage({
    // Destination to store pdf  
    destination: 'uploads', 
      filename: (req, file, cb) => {
          cb(null, file.fieldname + '_' + Date.now() 
             + path.extname(file.originalname))
            // file.fieldname is name of the field 
            // path.extname get the uploaded file extension
    }
});
const upload = multer({
    storage: Storage,
    limits: { fileSize: 50 * 1024 * 1024 },
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(pdf)$/)) { 
         // upload only pdf
         console.log("in filefilter----")
         return cb(new Error('Please upload a pdf'))
       }
     cb(undefined, true)
  }
}) 


//Upload route
app.post('/upload', upload.single('pdf'), (req, res) => {
  console.log("in post route---");
  console.log(req.file);
    res.send(req.file);
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

app.post('/getAddress',mapEmail)

app.post("/addUser",addAddress)
  

app.get("/getjsondata/:jsonCID", getJSONData);

app.listen(4000, () => console.log("Server is running on port 4000"));
