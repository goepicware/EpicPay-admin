/* eslint-disable */
import React, { Component } from "react";
import { connect } from "react-redux";

import Header from "../Layout/Header";
import Topmenu from "../Layout/Topmenu";

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
            <Topmenu />

            <div className="content-wrapper">
              <div className="container-xxl flex-grow-1 container-p-y">
                <h4 className="fw-bold">GoepicPay wallet management</h4>

                <div className="card">
                  <h5 className="card-header">Overall wallet info</h5>
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
                <div className="container-xxl"></div>
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
