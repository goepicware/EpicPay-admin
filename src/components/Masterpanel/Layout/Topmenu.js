/* eslint-disable */
import React, { Component } from "react";
import { Link } from "react-router-dom";
class Topmenu extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <nav
        className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme"
        id="layout-navbar"
      >
        <div className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
          <a className="nav-item nav-link px-0 me-xl-4" href={void 0}>
            <i className="mdi mdi-menu mdi-24px"></i>
          </a>
        </div>

        <div
          className="navbar-nav-right d-flex align-items-center"
          id="navbar-collapse"
        >
          <ul className="navbar-nav flex-row align-items-center ms-auto">
            <li className="nav-item navbar-dropdown dropdown-user dropdown">
              <a
                className="nav-link dropdown-toggle hide-arrow"
                href={void 0}
                data-bs-toggle="dropdown"
              >
                <div className="avatar avatar-online">
                  <img
                    src="/assets/img/avatars/1.png"
                    alt=""
                    className="w-px-40 h-auto rounded-circle"
                  />
                </div>
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <Link className="dropdown-item" to={"/logout/master"}>
                    <i className="mdi mdi-logout me-2"></i>
                    <span className="align-middle">Log Out</span>
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>

        <div className="navbar-search-wrapper search-input-wrapper d-none">
          <input
            type="text"
            className="form-control search-input container-xxl border-0"
            placeholder="Search..."
            aria-label="Search..."
          />
          <i className="mdi mdi-close search-toggler cursor-pointer"></i>
        </div>
      </nav>
    );
  }
}

export default Topmenu;
