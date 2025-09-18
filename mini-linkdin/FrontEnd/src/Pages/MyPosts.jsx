import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { appContext } from '../components/appContext';
import { myPost, deletePost } from '../../serverLayer';

const MyPosts = () => {
  const navigation = useNavigate();
  const { loginStatus, user, loading, fetchEditData } = useContext(appContext);
  const [posts, getAllPost] = useState(null);
  const [fetching, setFetching] = useState(false); // extra loading state

  useEffect(() => {
    if (!loading && (!loginStatus || !user)) {
      navigation('/login');
      return;
    }

    async function getMyPost(id) {
      try {
        setFetching(true);
        const data = await myPost(id);
        getAllPost(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setFetching(false);
      }
    }

    if (user?.id) {
      getMyPost(user?.id);
    }
  }, [loginStatus, user, loading, navigation]);

  if (!loginStatus || !user) {
    return null;
  }

  async function postDelete(id) {
    try {
      setFetching(true);
      await deletePost(id);
      const data = await myPost(user.id);
      getAllPost(data);
    } catch (error) {
      console.error('Error deleting post:', error);
    } finally {
      setFetching(false);
    }
  }

  async function editPost(id) {
    fetchEditData(id);
    navigation('/edit-post');
  }

  // 🔄 Show spinner if fetching or initial loading
  if (loading || fetching) {
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
    <div className="min-h-screen text-white px-6 py-10 w-full md:w-[80%] lg:w-[60%] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-slate-800 Caprasimo">
          My Posts
        </h1>
      </div>

      {/* Posts */}
      <div className="space-y-10">
        {posts?.map((post) => (
          <div key={post._id} className="bg-slate-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-white mb-2 Roboto">
              {post.title}
            </h2>
            <p className="text-gray-400 text-sm mb-4 Prompt">
              {new Date(post.date).toLocaleDateString()}
            </p>
            <p className="text-gray-200 mb-4 Roboto">{post.description}</p>

            {/* Media */}
            <div className="flex justify-center">
              <div className="w-full max-w-3xl space-y-4 mb-4">
                {post.pic && (
                  <img
                    src={post.pic.url}
                    alt="Post"
                    className="w-full h-auto max-h-[500px] object-contain rounded-lg shadow-md"
                  />
                )}
                {post.video && (
                  <video
                    src={post.video.url}
                    controls
                    className="w-full h-auto max-h-[500px] object-contain rounded-lg shadow-md"
                  />
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-cyan-600 text-white text-xs px-3 py-1 rounded-full Prompt"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Like & Comment Section */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-4">
                <button className="flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition">
                  👍 <span>{post.like.length}</span>
                </button>
                <button className="flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition">
                  💬 <span>{post.comment.length}</span>
                </button>
              </div>
            </div>

            {/* Actions (Edit/Delete) */}
            <div className="flex gap-4">
              <button
                className="bg-cyan-500 hover:bg-cyan-600 px-5 py-2 rounded-full font-medium Prompt transition transform hover:scale-105"
                onClick={() => editPost(post._id)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-full font-medium Prompt transition transform hover:scale-105"
                onClick={() => postDelete(post._id)}
              >
                Delete
              </button>
            </div>

            {/* Comments */}
            {post.comment.length > 0 && (
              <div className="mt-6 border-t border-slate-700 pt-4">
                <p className="text-gray-400 mb-2">Comments</p>
                <div className="space-y-4">
                  {post.comment.map((item, index) => (
                    <div
                      key={`${post._id}-comment-${index}`}
                      className="flex items-start gap-3 bg-slate-700 px-4 py-3 rounded-lg"
                    >
                      <img
                        src={item.pic ? item.pic : '/default-avatar.png'}
                        alt={item.name || 'User'}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-cyan-400">
                          {item.name || 'Anonymous'}
                        </p>
                        <p className="text-sm text-gray-200">{item.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Floating Create Post Button */}
      <Link
        to="/post-create"
        className="fixed bottom-6 right-6 bg-cyan-500 hover:bg-cyan-600 text-white p-4 rounded-full shadow-xl transition-transform transform hover:scale-110"
      >
        <PlusCircle size={28} />
      </Link>
    </div>
  );
};

export default MyPosts;
