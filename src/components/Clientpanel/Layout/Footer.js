/* eslint-disable */
import React, { Component } from "react";
class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
        <footer className="content-footer footer bg-footer-theme">
          <div className="container-xxl">
            <div className="footer-container d-flex align-items-center justify-content-between py-3 flex-md-row flex-column">
              <div className="mb-2 mb-md-0">© Goopicware</div>
              <div>
                <a href="#" className="footer-link me-4">
                  Documentation
                </a>

                <a href="#" className="footer-link d-none d-sm-inline-block">
                  Support
                </a>
              </div>
            </div>
          </div>
        </footer>

        <div className="content-backdrop fade"></div>
      </>
    );
  }
}

export default Footer;
