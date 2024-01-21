/* eslint-disable */
import React, { Component } from "react";
import { connect } from "react-redux";

import { checkMasterAuth } from "../../Helpers/SettingHelper";
class Header extends Component {
  constructor(props) {
    super(props);
    checkMasterAuth(this.props);
    this.state = {};
  }
  componentDidMount() {
    const script = document.createElement("script");
    script.src = "/assets/js/main.js";
    script.async = true;
    document.body.appendChild(script);
  }
  render() {
    var currentPage = this.props.currentPage;
    return (
      <aside
        id="layout-menu"
        className="layout-menu menu-vertical menu bg-menu-theme"
      >
        <div className="app-brand demo">
          <a href="index.html" className="app-brand-link">
            <span className="app-brand-logo demo">
              <span>
                <img src={"/logo.png"} alt="Goepicware" />
              </span>
            </span>
            <span className="app-brand-text demo menu-text fw-bold ms-2">
              Goepicware
            </span>
          </a>

          <a
            href={void 0}
            className="layout-menu-toggle menu-link text-large ms-auto"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.4854 4.88844C11.0081 4.41121 10.2344 4.41121 9.75715 4.88844L4.51028 10.1353C4.03297 10.6126 4.03297 11.3865 4.51028 11.8638L9.75715 17.1107C10.2344 17.5879 11.0081 17.5879 11.4854 17.1107C11.9626 16.6334 11.9626 15.8597 11.4854 15.3824L7.96672 11.8638C7.48942 11.3865 7.48942 10.6126 7.96672 10.1353L11.4854 6.61667C11.9626 6.13943 11.9626 5.36568 11.4854 4.88844Z"
                fill="currentColor"
                fillOpacity="0.6"
              />
              <path
                d="M15.8683 4.88844L10.6214 10.1353C10.1441 10.6126 10.1441 11.3865 10.6214 11.8638L15.8683 17.1107C16.3455 17.5879 17.1192 17.5879 17.5965 17.1107C18.0737 16.6334 18.0737 15.8597 17.5965 15.3824L14.0778 11.8638C13.6005 11.3865 13.6005 10.6126 14.0778 10.1353L17.5965 6.61667C18.0737 6.13943 18.0737 5.36568 17.5965 4.88844C17.1192 4.41121 16.3455 4.41121 15.8683 4.88844Z"
                fill="currentColor"
                fillOpacity="0.38"
              />
            </svg>
          </a>
        </div>

        <div className="menu-inner-shadow"></div>

        <ul className="menu-inner py-1">
          <li className="menu-item">
            <a href={void 0} className="menu-link">
              <i className="menu-icon tf-icons mdi mdi-home-outline"></i>
              <div>Dashboard</div>
            </a>
          </li>
          <li className={
                  currentPage === "client"
                    ? "menu-item active"
                    : "menu-item"
                } >
            <a href="/masterpanel/client" className={"menu-link"}>
              <i className="menu-icon tf-icons mdi mdi-vector-arrange-below"></i>
              <div>Client</div>
            </a>
          </li>
          <li className={
                  currentPage === "companycategory"
                    ? "menu-item active"
                    : "menu-item"
                }>
            <a href="/masterpanel/category" className={"menu-link"}>
              <i className="menu-icon tf-icons mdi mdi-vector-arrange-below"></i>
              <div>Company Category</div>
            </a>
          </li>
        </ul>
      </aside>
    );
  }
}

const mapStateTopProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateTopProps, mapDispatchToProps)(Header);
