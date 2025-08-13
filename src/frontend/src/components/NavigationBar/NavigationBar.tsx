import React from 'react';
import './styles.css';
import { useLocation, Link } from "@tanstack/react-router";

const NavigationBar = () => {
    const location = useLocation();

    return (
        <nav className="navigation_container">
            <Link to="/" className={`link ${location.pathname === '/' ? 'active' : ''}`}>
                Home
            </Link>
            <Link to="/skills" className={`link ${location.pathname === '/skills' ? 'active' : ''}`}>
                Skills
            </Link>
            <Link to="/hobbies" className={`link ${location.pathname === '/hobbies' ? 'active' : ''}`}>
                Hobbies
            </Link>
        </nav>
    );
};

export default NavigationBar;
