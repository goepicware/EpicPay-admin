/* eslint-disable */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { apiUrl, adminlimit } from "../../Helpers/Config";
import { GET_LISTDATA } from "../../../actions";
import {
  showStatus,
  encodeValue,
  removeItem,
} from "../../Helpers/SettingHelper";
import Header from "../Layout/Header";
import Topmenu from "../Layout/Topmenu";
import Footer from "../Layout/Footer";
import Pagenation from "../Layout/Pagenation";

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalRecords: 0,
      totalPage: 0,
      currentPage: 1,
      clientList: [],
      loading: true,
    };
  }
  componentDidMount() {
    var params = {
      params: "limit=" + adminlimit + "&offset=1",
      url: apiUrl + "company/companycontroller/company_list",
      type: "master",
    };
    this.props.getListData(params);
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.clientyList !== this.state.clientyList) {
      this.setState({
        clientList: nextProps.clientyList,
        loading: false,
        totalRecords: nextProps.totalRecords,
        totalPage: nextProps.totalPages,
      });
    }
  }
  sateValChange = (field, value) => {
    if (field === "page") {
      this.setState(
        {
          loading: true,
          currentPage: value,
        },
        function () {
          var params = {
            params: "limit=" + adminlimit + "&offset=" + value,
            url: apiUrl + "company/companycontroller/company_list",
            type: "master",
          };
          this.props.getListData(params);
        }
      );
    }
  };

  removeItem(CompnayId) {
    removeItem(CompnayId);
  }

  render() {
    return (
      <div className="layout-wrapper layout-content-navbar">
        <div className="layout-container">
          <Header {...this.props} currentPage={"client"} />
          <div className="layout-page">
            <Topmenu />

            <div className="content-wrapper">
              <div className="container-xxl flex-grow-1 container-p-y">
                <div className="row mb-3">
                  <div className="col-lg-10 col-md-6">
                    <h4 className="fw-bold">Company</h4>
                  </div>
                  <div className="col-lg-2 col-md-6 text-end">
                    <Link to={"/masterpanel/client/add"}>
                      <button
                        type="button"
                        className="btn btn-outline-primary waves-effect"
                      >
                        Add New
                      </button>
                    </Link>
                  </div>
                </div>

                <div className="card">
                  <div className="table-responsive text-nowrap p-1 mt-4">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Client Name</th>
                          {/*<th>Contact Person Name</th>*/}
                          <th>User Name</th>
                          <th>Email</th>
                          {/*<th>Phone</th>*/}
                          <th>Web Site</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.loading === true ? (
                          <tr>
                            <td colSpan={7} align="center">
                              <div
                                className="spinner-border spinner-border-lg text-primary"
                                role="status"
                              >
                                <span className="visually-hidden">
                                  Loading...
                                </span>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          this.state.clientList.length > 0 &&
                          this.state.clientList.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td>
                                  <strong>{item.company_name}</strong>
                                </td>
                                {/*<td>{item.company_owner_name}</td>*/}
                                <td>{item.company_username}</td>
                                <td>
                                  <a
                                    href={
                                      "mailto:" + item.company_email_address
                                    }
                                  >
                                    {item.company_email_address}
                                  </a>
                                </td>
                                {/*<td>
                                  <a href={"tel:" + item.company_phone}>
                                    {item.company_phone}
                                  </a>
                                </td>*/}
                                <td>
                                  <a
                                    href={item.company_site_url}
                                    target="_blank"
                                  >
                                    {item.company_site_url}
                                  </a>
                                </td>
                                <td>{showStatus(item.company_status)}</td>
                                <td>
                                  <div className="dropdown">
                                    <button
                                      type="button"
                                      className="btn p-0 dropdown-toggle hide-arrow"
                                      data-bs-toggle="dropdown"
                                    >
                                      <i className="mdi mdi-dots-horizontal"></i>
                                    </button>
                                    <div className="dropdown-menu">
                                      <Link
                                        to={
                                          "/masterpanel/client/edit/" +
                                          encodeValue(item.company_id)
                                        }
                                        className="dropdown-item"
                                      >
                                        <i className="mdi mdi-pencil-outline me-1"></i>
                                        Edit
                                      </Link>
                                      <a
                                        className="dropdown-item"
                                        href={void 0}
                                        onClick={this.removeItem.bind(
                                          this,
                                          encodeValue(item.company_id)
                                        )}
                                      >
                                        <i className="mdi mdi-trash-can-outline me-1"></i>
                                        Delete
                                      </a>
                                      <a
                                        className="dropdown-item"
                                        href={"/clientpanel/login/masteradmin/"+item.company_unquie_id}
                                        target="_blank"
                                      >
                                        <i className="mdi mdi-arrow-right-bold"></i>
                                        Client Panel
                                      </a>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                  <Pagenation
                    params={{
                      totalRecords: this.state.totalRecords,
                      totalPage: this.state.totalPage,
                      currentPage: this.state.currentPage,
                    }}
                    sateValChange={this.sateValChange}
                  />
                </div>
              </div>

              <Footer />
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
  var clientList = Array();
  var clientListStatus = "";
  var totalPages = 0;
  var totalRecords = 0;
  if (Object.keys(state.listdata).length > 0) {
    clientListStatus = state.listdata[0].status;
    if (state.listdata[0].status === "ok") {
      clientList = state.listdata[0].result;
      totalPages = state.listdata[0].totalPages;
      totalRecords = state.listdata[0].totalRecords;
    }
  }
  return {
    clientyList: clientList,
    totalPages: totalPages,
    totalRecords: totalRecords,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getListData: (datas) => {
      dispatch({ type: GET_LISTDATA, datas });
    },
  };
};

export default connect(mapStateTopProps, mapDispatchToProps)(List);
