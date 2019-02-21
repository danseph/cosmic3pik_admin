import React, { Component } from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch } from "react-router-dom";
import { IntlProvider } from 'react-intl'
import indexRoutes from "routes/index.jsx";
import translations from './translations/index'

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/animate.min.css";
import "./assets/sass/light-bootstrap-dashboard.css";
import "./assets/css/demo.css";
import "./assets/css/pe-icon-7-stroke.css";

const messages = translations;
const currentLang = localStorage.getItem('lang') || 'en';

class App extends Component {
  render() {
    return (
      <HashRouter>
        <Switch>
          {indexRoutes.map((prop, key) => {
            return <Route to={prop.path} component={prop.component} key={key} />;
          })}
        </Switch>
      </HashRouter>
    );
  }
}

ReactDOM.render(
  <IntlProvider
    locale={currentLang}
    messages={messages[currentLang]}
  >
  <App />
  </IntlProvider>,
  document.getElementById("root")
);
