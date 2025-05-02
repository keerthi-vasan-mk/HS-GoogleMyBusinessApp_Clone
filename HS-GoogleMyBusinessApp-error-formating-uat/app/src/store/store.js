import logger from 'redux-logger';
import thunk from 'redux-thunk';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from '@/reducers/rootReducer';
import { DATA_JWT, DATA_ADMIN_JWT } from '@/constants/reducerTypes';

export default function configureStore() {
	
	const persistConfig = {
    key: 'root',
    storage,
    whitelist: [DATA_JWT, DATA_ADMIN_JWT], // Reducers to be persisted.
	};

	if (process.env.NODE_ENV === 'development') {
		return createStore(
			persistReducer(persistConfig, rootReducer),
			applyMiddleware(thunk, logger),
		);
	} else {
		return createStore(
			persistReducer(persistConfig, rootReducer),
			applyMiddleware(thunk),
		);
	}
}
