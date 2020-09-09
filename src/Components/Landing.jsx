import React, { useEffect, useRef, useState } from 'react';
import { gsap, Power2 } from 'gsap/all';
import { Tween, Timeline } from 'react-gsap';
import {useIntersection} from 'react-use';
// import pic from '../img/pic.jpg';

const Landing = () => {
  const tl = gsap.timeline();


  const [navActive, setNavActive] = useState(false);
  const [loadedBefore, setLoadedBefore] = useState(false);

  const worksSectionRef = useRef(null);

  const circleGrow = () => {
    gsap.to('#cursor', 0.5, { height: '150px', width: '150px'});
  };

  const circleShrink = () => {
    gsap.to('#cursor', 0.5, { width: '3rem', height: '3rem'});
  };


  // const positionOnElemnt = (el) => {
  //   if(el){
  //     let offTop = el.current.offsetTop,
  //     offLeft = el.current.offsetLeft,
  //     // cursorTl.to(cursor.current, 0.1, { transform: `translate(${offLeft}px,${offTop}px`})
  //   } else
  //   console.log(el);
  // }

  const interSection = useIntersection(worksSectionRef,{
    root: null,
    rootMargin: '0px',
    threshold: 1
  });

  const scrollLeft = element => {
    gsap.to(element, 1, {
      left: '-53px'
    })    
  };

  const scrollRight = element => {
    gsap.to(element, 1, {
      left: '1000px'
    })    
  };

  interSection && interSection.intersectionRatio < 1 ?
  scrollLeft('.works .section-back-subtitle:nth-of-type(1)')
  : scrollRight('.works .section-back-subtitle:nth-of-type(1)')



  useEffect(() => {
    tl.to(['#cursor', 'main'], { visibility: 'visible' });

    if (!loadedBefore) {
      tl.to(['.hamburger',  '#hey', '.hero'], 0, {visibility: 'visible'})
      .fromTo(
        '.landing',
        1,
        { backgroundColor: '#2D2D2A' },
        { backgroundColor: '#262626' }
      )
        .fromTo(
          '.logo',
          1,
          {
            css: {
              transform: 'translate(-50%, -50%) scale(0.2, 0.2)',
            },
          },
          {
            css: {
              transform: 'translate(-50%, -50%) scale(0.2, 0.2)',
            },
          },
          '+=2'
        )
        .fromTo('#hey', 0.8, { opacity: 0 }, { opacity: 1 }, '-=1.8')
        .fromTo(
          '.hamburger span:nth-of-type(1)',
          0.3,
          { width: '0' },
          { width: '36px', ease: Power2.easeInOut, clearProps: 'width' },
          '-=1.3'
        )
        .fromTo(
          '.hamburger span:nth-of-type(2)',
          0.3,
          { width: '0' },
          { width: '26px', ease: Power2.easeInOut, clearProps: 'width' },
          '-=1'
        )
        .fromTo(
          '.hamburger span:nth-of-type(3)',
          0.4,
          { width: '0' },
          { width: '20px', ease: Power2.easeInOut, clearProps: 'width' },
          '-=0.7'
        ).then(()=>{
          setLoadedBefore(true);
        });
    }
  });

  return (
    <div  className='landing'>
      <header>
        <span role='img' aria-label='hey' id='hey'>
          ✌🏻
        </span>
        <Timeline>
          <svg
            onMouseEnter={circleGrow}
            onMouseLeave={circleShrink}
            className='logo'
            width='385'
            height='385'
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
              <path d='M122 174.477L216 367.477L122 174.477Z' fill='white' />
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
              <path d='M124 169.477L218 362.477L124 169.477Z' fill='white' />
              <path
                d='M124 169.477L218 362.477'
                stroke='white'
                strokeLinecap='round'
              />
              <path d='M262 269.477L168 77.4768L262 269.477Z' fill='white' />
              <path
                d='M262 269.477L168 77.4768'
                stroke='white'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path d='M170 71.4768L264 265.477L170 71.4768Z' fill='white' />
              <path
                d='M170 71.4768L264 265.477'
                stroke='white'
                strokeLinecap='round'
              />
              <path d='M170 71.4768L76 270.477L170 71.4768Z' fill='white' />
              <path
                d='M170 71.4768L76 270.477'
                stroke='white'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path d='M353 77.4768L216 367.477L353 77.4768Z' fill='white' />
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
      </header>
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
      <section className='hero container'>
          <div className="row w-100 h-25 d-flex align-items-end">
              <h1>Alexander Yansons</h1>
          </div>
          <div className="row w-100 h-50 d-flex align-items-center justify-content-center location">
            <h2>Warsaw based</h2>
          </div>
          <div className="row w-100 h-25 d-flex align-items-start justify-content-center job">
            <h2 className='w-100'>Front End Developer</h2>
              <span></span>
          </div>
      </section>
      <main>
        <div ref={worksSectionRef} className='works section-wrapper'>
          <div className='section-title'>
            <div className='section-back-subtitle'>MY PROJECTS MY PROJECTS</div>
            <div className='section-back-subtitle'>MY PROJECTS MY PROJECTS</div>
            <h1 className='section-subtitle'>
              MY PROJECTS
            </h1>
          </div>
        </div>
        <div className='skills section-wrapper'>
          <div className='section-title'>
            <div className='section-back-subtitle'>MY SKILLS MY SKILLS</div>
            <div className='section-back-subtitle'>MY SKILLS MY SKILLS</div>
            <h1 className='section-subtitle'>
              MY SKILLS
            </h1>
          </div>
        </div>
        <div className='contact'>
          <h1>
            CONTACT
          </h1>
        </div>
      </main>
    </div>
  );
};

export default Landing;
