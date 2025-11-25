import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Auth from './pages/Auth';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import PlaceholderPage from './pages/PlaceholderPage';

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/" element={<Home />} />
      <Route path="/explore" element={<PlaceholderPage title="Explore" />} />
      <Route path="/notifications" element={<PlaceholderPage title="Notifications" />} />
      <Route path="/messages" element={<PlaceholderPage title="Messages" />} />
      <Route path="/bookmarks" element={<PlaceholderPage title="Bookmarks" />} />
      <Route path="/lists" element={<PlaceholderPage title="Lists" />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/more" element={<PlaceholderPage title="More" />} />
    </Routes>
  );
}

export default App;
