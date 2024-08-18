import { useEffect, useState } from 'react'
import{BrowserRouter, Navigate , Route, Routes} from 'react-router-dom'
import {connect} from 'react-redux'
import { CheckAuthenticated, load_user } from './actions/auth'
import './App.css'
import Home from './Container/home'
import Chat from './Container/chat'
import Activate from './Container/activate'
import Login from './Container/login'
import Signup from './Container/signup'
import ResetPassword from './Container/resetpassowrd'
import ResetPasswordConfirm from './Container/resetpassowrdConfirm'
import ErrorBoundary from './Components/error'

import { Provider }  from 'react-redux'
import Store from './store'
import Job from './Container/job'
import House from './Container/house'

function App(props) {
  // useEffect(() => {
  //   props.CheckAuthenticated();
  //   props.load_user();

  // },[])
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load',()=> {
        navigator.serviceWorker.register('/service-worker.js',{ type: 'module' });
      })
    }

  },[])

  const cacheName = "b-intell-shell-v1.0";
  //The files I'm going to cache
  const filesToCache = [
    "./Container/login.jsx",
    "./Container/home.jsx",
    "./Container/job.jsx",
    "./Components/navbar.jsx",
    "./Components/error.jsx",
    "./Components/notifier.jsx",
  ];

  self.addEventListener("install", e => {
    console.log("[ServiceWorker] - Install");
    e.waitUntil((async () => {
      const cache = await caches.open(cacheName);
      //console.log("[ServiceWorker] - Caching app shell");
      await cache.addAll(filesToCache);
    })());
  });

  self.addEventListener("activate", e => {
    e.waitUntil((async () => {
      // Get a list of all your caches in your app
      const keyList = await caches.keys();
      await Promise.all(
        keyList.map(key => {
          //console.log(key);
          /* 
             Compare the name of your current cache you are iterating through
             and your new cache name
          */
          if (key !== cacheName) {
            //console.log("[ServiceWorker] - Removing old cache", key);
            return caches.delete(key);
          }
        })
      );
    })());
    e.waitUntil(self.clients.claim());
  });

  navigator.serviceWorker.register('./service-worker.js').then((registration)=> {
    if (registration.active) {
        //console.log('Service worker is active');
      }
  });


  return (
    <>
      <Provider store={Store} >
        <BrowserRouter>
            <Routes>
              <Route path="/" index element={<Navigate to="/login" />} />
              {/* <Route path="/home" element={ <ErrorBoundary> <Home /> </ErrorBoundary> } /> */}
              <Route path="/jobs" element={ <Job />} />
              <Route path="/signup" element={<Signup />} />
              <Route  path='/login' element={<Login />}  />
              <Route exact path='/reset_password' element={<ResetPassword />} />
              <Route exact path='/password/reset/confirm/:uid/:token' element={<ResetPasswordConfirm />} />
              <Route exact path='/activate/:uid/:token' element={<Activate />} />
                         
              </Routes>
          </BrowserRouter>
      </Provider>
    </>
  )
}

export default App
// export default connect(null, {CheckAuthenticated, load_user})(App)
