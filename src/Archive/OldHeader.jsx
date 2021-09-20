import React, { useEffect, useRef, useState } from 'react';
import { gsap, Power2 } from 'gsap/all';
import { Tween, Timeline } from 'react-gsap';

const OldHeader = ({ navActive, setNavActive }) => {
    return (
        <header>
            <span role='img' aria-label='hey' id='hey'>
                ✌🏻
            </span>
            <Timeline>
                <svg
                    className='logo'
                    width='80'
                    height='80'
                    viewBox='0 0 385 385'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'>
                    <Tween
                        duration='2'
                        from={{
                            svgDraw: 0,
                        }}
                        to={{
                            svgDraw: 1,
                        }}>
                        <path
                            d='M90 265.45V342.188H203.029'
                            stroke='white'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                        />
                        <path
                            d='M275.527 276V342.175H228'
                            stroke='white'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                        />
                        <path
                            d='M90 217.863V41H275.817V223.102'
                            stroke='white'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                        />
                        <path
                            d='M122 174.477L216 367.477L122 174.477Z'
                            fill='white'
                        />
                    </Tween>
                    <Tween
                        duration='1'
                        from={{
                            svgDraw: 0,
                        }}
                        to={{
                            svgDraw: 1,
                        }}>
                        <path
                            d='M122 174.477L216 367.477'
                            stroke='white'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                        />
                        <path
                            d='M124 169.477L218 362.477L124 169.477Z'
                            fill='white'
                        />
                        <path
                            d='M124 169.477L218 362.477'
                            stroke='white'
                            strokeLinecap='round'
                        />
                        <path
                            d='M262 269.477L168 77.4768L262 269.477Z'
                            fill='white'
                        />
                        <path
                            d='M262 269.477L168 77.4768'
                            stroke='white'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                        />
                        <path
                            d='M170 71.4768L264 265.477L170 71.4768Z'
                            fill='white'
                        />
                        <path
                            d='M170 71.4768L264 265.477'
                            stroke='white'
                            strokeLinecap='round'
                        />
                        <path
                            d='M170 71.4768L76 270.477L170 71.4768Z'
                            fill='white'
                        />
                        <path
                            d='M170 71.4768L76 270.477'
                            stroke='white'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                        />
                        <path
                            d='M353 77.4768L216 367.477L353 77.4768Z'
                            fill='white'
                        />
                        <path
                            d='M353 77.4768L216 367.477'
                            stroke='white'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                        />
                    </Tween>
                </svg>
            </Timeline>
            <div
                onClick={() => setNavActive(!navActive)}
                className={['hamburger', navActive ? 'active' : ''].join(' ')}>
                <span className='icon-bar'></span>
                <span className='icon-bar'></span>
                <span className='icon-bar'></span>
            </div>
            <nav className='nav-slider'>
                <ul className='nav-links'>
                    <li>
                        <a href='#home' className='scroll'>
                            Home
                        </a>
                    </li>
                    <li>
                        <a href='#about' className='scroll'>
                            About
                        </a>
                    </li>
                    <li>
                        <a href='#catalog' className='scroll'>
                            Catalog
                        </a>
                    </li>
                    <li>
                        <a href='#contact' className='scroll'>
                            Contact
                        </a>
                    </li>
                </ul>
                {/* <ul class="social-media">
        <li><a><i class="fa fa-facebook"></i></a></li>
        <li><a><i class="fa fa-twitter"></i></a></li>
        <li><a><i class="fa fa-telegram"></i></a></li>
    </ul>         */}
            </nav>
        </header>
    );
};

export default OldHeader;
