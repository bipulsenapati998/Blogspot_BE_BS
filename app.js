const { log } = require('console');
// var cors = require('cors');
const express = require('express');
const fs = require('fs');
const multer = require('multer')
const path = require('path')
const helpers = require('./helpers');

const app = express();
//enable CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "*");
    next();
});
app.use(express.json())
app.use('/assets', express.static(__dirname + '/assets'));
app.use(express.urlencoded({ extended: false }));
// app.use(cors());

var currentBlogID;
var currentCommentID;
// Location to store captured image for blog page
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'D:\\BEPOC\\assets');
    },
    // By default, multer removes file extensions so let's add them back
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + currentBlogID + '-' + path.basename(file.originalname));
    }
});
// Hit this API when we add image on Write your blog page
app.post('/upload-blog-img', (req, res) => {
    // 'profile_pic' is the name of our file input field in the HTML form
    let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).single('img');

    upload(req, res, function (err) {
        // req.file contains information of uploaded file
       
        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
            return res.send('Please select an image to upload');
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        else if (err) {
            return res.send(err);
        }
        console.log(`${req.file.originalname}`);
        // Display uploaded image for user validation
        res.send(`You have uploaded this image: ${req.file.originalname}`);
    });
});

// Called from Write your blog
app.post('/post/blogdetails', (req, res) => {
    const existUsersData = getBlogData()

    const userData = req.body.pop();
    currentBlogID = userData.id;
    if (userData === null || userData.blogTitle === null || userData.writer === null
        || userData.content === null || userData.publisher === null) {
        return res.status(401).send({ error: true, msg: 'User data missing' })
    }
    userData.blogImage = 'img-' + userData.id + '-' + userData.blogImage.split("\\").pop();
    existUsersData.push(userData);
    saveBlogData(existUsersData)
    res.send({ success: true, msg: 'Your Blog added successfully' })
})
app.get('/get/blogdetails', (req, res) => {
    const userBlog = getBlogData()
    res.send(userBlog);
})

// when I'm sending id please change its isCloseable parameter parsing from body
app.patch('/put/update/:myID', (req, res) => {
    //get the username from url
    const bid = parseInt(req.params.myID)
    //get the update data from body
    const isClose = req.body.isClosable
    const existUsers = getBlogData()
    const findExist = existUsers.find(user => user.id === bid)
    if (!findExist) {
        return res.status(409).send({ error: true, msg: 'Blog ID does not exist' })
    } else {
        findExist.isClosable = isClose
    }
    //finally save it
    saveBlogData(existUsers)
    res.send({ success: true, msg: 'Blog data updated successfully' })
})
// Location to store captured image for blog details page Comment section
const cstorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'D:\\BEPOC\\assets');
    },
    // By default, multer removes file extensions so let's add them back
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + currentCommentID + '-' + path.basename(file.originalname));
    }
});
// Hit this API when we add image on Write your blog details page Comment section
app.post('/upload-blog-img/comments', (req, res) => {
    // 'profile_pic' is the name of our file input field in the HTML form
    let upload = multer({ storage: cstorage, fileFilter: helpers.imageFilter }).single('cimg');

    upload(req, res, function (err) {
        // req.file contains information of uploaded file
        
        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
            return res.send('Please select an image to upload');
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        else if (err) {
            return res.send(err);
        }        
        // Display uploaded image for user validation
        res.send(`You have uploaded this image on comment section: ${req.file.originalname}`);
    });
});

app.post('/post/commentdetails', (req, res) => {
    const existingComment = getCommentData();
    const len = existingComment.length;
    const commentValue = req.body;
    currentCommentID = commentValue[commentValue.length - 1].id;

    if (commentValue === null || commentValue.blogId === null || commentValue.content === null
        || commentValue.name === null || commentValue.id === null) {
        return res.status(401).send({ error: true, msg: 'Fill out comment details. Data missing!!' })
    }
    for (let i = 0; i <= len; i++) {
        existingComment.pop(i);        
    };
    for (let i = 0; i < commentValue.length; i++) {
        if (!commentValue[i].image.includes('cimg-')) {
            commentValue[i].image = 'cimg-' + commentValue[i].id + '-' + JSON.stringify(commentValue[i].image).split("\\").pop().slice(0, -1);
        }
    }
    //commentValue[commentValue.length-1].image = 'cimg-'+currentCommentID+'-'+JSON.stringify(commentValue[commentValue.length-1].image).split("\\").pop().slice(0,-1);
    existingComment.push(commentValue);
    saveCommentData(existingComment);
    res.send({ success: true, msg: 'Your Comment added successfully' })
})

app.get('/get/commentdetails', (req, res) => {
    const userBlog = getCommentData()
    res.send(userBlog[0]);
})

const saveBlogData = (data) => {
    const stringifyData = JSON.stringify(data)
    fs.writeFileSync('blog.json', stringifyData)
}
const getBlogData = () => {
    const jsonData = fs.readFileSync('blog.json')
    return JSON.parse(jsonData)
}

const saveCommentData = (newComment) => {
    const commentstring = JSON.stringify(newComment)
    fs.writeFileSync('comment.json', commentstring)
}
const getCommentData = () => {
    const commentJsonData = fs.readFileSync('comment.json')
    return JSON.parse(commentJsonData)
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Node Started Listening On Port: ${PORT}`)
})