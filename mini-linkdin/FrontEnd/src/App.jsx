import React from 'react';
import Header from './components/Header';
import Footer from './components/footer';
import { Toaster } from 'react-hot-toast';
import { Outlet } from 'react-router-dom';
const App = () => {
  return (
    <>
      <Header />

      <Outlet />
      <Toaster
        position="top-right"
        containerClassName="mt-16"
        reverseOrder={false}
      />
      <Footer/>
    </>
  );
};

export default App;
