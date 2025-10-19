1.For uploading the image we will use the package called Multer.
Multer is the third party library, which simplifies the process of uploading the image to the database using node js.
we need the libarry like npm i multer


// step1:Process of importing multer

const multer = require('multer);

//step2: we need to tell the multer where we want to upload/store the images i.e destination folder and filename


var storage = multer.diskStorage({
    destination:function(req,file,cb)
    {
        cb(null,'uploads')
    }
    filename:function (req,file,cb){
        cb(null,file.originalName)
    }
})


var uploads = multer({storage:storage})





