import React, { useState, useEffect, useContext } from 'react';
import { ThumbsUp, MessageSquare, Share2, Send } from 'lucide-react';
import {
  getPost,
  likePost,
  addComment,
  updateComment,
  getComment,
  commentDelete,
} from '../../serverLayer';
import { appContext } from '../components/appContext';
import '../App.css';

const AllPostsPage = () => {
  const [allData, setAllData] = useState([]);
  const { user, loading } = useContext(appContext);
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [activeMenu, setActiveMenu] = useState(null); // currently open 3-dot menu
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      const allPost = await getPost();
      setAllData(allPost || []);
    };
    fetchPosts();
  }, []);

  async function postLikeByUser(id, viewerId) {
    await likePost(id, viewerId);
    const allPost = await getPost();
    setAllData(allPost || []);
  }

  async function comment(id, viewerId, name, pic) {
    await addComment(id, viewerId, name, pic, commentText);
    setCommentText('');
    const allPost = await getPost();
    setAllData(allPost || []);
  }

  async function editComment(id, c_id) {
    const result = await getComment(id, c_id);
    setCommentText(result);
    setEdit(true);
  }

  async function updateTheComment(id, c_id) {
    await updateComment(id, c_id, commentText);
    setCommentText('');
    setEdit(false);
    const allPost = await getPost();
    setAllData(allPost || []);
  }

  async function deleteComment(id, c_id) {
    await commentDelete(id, c_id);
    const allPost = await getPost();
    setAllData(allPost || []);
  }

  const timeAgo = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffMs = now - postDate;

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return postDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="relative w-20 h-20">
          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-slate-700 border-t-cyan-500 animate-spin"></div>

          {/* Inner Pulse */}
          <div className="absolute inset-3 rounded-full bg-cyan-500 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-white flex justify-center px-4 py-8">
      <div className="w-full max-w-2xl space-y-6">
        {allData.map((post) => (
          <div
            key={post._id}
            className="bg-slate-800 rounded-2xl shadow-lg overflow-hidden border border-slate-700"
          >
            {/* Post Header */}
            <div className="flex items-center space-x-3 px-5 py-4 border-b border-slate-700">
              <div className="w-12 h-12 rounded-full bg-cyan-500 flex items-center justify-center font-bold overflow-hidden">
                {post.author?.pic ? (
                  <img
                    src={post.author.pic.url}
                    alt="profile"
                    className="rounded-full w-12 h-12 object-cover"
                  />
                ) : (
                  <span>U</span>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-white text-base leading-tight">
                  {post.author?.name || 'Unknown User'}
                </h3>
                <p className="text-xs text-gray-400">{timeAgo(post.date)}</p>
              </div>
            </div>

            {/* Post Content */}
            <div className="px-5 py-4 space-y-3 max-w-2xl">
              <h2 className="text-lg font-semibold break-words">
                {post.title}
              </h2>
              <p className="text-gray-300 leading-relaxed break-words">
                {post.description}
              </p>

              {/* Video */}
              {post.video && (
                <video
                  controls
                  className="rounded-xl max-w-full max-h-[400px] object-contain mx-auto"
                >
                  <source src={post.video.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}

              {/* Image */}
              {post.pic && (
                <img
                  src={post.pic.url}
                  alt="post"
                  className="rounded-xl max-w-full max-h-[400px] object-contain mx-auto"
                />
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-2">
                {post.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-slate-700 text-cyan-400 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="flex justify-between items-center px-5 pb-3 border-t border-slate-700">
              <button className="text-gray-400 text-sm">
                👍 {post.like.length || 0} Likes
              </button>
              <p className="text-gray-400 text-sm">
                💬 {post.comment?.length || 0} Comments
              </p>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-4 text-gray-400 text-sm font-medium border-t border-slate-700">
              <button
                className={`flex items-center justify-center gap-2 py-3 hover:bg-slate-700 transition ${
                  post.like.includes(user?.id) ? 'text-cyan-400' : ''
                }`}
                onClick={() => postLikeByUser(post._id, user?.id)}
              >
                <ThumbsUp size={18} /> Like
              </button>

              <button
                className="flex items-center justify-center gap-2 py-3 hover:bg-slate-700 transition"
                onClick={() => setActiveCommentPost(post._id)}
              >
                <MessageSquare size={18} /> Comment
              </button>

              <button className="flex items-center justify-center gap-2 py-3 hover:bg-slate-700 transition">
                <Share2 size={18} /> Share
              </button>
              <button className="flex items-center justify-center gap-2 py-3 hover:bg-slate-700 transition">
                <Send size={18} /> Send
              </button>
            </div>

            {/* Comments Section */}
            {activeCommentPost === post._id && (
              <div className="px-5 pb-4">
                {/* Comment Input */}
                <textarea
                  placeholder="Write a comment..."
                  rows={1}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full mt-3 px-4 py-2 pr-6 rounded-xl bg-slate-700 text-white 
                    focus:outline-none focus:ring-2 focus:ring-cyan-400 
                    resize-none overflow-y-auto"
                />

                {/* Post Button */}
                <div className="flex justify-end mt-3">
                  {edit ? (
                    <button
                      className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 
                      text-white rounded-xl font-medium 
                      transition-colors duration-200"
                      onClick={() => {
                        updateTheComment(post._id, activeMenu);
                        setActiveMenu(null);
                        setCommentText('');
                      }}
                    >
                      Edit
                    </button>
                  ) : (
                    <button
                      className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 
                      text-white rounded-xl font-medium 
                      transition-colors duration-200"
                      onClick={() => {
                        comment(post._id, user?.id, user?.name, user?.pic);
                        setCommentText('');
                      }}
                    >
                      Post
                    </button>
                  )}
                </div>

                {/* Show Comments */}
                <div className="mt-5 space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {post.comment && post.comment.length > 0 ? (
                    post.comment.map((cmt, index) => (
                      <div key={index} className="flex items-start gap-3">
                        {/* Profile Pic */}
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-cyan-500 flex-shrink-0">
                          {cmt.pic ? (
                            <img
                              src={cmt.pic}
                              alt="profile"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="flex items-center justify-center w-full h-full text-white font-bold">
                              {cmt.name ? cmt.name.charAt(0) : 'U'}
                            </span>
                          )}
                        </div>

                        {/* Comment Content */}
                        <div className="bg-slate-700 px-4 py-2 rounded-2xl w-full flex justify-between items-start">
                          <div>
                            <p className="text-sm font-semibold text-cyan-400">
                              {cmt.name || 'Unknown User'}
                            </p>
                            <p className="text-gray-200 text-sm">
                              {cmt.comment}
                            </p>
                          </div>

                          {/* 3-dot menu */}
                          {cmt.u_id === user?.id && (
                            <div className="relative">
                              <button
                                className="text-gray-400 hover:text-white p-1"
                                onClick={() =>
                                  setActiveMenu(
                                    activeMenu === cmt._id ? null : cmt._id
                                  )
                                }
                              >
                                ⋮
                              </button>

                              {/* Dropdown menu */}
                              {activeMenu === cmt._id && (
                                <div className="absolute right-0 mt-2 w-28 bg-slate-800 border border-slate-600 rounded-xl shadow-lg z-10">
                                  <button
                                    className="block w-full text-left px-3 py-2 text-sm hover:bg-slate-700 text-gray-300"
                                    onClick={() => {
                                      editComment(post._id, cmt._id);
                                    }}
                                  >
                                    ✏️ Edit
                                  </button>
                                  <button
                                    className="block w-full text-left px-3 py-2 text-sm hover:bg-slate-700 text-red-400"
                                    onClick={() =>
                                      deleteComment(post._id, cmt._id)
                                    }
                                  >
                                    🗑️ Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">
                      No comments yet. Be the first!
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllPostsPage;
