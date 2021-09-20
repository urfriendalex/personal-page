import React from 'react';
import { splitToSpans } from './tools/functions';
import { useSelector } from 'react-redux';

const Navigation = ({ navActive, setNavActive }) => {
    const scroll = useSelector((state) => state.scroll.scrollInstanse);
    return (
        <nav className={`navFull${navActive ? ' active' : ''}`}>
            <div className='navItem'>
                <a
                    href='#about'
                    onClick={(event) => {
                        event.preventDefault();
                        scroll.scrollTo(document.querySelector('#about'));
                        setNavActive(!navActive);
                    }}>
                    {splitToSpans('about', '', 'main-text')}
                    {splitToSpans('about', '', 'second-text')}
                </a>
            </div>
            <div className='navItem'>
                <a
                    href='#projects'
                    onClick={(event) => {
                        event.preventDefault();
                        scroll.scrollTo(document.querySelector('#projects'));
                        setNavActive(!navActive);
                    }}>
                    {splitToSpans('projects', '', 'main-text')}
                    {splitToSpans('projects', '', 'second-text')}
                </a>
            </div>
            <div className='navItem'>
                <a
                    href='#contact'
                    onClick={(event) => {
                        event.preventDefault();
                        scroll.scrollTo(
                            document.querySelector('#contact-details-scroll')
                        );
                        setNavActive(!navActive);
                    }}>
                    {splitToSpans('contact', '', 'main-text')}
                    {splitToSpans('contact', '', 'second-text')}
                </a>
            </div>
        </nav>
    );
};

export default Navigation;
