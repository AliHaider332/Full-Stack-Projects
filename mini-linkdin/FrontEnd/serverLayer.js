const server = import.meta.env.VITE_SERVER;
console.log('Server URL:', server);

export const signInHandling = async (
  name,
  email,
  phone,
  address,
  password,
  confirmPassword,
  pic
) => {
  try {
    const formatedData = new FormData();
    formatedData.append('name', name.current.value);
    formatedData.append('email', email.current.value);
    formatedData.append('phone', phone.current.value);
    formatedData.append('address', address.current.value);
    formatedData.append('password', password.current.value);
    formatedData.append('confirmPassword', confirmPassword.current.value);
    formatedData.append('pic', pic.current.files[0]);
    const res = await fetch(`${server}/api/user-sign-in`, {
      method: 'POST',
      body: formatedData,
    });
    const data = await res.json();
    let message = null;
    if (data.errors) {
      message = data;
    } else if (data.message) {
      message = { status: data.status, errors: [{ message: data.message }] };
    }
    return message;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const loginHandling = async (email, password) => {
  try {
    const res = await fetch(`${server}/api/user-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        email: email.current.value,
        password: password.current.value,
      }),
      credentials: 'include',
    });
    const data = await res.json();
    // console.log(data);

    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const loginStatusHandling = async () => {
  try {
    const res = await fetch(`${server}/api/login-status`, {
      method: 'GET',
      credentials: 'include',
    });

    const data = await res.json();
    console.log(data);

    return data;
  } catch (error) {
    console.error('Error fetching login status:', error);
  }
};

export const logoutHandling = async () => {
  try {
    const res = await fetch(`${server}/api/logout`, {
      method: 'DELETE',
      credentials: 'include',
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching login status:', error);
  }
};

export const accountDetail = async (id) => {
  try {
    const res = await fetch(`${server}/api/detail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    return data.user;
  } catch (error) {
    console.error('Error fetching account details:', error);
  }
};

export const updateProfile = async (
  id,
  name,
  email,
  phone,
  address,
  password,
  confirmPassword,
  pic
) => {
  try {
    const formatedData = new FormData();
    formatedData.append('id', id);
    formatedData.append('name', name);
    formatedData.append('email', email);
    formatedData.append('phone', phone);
    formatedData.append('address', address);
    formatedData.append('password', password);
    formatedData.append('confirmPassword', confirmPassword);
    formatedData.append('pic', pic);
    const res = await fetch(`${server}/api/update-profile`, {
      method: 'PATCH',
      body: formatedData,
    });
    const data = await res.json();
    let message = null;
    if (data.errors) {
      message = data;
    } else if (data.message) {
      message = { status: data.status, errors: [{ message: data.message }] };
    }
    return message;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const accountDelete = async (id, password) => {
  try {
    const res = await fetch(`${server}/api/account-delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
        password: password,
      }),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(err);
    return err;
  }
};

export const addPost = async (author, title, description, tags, pic, video) => {
  try {
    const formatedData = new FormData();
    formatedData.append('author', author),
      formatedData.append('title', title),
      formatedData.append('description', description),
      formatedData.append('tags', tags);
    if (pic) formatedData.append('postPic', pic);
    if (video) formatedData.append('video', video);
    const res = await fetch(`${server}/api/add-post`, {
      method: 'POST',
      body: formatedData,
      credentials: 'include',
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getPost = async () => {
  try {
    const res = await fetch(`${server}/api/get-post`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();

    return data.DATA; // return it if you want to use outside
  } catch (error) {
    console.error('Error fetching post:', error);
  }
};

export const likePost = async (id, viewerId) => {
  try {
    const res = await fetch(`${server}/api/like-post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
        viewerId: viewerId,
      }),
    });

    const data = await res.json();
    return data.status;
  } catch (error) {
    console.error('Error fetching post:', error);
  }
};

export const addComment = async (id, viewerId, name, pic, comment) => {
  try {
    const res = await fetch(`${server}/api/add-comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
        viewerId: viewerId,
        name: name,
        pic: pic,
        comment: comment,
      }),
    });
  } catch (error) {
    console.error('Error fetching post:', error);
  }
};

export const updateComment = async (id, c_id, message) => {
  try {
    const res = await fetch(`${server}/api/update-comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
        c_id: c_id,
        message: message, // ✅ include updated message
      }),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error updating comment:', error);
  }
};

export const getComment = async (id, c_id) => {
  try {
    const res = await fetch(`${server}/api/get-comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
        c_id: c_id,
      }),
    });
    const data = await res.json();
    return data.comment;
  } catch (error) {
    console.error('Error updating comment:', error);
  }
};

export const commentDelete = async (postId, commentId) => {
  try {
    const res = await fetch(`${server}/api/delete-comment`, {
      method: 'POST', // You can also use DELETE with body, but POST is fine
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: postId,
        c_id: commentId,
      }),
    });

    if (!res.ok) {
      throw new Error(`Error ${res.status}: Failed to delete comment`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error deleting comment:', error);
    return { status: 500, message: 'Something went wrong' };
  }
};

export const myPost = async (userId) => {
  try {
    const res = await fetch(`${server}/api/my-post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: userId }),
    });

    const data = await res.json();

    return data.data;
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return { status: 500, message: 'Something went wrong' };
  }
};

export const deletePost = async (id) => {
  try {
    const res = await fetch(`${server}/api/delete-post`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
      }),
    });
    const data = await res.json();
  } catch (error) {
    console.error('Error deleting comment:', error);
    return { status: 500, message: 'Something went wrong' };
  }
};

export const getForEditPost = async (id) => {
  try {
    const res = await fetch(`${server}/api/get-edit-post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    const data = await res.json();

    return data;
  } catch (error) {
    console.error('Error fetching post for edit:', error);
    return { status: 500, message: 'Something went wrong' };
  }
};

export const updatePost = async (id, title, description, tags, pic, video) => {
  try {
    const formatedData = new FormData();

    formatedData.append('id', id);
    formatedData.append('title', title);
    formatedData.append('description', description);
    formatedData.append('tags', tags);

    if (pic) formatedData.append('postPic', pic);
    if (video) formatedData.append('video', video);

    const res = await fetch(`${server}/api/update-post`, {
      method: 'PUT',
      body: formatedData,
      credentials: 'include',
    });

    const data = await res.json();

    return data;
  } catch (error) {
    console.error('Error updating post:', error);
    return { status: 500, message: 'Something went wrong' };
  }
};
