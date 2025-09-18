const POST = require('../module/postShema');
const fs = require('fs');
const path = require('path');
const { cloudinary } = require('../util/cloudinary');
exports.addPostController = async (req, res) => {
  try {
    const { author, title, description, tags } = req.body;
    const { postPic, video } = req.files || {};

    if (!author || !title) {
      return res.status(400).json({
        success: false,
        msg: 'Author and title are required',
      });
    }

    let picData = null;
    let videoData = null;

    // === Upload image ===
    if (postPic && postPic[0]) {
      try {
        const result = await cloudinary.uploader.upload(postPic[0].path, {
          folder: 'posts/images',
        });

        fs.unlink(postPic[0].path, (err) => {
          if (err) console.error('Error deleting local image:', err);
        });

        picData = { url: result.secure_url, pic_id: result.public_id };
      } catch (err) {
        console.error('Image upload failed:', err);
      }
    }

    // === Upload video ===
    if (video && video[0]) {
      try {
        const result = await cloudinary.uploader.upload(video[0].path, {
          folder: 'posts/videos',
          resource_type: 'video',
        });

        fs.unlink(video[0].path, (err) => {
          if (err) console.error('Error deleting local video:', err);
        });

        videoData = { url: result.secure_url, video_id: result.public_id };
      } catch (err) {
        console.error('Video upload failed:', err);
        videoData = null;
      }
    }

    // === Create post ===
    const post = new POST({
      author,
      date: new Date(),
      title,
      description,
      tags: tags ? tags.split(',').map((t) => t.trim()) : [],
      pic: picData,
      video: videoData,
    });

    await post.save();

    return res.status(201).json({
      success: true,
      msg: 'Post successfully created',
      post,
    });
  } catch (err) {
    console.error('Error in addPostController:', err);
    return res.status(500).json({
      success: false,
      msg: 'Server error',
      error: err.message,
    });
  }
};

exports.getAllPostController = async (req, res) => {
  try {
    const posts = await POST.find().populate('author', 'name pic');
    // console.log(posts);

    res.status(200).json({
      status: 200,
      message: 'Successfully fetched data',
      DATA: posts,
    });
  } catch (error) {
    console.error('Error in getAllPostController:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.likeController = async (req, res) => {
  try {
    const { id, viewerId } = req.body;

    const post = await POST.findById(id);
    if (!post) {
      return res.status(404).json({ status: 404, message: 'Post not found' });
    }

    // check if viewerId already exists in like array
    const alreadyLiked = post.like.includes(viewerId);

    if (alreadyLiked) {
      // unlike → remove viewerId
      post.like = post.like.filter((uid) => uid.toString() !== viewerId);
    } else {
      // like → add viewerId
      post.like.push(viewerId);
    }

    await post.save();

    res.status(200).json({
      status: alreadyLiked ? 201 : 200,
      message: alreadyLiked ? 'Unliked successfully' : 'Liked successfully',
      likesCount: post.like.length,
      likes: post.like,
    });
  } catch (error) {
    console.error('Error in likeController:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.commentController = async (req, res) => {
  try {
    const { id, viewerId, name, pic, comment } = req.body;
    const data = await POST.findById(id);
    if (!data) {
      return res.status(404).json({ status: 404, message: 'Post not found' });
    }
    // console.log(id, viewerId, name, pic, comment);

    const informationRequired = {
      u_id: viewerId,
      comment: comment,
      name: name,
      pic: pic,
    };
    data.comment.push(informationRequired);
    await data.save();
    return res.status(200).json({ status: 200, message: 'Successfully Added' });
  } catch (error) {
    console.error('Error in likeController:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const { id, c_id, message } = req.body; // postId, commentId, newMessage

    const data = await POST.findById(id);
    if (!data) {
      return res.status(404).json({ status: 404, message: 'Post not found' });
    }

    // Find the comment inside post
    const comment = data.comment.id(c_id); // Mongoose gives direct access by subdocument id
    if (!comment) {
      return res
        .status(404)
        .json({ status: 404, message: 'Comment not found' });
    }

    // Update the comment
    comment.comment = message;

    // Save changes
    await data.save();

    return res.status(200).json({
      status: 200,
      message: 'Comment updated successfully',
      updatedComment: comment,
    });
  } catch (error) {
    console.error('Error in updateComment:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.getCommentById = async (req, res) => {
  try {
    const { id, c_id } = req.body; // postId, commentId

    const data = await POST.findById(id);
    if (!data) {
      return res.status(404).json({ status: 404, message: 'Post not found' });
    }

    const comment = data.comment.id(c_id).comment;
    if (!comment) {
      return res
        .status(404)
        .json({ status: 404, message: 'Comment not found' });
    }

    return res.status(200).json({
      comment,
    });
  } catch (error) {
    console.error('Error in getCommentById:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { id, c_id } = req.body; // postId, commentId
    const data = await POST.findById(id);

    if (!data) {
      return res.status(404).json({ status: 404, message: 'Post not found' });
    }

    // Find the comment

    data.comment = data.comment.filter((cmt) => cmt._id != c_id);
    await data.save();

    return res.status(200).json({
      status: 200,
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    console.error('Error in deleteComment:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

// controller
exports.myPosts = async (req, res) => {
  try {
    const { id } = req.body; // this is user id

    const posts = await POST.find({ author: id });

    return res.status(200).json({
      status: 200,
      message: 'User posts fetched successfully',
      data: posts,
    });
  } catch (error) {
    console.error('Error in myPosts:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { id } = req.body;

    // Find the post
    const post = await POST.findById(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Delete pic from Cloudinary if exists
    if (post.pic && post.pic.pic_id) {
      try {
        await cloudinary.uploader.destroy(post.pic.pic_id);
        console.log('Image deleted from Cloudinary:', post.pic.pic_id);
      } catch (err) {
        console.error('Error deleting image from Cloudinary:', err);
      }
    }

    // Delete video from Cloudinary if exists
    if (post.video && post.video.video_id) {
      try {
        await cloudinary.uploader.destroy(post.video.video_id, {
          resource_type: 'video',
        });
        console.log('Video deleted from Cloudinary:', post.video.video_id);
      } catch (err) {
        console.error('Error deleting video from Cloudinary:', err);
      }
    }

    // Delete post from DB
    await POST.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    console.error('Error in deletePost:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};



exports.findPostById = async (req, res) => {
  try {
    const { id } = req.body;
    const data = await POST.findById(id);

    if (!data) {
      return res.status(404).json({ status: 404, message: 'Post not found' });
    }

    return res.status(200).json({ status: 200, post: data });
  } catch (error) {
    console.error('Error in findPostById:', error);
    return res.status(500).json({ status: 500, message: 'Server error' });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { id, title, description, tags } = req.body;

    // Step 1: Find the post
    const post = await POST.findById(id);
    if (!post) {
      return res.status(404).json({ status: 404, message: 'Post not found' });
    }

    // Step 2: Extract uploaded files
    const { postPic, video } = req.files || {};

    // Step 3: Update text fields
    if (title) post.title = title;
    if (description) post.description = description;
    if (tags) {
      post.tags = tags.split(',').map((t) => t.trim());
    }

    // Step 4: Handle new image
    if (postPic && postPic[0]) {
      // delete old Cloudinary image if exists
      if (post.pic && post.pic.pic_id) {
        try {
          await cloudinary.uploader.destroy(post.pic.pic_id);
          console.log('Old image deleted from Cloudinary');
        } catch (err) {
          console.error('Failed to delete old image:', err);
        }
      }

      // upload new image
      const result = await cloudinary.uploader.upload(postPic[0].path, {
        folder: 'posts/images',
      });

      // cleanup local file
      fs.unlink(postPic[0].path, (err) => {
        if (err) console.error('Error deleting local image:', err);
      });

      post.pic = { url: result.secure_url, pic_id: result.public_id };
    }

    // Step 5: Handle new video

    if (video && video[0]) {
      try {
        const result = await cloudinary.uploader.upload(video[0].path, {
          resource_type: 'video',
          folder: 'posts/videos',
          
        });

        if (result && result.secure_url) {
          post.video = { url: result.secure_url, video_id: result.public_id };
        }

        fs.unlink(video[0].path, (err) => {
          if (err) console.error('Error deleting local video:', err);
        });
      } catch (err) {
        console.error('Video upload failed:', err);
      }
    }

    // Step 6: Save updated post
    await post.save();

    // Step 7: Respond
    return res.status(200).json({
      status: 200,
      message: 'Post updated successfully',
      updatedPost: post,
    });
  } catch (error) {
    console.error('Error in updatePost:', error);
    return res.status(500).json({ status: 500, message: 'Server error' });
  }
};

// if (video && video[0]) {
//   const videoPath = path.resolve(video[0].path).replace(/\\/g, '/'); // ✅ Windows safe
//   try {
//     console.log('Uploading video from:', videoPath);

//     const result = await cloudinary.uploader.upload(videoPath, {
//       resource_type: 'video',
//       folder: 'posts/videos',
//     });

//     console.log('Cloudinary video result:', result);

//     if (result?.secure_url) {
//       videoData = { url: result.secure_url, video_id: result.public_id };
//       console.log('Video uploaded:', videoData);
//     } else {
//       console.error('❌ Video upload returned no result');
//     }

//     fs.unlink(videoPath, (err) => {
//       if (err) console.error('Error deleting local video:', err);
//     });
//   } catch (err) {
//     console.error('❌ Video upload failed:', err);
//   }
// }
