import React, { useState } from 'react';
import Header from './Header';
import Hero from './Hero';
import Navigation from './Navigation';
import Projects from '../components/Projects';
import Contact from '../components/Contact';

const Landing = () => {
    const [navActive, setNavActive] = useState(false);
    return (
        <div className='landing'>
            <Header navActive={navActive} setNavActive={setNavActive} />
            <Navigation navActive={navActive} setNavActive={setNavActive} />
            <div id='main-container' data-scroll-container>
                <Hero />
                <Projects />
                <Contact />
            </div>
        </div>
    );
};

export default Landing;
