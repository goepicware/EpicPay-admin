/* eslint-disable */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import cookie from "react-cookies";
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
var module = "clientpanel/rider/";
var moduleName = "Own Rider";
class List extends Component {
  constructor(props) {
    super(props);
    var companyID = cookie.load("companyID");
    this.state = {
      companyID: companyID,
      path: this.props.match.path,
      totalRecords: 0,
      totalPage: 0,
      currentPage: 1,
      listdata: [],
      loading: true,
    };
  }
  componentDidMount() {
    var params = {
      params:
        "limit=" + adminlimit + "&offset=1&company_id=" + this.state.companyID,
      url: apiUrl + module + "list",
      authType: "client",
    };
    this.props.getListData(params);
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.listdata !== this.state.listdata) {
      this.setState({
        listdata: nextProps.listdata,
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
            params:
              "limit=" +
              adminlimit +
              "&offset=" +
              value +
              "&company_id=" +
              this.state.companyID,
            url: apiUrl + module + "list",
            type: "client",
          };
          this.props.getListData(params);
        }
      );
    }
  };
  removeItem(deleteID) {
    var params = { delete_id: deleteID, company_id: this.state.companyID };
    var delurl = module + "delete";
    removeItem(params, delurl, "client");
  }

  render() {
    return (
      <div className="layout-wrapper layout-content-navbar">
        <div className="layout-container">
          <Header {...this.props} currentPage={"own-rider"} />
          <div className="layout-page">
            <Topmenu />

            <div className="content-wrapper">
              <div className="container-xxl flex-grow-1 container-p-y">
                <div className="row mb-3">
                  <div className="col-lg-10 col-md-6">
                    <h4 className="fw-bold">{moduleName}</h4>
                  </div>
                  <div className="col-lg-2 col-md-6 text-end">
                    <Link to={this.state.path + "add"}>
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
                          <th>Name</th>
                          <th>Email</th>
                          <th>Mobile</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.loading === true ? (
                          <tr>
                            <td colSpan={4} align="center">
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
                        ) : this.state.listdata.length > 0 ? (
                          this.state.listdata.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td>
                                  <strong>{item.name}</strong>
                                </td>
                                <td>{item.rider_email_address}</td>
                                <td>{item.rider_mobile_no}</td>
                                <td>{showStatus(item.rider_status)}</td>
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
                                          this.state.path +
                                          "edit/" +
                                          encodeValue(item.rider_id)
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
                                          encodeValue(item.rider_id)
                                        )}
                                      >
                                        <i className="mdi mdi-trash-can-outline me-1"></i>
                                        Delete
                                      </a>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td className="text-center" colSpan={8}>
                              No {moduleName} Found
                            </td>
                          </tr>
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
  var listdata = Array();
  var listdataStatus = "";
  var totalPages = 0;
  var totalRecords = 0;
  if (Object.keys(state.listdata).length > 0) {
    listdataStatus = state.listdata[0].status;
    if (state.listdata[0].status === "ok") {
      listdata = state.listdata[0].result;
      totalPages = state.listdata[0].totalPages;
      totalRecords = state.listdata[0].totalRecords;
    }
  }
  return {
    listdata: listdata,
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
