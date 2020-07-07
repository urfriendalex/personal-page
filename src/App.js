import React, {  useRef, useState } from 'react';
import './styles/App.scss';
import Loader from './Components/Loader';
import Landing from './Components/Landing';

function App() {
  const cursor = useRef(null);
  const [isLoading, setIsloading] = useState(false);

  const handleIsLoading = (status) => {
    setIsloading(status);
  };

  const onMove = (e) => {
    // cursor.current.style.transform = `translate(${e.pageX}px,${e.pageY}px)`;
    cursor.current.style.left = `${e.pageX}px`;
    cursor.current.style.top = `${e.pageY}px`;
  };

  return isLoading ? (
    <Loader handleIsLoading={handleIsLoading} />
  ) : (
    <div className='App' onMouseMove={onMove}>
      <div ref={cursor} id='cursor'></div> 
      <Landing />
    </div>
  );
}

export default App;
