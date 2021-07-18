import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';
import { createStore, compose } from 'redux'
import reducer from './reducers'
import { Provider } from 'react-redux'

import App from './App';
import middleware from './middleware'
import 'draft-js/dist/Draft.css'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(
  reducer, 
  composeEnhancers(middleware),
)

const theme = createTheme({
  typography: {
    useNextVariants: true,
  },
})

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <Provider store={store}>
      <App />
    </Provider>
  </MuiThemeProvider>, 
  document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
