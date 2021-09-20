import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { switchBgVersion } from '../redux/actions/uiActions';

const Contact = () => {
    const bgVersion = useSelector((state) => state.UI.bgVersion);
    const dispatch = useDispatch();
    return (
        <section
            data-scroll-section
            data-scroll
            data-scroll-class='scrolled'
            data-persistent
            data-scroll-section-id='section3'
            data-scroll-offset='300%'
            data-scroll-call='toggleLights'
            data-scroll-repeat
            id='contact'
            className={`bg-dark`}>
            {[1, 2, 3, 4, 5].map((number) => (
                <div
                    key={number}
                    id={`section-titlte-scroll-${number}`}
                    className='section-title'>
                    <div
                        className='line'
                        data-scroll
                        data-scroll-sticky
                        data-scroll-target={`#section-titlte-scroll-${number}`}>
                        <span>Contact</span>
                        <span className='second-word'>Me</span>
                        <span>Contact</span>
                        <span className='second-word'>Me</span>
                        <span>Contact</span>
                        <span className='second-word'>Me</span>
                        <span>Contact</span>
                        <span className='second-word'>Me</span>
                    </div>
                </div>
            ))}
            <div id='contact-details-scroll'>
                <div
                    data-scroll
                    data-scroll-sticky
                    data-scroll-target='#contact-details-scroll'
                    className='contact-details-wrapper'>
                    <div className='sayHi-container'>
                        <div className='text'>
                            <span
                                data-scroll
                                data-scroll-direction='horizontal'
                                data-scroll-speed='-2'>
                                SAY HI
                            </span>
                            <span
                                data-scroll
                                data-scroll-direction='horizontal'
                                data-scroll-speed='2'>
                                ANYTIME -
                                <div
                                    data-scroll
                                    data-scroll-direction='horizontal'
                                    data-scroll-speed='-4'
                                    className='smileyFace'>
                                    <div className='left-eye'></div>
                                    <div className='right-eye'></div>

                                    <div className='mouth'></div>
                                </div>
                            </span>
                        </div>
                        <a
                            className='mail-link link link-underline'
                            href='mailto:hello@alexyansons.com'>
                            hello@alexyansons.com
                        </a>
                    </div>
                    <div
                        data-scroll
                        data-scroll-direction='horizontal'
                        data-scroll-speed='2'
                        className='social-links-container'>
                        <div className='text'>Socials</div>
                        <div className='social-links-list'>
                            <a
                                className='link link-underline'
                                href='https://www.linkedin.com/in/alexander-yansons-2005a117a/'
                                target='blank'>
                                linkedin
                            </a>
                            <a
                                className='link link-underline'
                                href='https://github.com/urfriendalex'
                                target='blank'>
                                github
                            </a>
                            <a
                                className='link link-underline'
                                href='https://www.instagram.com/urfriendalex/'
                                target='blank'>
                                instagram
                            </a>
                        </div>
                    </div>
                </div>
                <div className='bg-changer'>
                    <div
                        className='btn link link-wavy'
                        onClick={() => {
                            dispatch(switchBgVersion());
                        }}>
                        <span>click</span>
                        <svg
                            className='link__graphic link__graphic--slide'
                            width='300%'
                            height='100%'
                            viewBox='0 0 1200 60'
                            preserveAspectRatio='none'>
                            <path d='M0,56.5c0,0,298.666,0,399.333,0C448.336,56.5,513.994,46,597,46c77.327,0,135,10.5,200.999,10.5c95.996,0,402.001,0,402.001,0'></path>
                        </svg>
                    </div>
                </div>
            </div>
            <div className={`background-holder bg-${bgVersion}`}></div>
        </section>
    );
};

export default Contact;
