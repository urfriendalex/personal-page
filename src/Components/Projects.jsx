/*eslint no-mixed-operators: 0*/

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap/gsap-core';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useOnScreen from './hooks/useOnScreen';
import cn from 'classnames';
import { splitToSpans } from './tools/functions';

const projects = [
    {
        banner: 'img/project-banners/kino-proby.png',
        title: 'KINOPROBY',
        description: 'Portfolio for the film production duo.',
        partial: false,
        site: 'https://kino-proby.com/',
    },
    {
        banner: 'img/project-banners/dmilkanova.png',
        title: 'DMILKANOVA BRAND',
        description: 'Online shop for the clothing brand.',
        partial: false,
        site: 'https://dmilkanova.com/',
    },
    {
        banner: 'img/project-banners/golden-sushi.png',
        title: 'GOLDEN SUSHI',
        description: 'Sushi restaraunt webpage with shop functionality.',
        partial: 'https://codepen.io/urfriendalex/pen/ZEBVbqB',
        site: 'https://goldensushi.pl/',
    },
    {
        banner: 'img/project-banners/fujin.png',
        title: 'FUJIN SUSHI',
        description: 'Sushi restaraunt webpage with shop functionality.',
        partial: 'https://codepen.io/urfriendalex/pen/KKmZgMq',
        site: 'https://fujinsushi.pl/',
    },
    {
        banner: 'img/project-banners/myfashionmystyle.png',
        title: 'MY FASHION MY STYLE',
        description: 'Portfolio website for personal fashion stylist',
        partial: 'https://codepen.io/urfriendalex/pen/JjWaNQb',
        site: 'https://myfashionmyvision.style/',
    },
    {
        banner: 'img/project-banners/lk-kurs.png',
        title: 'LIZA KARASIOVA COURSE',
        description: 'Online course landing and conduction.',
        partial: 'https://codepen.io/urfriendalex/pen/vYXEaOV',
        site: 'https://lizakarasiova.com/',
    },
    {
        banner: 'img/project-banners/nice-device.png',
        title: 'NICE DEVICE',
        description: 'Phone selling and repairment service.',
        partial: 'https://codepen.io/urfriendalex/pen/ZEOrGWN',
        site: 'https://nicedevice.pl/',
    },
];

const Project = ({
    info: { description, title, banner, partial, site },
    index,
}) => {
    const ref = useRef(null);
    const onScreen = useOnScreen(ref, 0.5);

    return (
        <li
            className={cn(
                'project-wrapper',
                { 'is-reveal': onScreen },
                `project-${index + 1}`
            )}
            ref={ref}>
            <div className='project-links'>
                {partial ? (
                    <a
                        className='link secondary link-wavy'
                        href={partial}
                        target='blank'>
                        <span>view partial</span>
                        <svg
                            className='link__graphic link__graphic--slide'
                            width='300%'
                            height='100%'
                            viewBox='0 0 1200 60'
                            preserveAspectRatio='none'>
                            <path d='M0,56.5c0,0,298.666,0,399.333,0C448.336,56.5,513.994,46,597,46c77.327,0,135,10.5,200.999,10.5c95.996,0,402.001,0,402.001,0'></path>
                        </svg>
                    </a>
                ) : (
                    <div className='link-placeholder'></div>
                )}
                <a className='link link-wavy' href={site} target='blank'>
                    <span>visit site</span>
                    <svg
                        className='link__graphic link__graphic--slide'
                        width='300%'
                        height='100%'
                        viewBox='0 0 1200 60'
                        preserveAspectRatio='none'>
                        <path d='M0,56.5c0,0,298.666,0,399.333,0C448.336,56.5,513.994,46,597,46c77.327,0,135,10.5,200.999,10.5c95.996,0,402.001,0,402.001,0'></path>
                    </svg>
                </a>
            </div>
            <div className='project-banner'></div>
            <div className='project-info'>
                {splitToSpans(title, '', 'project-title')}
                {splitToSpans(description, '/n', 'project-description')}
            </div>
        </li>
    );
};

const Projects = () => {
    useEffect(() => {
        // This does not seem to work without a settimeout
        setTimeout(() => {
            let sections = gsap.utils.toArray(
                '#projects .projects-container .project-wrapper'
            );

            let directionalSnap = (increment) => {
                let snapFunc = gsap.utils.snap(increment);
                return (raw, self) => {
                    let n = snapFunc(raw);
                    return Math.abs(n - raw) < 1e-4 ||
                        n < raw === self.direction < 0
                        ? n
                        : self.direction < 0
                        ? n - increment
                        : n + increment;
                };
            };

            gsap.to(sections, {
                xPercent: -100 * (sections.length - 1),
                ease: 'none',
                scrollTrigger: {
                    trigger: '.projects-container',
                    scroller: '#main-container',
                    pin: true,
                    pinType: 'transform',
                    pinSpacing: true,
                    scrub: 1,
                    // scrub: 0.5,
                    snap: {
                        snapTo: directionalSnap(1 / (sections.length - 1)),
                        duration: { min: 0.1, max: 0.2 },
                        delay: 0,
                    },
                    // base vertical scrolling on how wide the container is so it feels more natural.
                    // end: '+=3500',
                    end: () =>
                        '+=' +
                        document.querySelector('.projects-container')
                            .offsetWidth,
                },
            });

            ScrollTrigger.refresh();
        });
    }, []);

    return (
        <section
            data-scroll-section
            id='projects'
            data-scroll-section-id='section2'
            className='section-wrapper'>
            <ul className='projects-container'>
                <div data-scroll className='section-title project-wrapper'>
                    Projects
                </div>
                {projects.map((proj, index) => (
                    <Project key={index} info={proj} index={index} />
                ))}
            </ul>
        </section>
    );
};

export default Projects;
