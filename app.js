
const express = require('express')
const multer = require('multer')
const ejs = require('ejs')
const path = require('path')

const app = express();
app.use(express.static('./public'));
app.set('view engine','ejs');

//storage
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req,file,cb){
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

//Upload

const upload = multer({
    storage: storage,
    limits: {fileSize: 1000000},
    fileFilter: function(req,file,cb){
        checkfileType(file,cb);
    }
}).single('myImage');

function checkfileType(file,cb){
    const fileType = /jpeg|jpg|png|gif/;
    const extname = fileType.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileType.test(file.mimetype);
    if(mimetype && extname){
        return cb(null,true);
    }else{
        cb('error:Images Only!')
    }
}

app.get('/',(req,res)=>{
    res.render('index');
});

app.post('/upload',(req,res)=>{
    upload(req,res,(err)=>{
        if(err){
            res.render('index',{msg:err})
        }else{
            if(req.file == undefined){
                res.render('index',{msg: 'Error: No file selected!'})
            }else{
                res.render('index',{msg: 'File Uploaded!',
            file: `uploads/${req.file.filename}`})
            }
        }
    })
})
app.listen(3000,()=>{
    console.log('Server started at port 3000')
});