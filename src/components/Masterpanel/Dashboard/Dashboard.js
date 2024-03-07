/* eslint-disable */
import React, { Component } from "react";
import { connect } from "react-redux";
import Header from "../Layout/Header";
class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  componentDidMount() {}

  render() {
    return (
      <div className="layout-wrapper layout-content-navbar">
        <div className="layout-container">
          <Header />
          <div className="layout-page">
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
                        <a
                          className="dropdown-item"
                          href="pages-account-settings-account.html"
                        >
                          <div className="d-flex">
                            <div className="flex-shrink-0 me-3">
                              <div className="avatar avatar-online">
                                <img
                                  src="/assets/img/avatars/1.png"
                                  alt=""
                                  className="w-px-40 h-auto rounded-circle"
                                />
                              </div>
                            </div>
                            <div className="flex-grow-1">
                              <span className="fw-semibold d-block">
                                John Doe
                              </span>
                              <small className="text-muted">Admin</small>
                            </div>
                          </div>
                        </a>
                      </li>
                      <li>
                        <div className="dropdown-divider"></div>
                      </li>
                      <li>
                        <a
                          className="dropdown-item"
                          href="pages-profile-user.html"
                        >
                          <i className="mdi mdi-account-outline me-2"></i>
                          <span className="align-middle">My Profile</span>
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item"
                          href="pages-account-settings-account.html"
                        >
                          <i className="mdi mdi-cog-outline me-2"></i>
                          <span className="align-middle">Settings</span>
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item"
                          href="pages-account-settings-billing.html"
                        >
                          <span className="d-flex align-items-center align-middle">
                            <i className="flex-shrink-0 mdi mdi-credit-card-outline me-2"></i>
                            <span className="flex-grow-1 align-middle">
                              Billing
                            </span>
                            <span className="flex-shrink-0 badge badge-center rounded-pill bg-danger w-px-20 h-px-20">
                              4
                            </span>
                          </span>
                        </a>
                      </li>
                      <li>
                        <div className="dropdown-divider"></div>
                      </li>
                      <li>
                        <a
                          className="dropdown-item"
                          href="pages-help-center-landing.html"
                        >
                          <i className="mdi mdi-lifebuoy me-2"></i>
                          <span className="align-middle">Help</span>
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="pages-faq.html">
                          <i className="mdi mdi-help-circle-outline me-2"></i>
                          <span className="align-middle">FAQ</span>
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="pages-pricing.html">
                          <i className="mdi mdi-currency-usd me-2"></i>
                          <span className="align-middle">Pricing</span>
                        </a>
                      </li>
                      <li>
                        <div className="dropdown-divider"></div>
                      </li>
                      <li>
                        <a
                          className="dropdown-item"
                          href="auth-login-cover.html"
                          target="_blank"
                        >
                          <i className="mdi mdi-logout me-2"></i>
                          <span className="align-middle">Log Out</span>
                        </a>
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

            <div className="content-wrapper">
              <div className="container-xxl flex-grow-1 container-p-y">
                <h4 className="fw-bold">Company</h4>

                <div className="card">
                  <h5 className="card-header">Table Caption</h5>
                  <div className="table-responsive text-nowrap">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Project</th>
                          <th>Client</th>
                          <th>Users</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <i className="mdi mdi-wallet-travel mdi-20px text-danger me-3"></i>
                            <strong>Tours Project</strong>
                          </td>
                          <td>Albert Cook</td>
                          <td>dfsfsfsf</td>
                          <td>
                            <span className="badge bg-label-primary me-1">
                              Active
                            </span>
                          </td>
                          <td>
                            <div className="dropdown">
                              <button
                                type="button"
                                className="btn p-0 dropdown-toggle hide-arrow"
                                data-bs-toggle="dropdown"
                              >
                                <i className="mdi mdi-dots-vertical"></i>
                              </button>
                              <div className="dropdown-menu">
                                <a className="dropdown-item" href={void 0}>
                                  <i className="mdi mdi-pencil-outline me-1"></i>
                                  Edit
                                </a>
                                <a className="dropdown-item" href={void 0}>
                                  <i className="mdi mdi-trash-can-outline me-1"></i>
                                  Delete
                                </a>
                              </div>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <i className="mdi mdi-basketball mdi-20px text-info me-3"></i>
                            <strong>Sports Project</strong>
                          </td>
                          <td>Barry Hunter</td>
                          <td>fdsfsdf</td>
                          <td>
                            <span className="badge bg-label-success me-1">
                              Completed
                            </span>
                          </td>
                          <td>
                            <div className="dropdown">
                              <button
                                type="button"
                                className="btn p-0 dropdown-toggle hide-arrow"
                                data-bs-toggle="dropdown"
                              >
                                <i className="mdi mdi-dots-vertical"></i>
                              </button>
                              <div className="dropdown-menu">
                                <a className="dropdown-item" href={void 0}>
                                  <i className="mdi mdi-pencil-outline me-1"></i>
                                  Edit
                                </a>
                                <a className="dropdown-item" href={void 0}>
                                  <i className="mdi mdi-trash-can-outline me-1"></i>
                                  Delete
                                </a>
                              </div>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <i className="mdi mdi-greenhouse mdi-20px text-success me-3"></i>
                            <strong>Greenhouse Project</strong>
                          </td>
                          <td>Trevor Baker</td>
                          <td>dsffsd</td>
                          <td>
                            <span className="badge bg-label-info me-1">
                              Scheduled
                            </span>
                          </td>
                          <td>
                            <div className="dropdown">
                              <button
                                type="button"
                                className="btn p-0 dropdown-toggle hide-arrow"
                                data-bs-toggle="dropdown"
                              >
                                <i className="mdi mdi-dots-vertical"></i>
                              </button>
                              <div className="dropdown-menu">
                                <a className="dropdown-item" href={void 0}>
                                  <i className="mdi mdi-pencil-outline me-1"></i>
                                  Edit
                                </a>
                                <a className="dropdown-item" href={void 0}>
                                  <i className="mdi mdi-trash-can-outline me-1"></i>
                                  Delete
                                </a>
                              </div>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <i className="mdi mdi-bank mdi-20px text-primary me-3"></i>
                            <strong>Bank Project</strong>
                          </td>
                          <td>Jerry Milton</td>
                          <td>fdsaf</td>
                          <td>
                            <span className="badge bg-label-warning me-1">
                              Pending
                            </span>
                          </td>
                          <td>
                            <div className="dropdown">
                              <button
                                type="button"
                                className="btn p-0 dropdown-toggle hide-arrow"
                                data-bs-toggle="dropdown"
                              >
                                <i className="mdi mdi-dots-vertical"></i>
                              </button>
                              <div className="dropdown-menu">
                                <a className="dropdown-item" href={void 0}>
                                  <i className="mdi mdi-pencil-outline me-1"></i>
                                  Edit
                                </a>
                                <a className="dropdown-item" href={void 0}>
                                  <i className="mdi mdi-trash-can-outline me-1"></i>
                                  Delete
                                </a>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <footer className="content-footer footer bg-footer-theme">
                <div className="container-xxl">
                  <div className="footer-container d-flex align-items-center justify-content-between py-3 flex-md-row flex-column">
                    <div className="mb-2 mb-md-0">© Epicpay</div>
                    <div>
                      <a
                        href={void 0}
                        className="footer-link d-none d-sm-inline-block"
                      >
                        Support
                      </a>
                    </div>
                  </div>
                </div>
              </footer>

              <div className="content-backdrop fade"></div>
            </div>
          </div>
        </div>

        <div className="layout-overlay layout-menu-toggle"></div>

        <div className="drag-target"></div>
      </div>
    );
  }
}

const mapStateTopProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateTopProps, mapDispatchToProps)(Home);
