
const express = require('express');
const mongoose = require('mongoose');


//creating the forum-post schema
const forumPostSchema = new mongoose.Schema({
    title: String,
    author: String,
    creation_date: Date,
    content: String
});

//calls the express function "express()" and puts new Express application inside the app variable (to start a new Express application)
const app = express();

// parse the incoming JSON requests and put the parsed data to req.body
app.use(express.json());

//this const provide access to read and write to the specific schema
const ForumPost = mongoose.model('forum_posts', forumPostSchema);

const router = express.Router();
app.use("/forum/posts", router);

//GET all posts (query params)
router.get("/",async(req,res)=>{
    try {
        const posts = await ForumPost.find();
        res.send(posts);
    } catch (error) {
        res.send(error.message);
    }
});

// //GET all posts sorted by creation date (query params)
router.get("/date",async (req,res)=>{
    try {
        const posts = await ForumPost.find().sort({ creation_date: 1 });
        res.send(posts);
    } catch (error) {
        res.send(error.message);
    }
});

//GET post by ID 
router.get("/id", async(req,res)=>{
    try {
        const post = await ForumPost.findById(req.query.id);
        res.send(post);
    } catch (error) {
        res.send(error.message);
    }
});

//GET all posts by user
router.get("/user",async (req,res)=>{
    try{
        const posts = await ForumPost.find({ author: req.query.author });
        res.send(posts);
    } catch(error){
        res.send(error.message);
    }
});


//GET post by title
router.get("/title",async (req,res)=>{
    try{
        const posts = await ForumPost.find({ title: req.query.title });
        res.send(posts);
    } catch(error){
        res.send(error.message);
    }
});

//POST new post
router.post("/", async (req,res)=>{
    const newPost = new ForumPost({
        title: req.body.title,
        author: req.body.author,
        creation_date: Date.now(),
        content: req.body.content
    });
    await newPost.save(); // saves to db
    res.send(newPost); //response
});

//DELETE a post
router.delete("/id", async (req,res)=>{
    try {
        await ForumPost.findByIdAndDelete(req.query.id);
        res.send();
    } catch (error) {
        res.send(error.message);
    }
});


// connecting to mongodb and listen to changes
async function main(){
    await mongoose.connect('mongodb://mongo_db_container:27017/forum');
    app.listen(3000, () => console.log("server is up"));
}

main().catch(err => console.log(err));

