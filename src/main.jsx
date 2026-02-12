import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import App from './App';
import { store, persistor } from './redux/store';
import { preloadBgImages } from './utils/preloadBgImages';
import { preloadProjectBanners } from './utils/preloadProjectBanners';
import "./fonts/satoshi/css/satoshi.css";
import "./fonts/maragsa/css/maragsa.css";

// Pre-fetch bg switcher images so transitions are smooth
preloadBgImages();
// Warm up project banners to avoid first-swipe decode/fetch hitch on mobile.
preloadProjectBanners();

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </PersistGate>
  </Provider>
);







