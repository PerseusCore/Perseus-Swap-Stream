import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import SuperfluidStream from './components/SuperfluidStream';
import SuperfluidStreamTest from './components/SuperfluidStreamTest';

function App() {
  return (
    <Router>
      <Routes>
         <Route path='*' element={<SuperfluidStream />} />
         <Route path='/testnet/*' element={<SuperfluidStreamTest />} />
      </Routes>
    </Router>
  );
}

export default App;