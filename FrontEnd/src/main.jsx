import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from 'react-router-dom';
import './index.css';

import App from './App.jsx';

import Login from './Auth/login.jsx';
import Singin from './Auth/singin.jsx';
import ContextProvider from './components/appContextProvider.jsx';
import AccountDetail from './Pages/AccountDetail.jsx';
import ProfileUpdate from './Pages/updateProfile.jsx';
import AddPost from './Pages/AddPost.jsx';
import AllPostsPage from './Pages/AllPostPages.jsx';
import MyPosts from './Pages/MyPosts.jsx';
import EditPost from './Pages/editPost.jsx';
import PageNotFound from './Pages/PageNotFound.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index="true" element={<AllPostsPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signin" element={<Singin />} />
      <Route path="/detail" element={<AccountDetail />} />
      <Route path="/update" element={<ProfileUpdate />} />
      <Route path="/my-posts" element={<MyPosts />} />
      <Route path="/post-create" element={<AddPost />} />
      <Route path="/edit-post" element={<EditPost />} />
      <Route path="*" element={<PageNotFound />} />
    </Route>
  )
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ContextProvider>
      <RouterProvider router={router} />
    </ContextProvider>
  </StrictMode>
);
