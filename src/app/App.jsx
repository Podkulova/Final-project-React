import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home'; // Vaše domácí stránka nebo komponenta
import PrivateRoute from './components/PrivateRoute'; // Komponenta pro ochranu privátních stránek

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
            </Routes>
        </Router>
    );
};

export default App;
