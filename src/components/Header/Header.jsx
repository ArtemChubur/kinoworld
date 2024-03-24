import React from 'react';
import logo from '../../assets/logo.png'
import './Header.css'

function Header(props) {
    return (
        <header>
            <a href="/"><img className={'HeaderLogo'} src={logo} alt=""/></a>
            <h1>KINOWORLD</h1>
            <div></div>
        </header>
    );
}

export default Header;