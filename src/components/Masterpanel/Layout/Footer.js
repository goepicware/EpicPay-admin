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
              <div className="mb-2 mb-md-0">
                ©<script>document.write(new Date().getFullYear());</script>,
                made with <span className="text-danger">❤️</span> by
                <a
                  href="https://pixinvent.com"
                  target="_blank"
                  className="footer-link fw-medium"
                >
                  Pixinvent
                </a>
              </div>
              <div>
                <a
                  href="https://themeforest.net/licenses/standard"
                  className="footer-link me-4"
                  target="_blank"
                >
                  License
                </a>
                <a
                  href="https://1.envato.market/pixinvent_portfolio"
                  target="_blank"
                  className="footer-link me-4"
                >
                  More Themes
                </a>

                <a
                  href="https://demos.pixinvent.com/materialize-html-admin-template/documentation/"
                  target="_blank"
                  className="footer-link me-4"
                >
                  Documentation
                </a>

                <a
                  href="https://pixinvent.ticksy.com/"
                  target="_blank"
                  className="footer-link d-none d-sm-inline-block"
                >
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
