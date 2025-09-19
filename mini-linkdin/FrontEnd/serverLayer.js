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

    const res = await fetch(`/api/user-sign-in`, {
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
    const res = await fetch(`/api/user-login`, {
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
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const loginStatusHandling = async () => {
  try {
    const res = await fetch(`/api/login-status`, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching login status:', error);
  }
};

export const logoutHandling = async () => {
  try {
    const res = await fetch(`/api/logout`, {
      method: 'DELETE',
      credentials: 'include',
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching logout:', error);
  }
};

export const accountDetail = async (id) => {
  try {
    const res = await fetch(`/api/detail`, {
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

    const res = await fetch(`/api/update-profile`, {
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
    const res = await fetch(`/api/account-delete`, {
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
    console.log(error);
    return error;
  }
};

export const addPost = async (author, title, description, tags, pic, video) => {
  try {
    const formatedData = new FormData();
    formatedData.append('author', author);
    formatedData.append('title', title);
    formatedData.append('description', description);
    formatedData.append('tags', tags);
    if (pic) formatedData.append('postPic', pic);
    if (video) formatedData.append('video', video);

    const res = await fetch(`/api/add-post`, {
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
    const res = await fetch(`/api/get-post`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    return data.DATA;
  } catch (error) {
    console.error('Error fetching post:', error);
  }
};

export const likePost = async (id, viewerId) => {
  try {
    const res = await fetch(`/api/like-post`, {
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
    console.error('Error liking post:', error);
  }
};

export const addComment = async (id, viewerId, name, pic, comment) => {
  try {
    const res = await fetch(`/api/add-comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        viewerId,
        name,
        pic,
        comment,
      }),
    });
    return await res.json();
  } catch (error) {
    console.error('Error adding comment:', error);
  }
};

export const updateComment = async (id, c_id, message) => {
  try {
    const res = await fetch(`/api/update-comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        c_id,
        message,
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
    const res = await fetch(`/api/get-comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, c_id }),
    });
    const data = await res.json();
    return data.comment;
  } catch (error) {
    console.error('Error getting comment:', error);
  }
};

export const commentDelete = async (postId, commentId) => {
  try {
    const res = await fetch(`/api/delete-comment`, {
      method: 'POST',
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

    return await res.json();
  } catch (error) {
    console.error('Error deleting comment:', error);
    return { status: 500, message: 'Something went wrong' };
  }
};

export const myPost = async (userId) => {
  try {
    const res = await fetch(`/api/my-post`, {
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
    const res = await fetch(`/api/delete-post`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
    return await res.json();
  } catch (error) {
    console.error('Error deleting post:', error);
    return { status: 500, message: 'Something went wrong' };
  }
};

export const getForEditPost = async (id) => {
  try {
    const res = await fetch(`/api/get-edit-post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
    return await res.json();
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

    const res = await fetch(`/api/update-post`, {
      method: 'PUT',
      body: formatedData,
      credentials: 'include',
    });

    return await res.json();
  } catch (error) {
    console.error('Error updating post:', error);
    return { status: 500, message: 'Something went wrong' };
  }
};
