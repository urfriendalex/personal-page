import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'

import { combineReducers } from 'redux'
import uiReducer from './ui-reducer';
import scrollReducer from './scroll-reducer';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['UI.bgVersion']
}

const rootReducer = combineReducers({
    UI: uiReducer,
    scroll: scrollReducer
})

export default persistReducer(persistConfig, rootReducer)