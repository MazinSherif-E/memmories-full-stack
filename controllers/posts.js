const PostMessage = require('../models/postMessage')
const mongoose = require('mongoose');

const getPost = async (req, res) =>{
    const { page } = req.query;

    try{
        const LIMIT = 8;
        const startIndex = (Number(page) - 1) * LIMIT //get the first post in each page ( 0 - 8 - 16 - ....)
        const total = await PostMessage.countDocuments({});

        const posts = await PostMessage.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);

        res.status(200).json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT)})
    }catch (e){
        res.status(404).json({ message: e.message })
    }
};

const createPost = async (req, res) =>{
    const post = req.body;
    const newPost = new PostMessage({ ...post, creator: req.user._id, createdAt: new Date().toISOString() });
    
    try{
        await newPost.save();

        res.status(201).json(newPost);
    }catch(e){
        res.status(409).json({ message: e.message })
    }
};

const updatePost = async (req, res) =>{
    const { id } = req.params;
    const post = req.body;

    // To make sure the id is valid
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id'); 

    const updatedPost = await PostMessage.findByIdAndUpdate(id, { ...post, id}, {new: true})
    
    res.json(updatedPost)
}

const deletePost = async(req, res) =>{
    const { id } = req.params;

    // To make sure the id is valid
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id'); 

    await PostMessage.findByIdAndRemove(id)
    
    res.json({message: 'Post deleted successfully'})
}

const likePost = async(req, res)=>{
    const { id } = req.params;
    if(!req.user._id) return res.json({ message : 'Unauthenticated'})
    
    
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id'); 
    
    const post = await PostMessage.findById(id);
    
    const index = post.likes.findIndex((id) => id === String(req.user._id))
    
    if(index === -1) {
        post.likes.push(req.user._id)
    }else{
        post.likes = post.likes.filter((id)=> id !== String(req.user._id))
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true})
    
    res.json(updatedPost);
} 

const getPostBySearch = async(req, res)=>{
    const { searchQuery, tags } = req.query;
    try {
        const title = new RegExp(searchQuery, 'i')

        const posts = await PostMessage.find({ $or: [ { title }, { tags: { $in: tags.split(',')} }]})

        res.json({ data: posts })

    } catch (error) {
        res.status(401).json({ message: error.message })
    }
}

module.exports = { getPost, createPost, updatePost, deletePost, likePost, getPostBySearch };
