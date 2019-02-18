import React, { Component } from "react";
import { Grid } from "react-bootstrap";

class Footer extends Component {

  /**
   * Logout
   */
  logOut() {
    if (window.confirm('logout?')) {
      window.localStorage.removeItem('nu_id');
      window.localStorage.removeItem('nu_token');
      window.location.href='/';
    }
  }

  render() {
    return (
      <footer className="footer">
        <Grid fluid>
          <p onClick={this.logOut} className="copyright pull-right">
            Logout
          </p>
        </Grid>
      </footer>
    );
  }
}

export default Footer;
