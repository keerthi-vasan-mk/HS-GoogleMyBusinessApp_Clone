import React, { Component } from 'react';
import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { Router } from 'react-router-dom';
import Routes from './Routes';
import configureStore from '@/store/store';
import { Toast } from '@/components/common/Toast';
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// Create store and presistant local storage
export const store = configureStore();
const persistor = persistStore(store);

// Create browser history that can be used outside of the main app.
export const appHistory = createBrowserHistory();

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Router history={appHistory}>
            <Routes />
          </Router>
          <Toast />
          <ToastContainer
            autoClose={false}
            draggable={false}
            position="bottom-center"
            toastClassName="error-toast"
            transition={Slide}
          />
        </PersistGate>
      </Provider>
    );
  }
}

export default App;
