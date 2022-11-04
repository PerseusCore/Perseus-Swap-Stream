import * as React from 'react'
import logo1 from './superfluid-logo.png';
import './navbar.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="per__navbar">
      <div className="per__navbar-links"></div>
        <div className="per__navbar-links_logo">
          <img src={logo1} alt="logo" />
        </div>
        <div className="per__navbar-links_container">
            <p><Link to="/">Mainnet Bridge</Link></p>
            <p><Link to="/testnet">Testnet Bridge</Link></p>
        </div>
    </div>
  )
}

export default Navbar