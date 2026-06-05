import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import AIRecommendation from './pages/AIRecommendation';
import BrandStory from './pages/BrandStory';
import StoryList from './pages/StoryList';
import StoryDetail from './pages/StoryDetail';
import Stores from './pages/Stores';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="app">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/recommend" element={<AIRecommendation />} />
            <Route path="/story" element={<BrandStory />} />
            <Route path="/stories" element={<StoryList />} />
            <Route path="/stories/:id" element={<StoryDetail />} />
            <Route path="/stores" element={<Stores />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
