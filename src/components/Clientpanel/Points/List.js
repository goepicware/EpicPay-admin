/* eslint-disable */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import cookie from "react-cookies";
import Select from "react-select";
import { apiUrl, adminlimit } from "../../Helpers/Config";
import { GET_LISTDATA } from "../../../actions";
import Header from "../Layout/Header";
import Topmenu from "../Layout/Topmenu";
import Footer from "../Layout/Footer";
import Pagenation from "../Layout/Pagenation";
var module = "clientpanel/rewardspoints/";
var moduleName = "Reward Point History";
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
      name: "",
      email: "",
    };
    this.handleChangeText = this.handleChangeText.bind(this);
  }
  componentDidMount() {
    this.loadList(1);
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
          this.loadList(value);
        }
      );
    }
  };
  handleChangeText(event) {
    var name = event.target.name;
    var value = event.target.value;
    this.setState({ [name]: value });
  }
  handleSelectChange(name, value) {
    this.setState({ [name]: value });
  }

  searchList() {
    this.setState({ loading: true }, function () {
      this.loadList(1);
    });
  }
  loadList(offset) {
    var addParams = "";
    if (this.state.name !== "") {
      addParams += "&name=" + this.state.name;
    }
    if (this.state.email !== "") {
      addParams += "&email=" + this.state.email;
    }

    var params = {
      params:
        "limit=" +
        adminlimit +
        "&offset=" +
        offset +
        "&company_id=" +
        this.state.companyID +
        addParams,
      url: apiUrl + module + "list",
      authType: "client",
    };
    this.props.getListData(params);
  }
  resetSearch() {
    this.setState(
      {
        loading: true,
        name: "",
        email: "",
      },
      function () {
        this.loadList(1);
      }
    );
  }

  render() {
    return (
      <div className="layout-wrapper layout-content-navbar">
        <div className="layout-container">
          <Header {...this.props} currentPage={"points"} />
          <div className="layout-page">
            <Topmenu />

            <div className="content-wrapper">
              <div className="container-xxl flex-grow-1 container-p-y">
                <div className="row mb-3">
                  <div className="col-lg-8 col-md-6">
                    <h4 className="fw-bold">{moduleName}</h4>
                  </div>
                  {/*<div className="col-lg-4 col-md-6 text-end">
                    <Link to={this.state.path + "credit"}>
                      <button
                        type="button"
                        className="btn btn-outline-primary waves-effect"
                      >
                        Credit Points
                      </button>
                    </Link>
                    &nbsp;&nbsp;
                    <Link to={this.state.path + "debit"}>
                      <button
                        type="button"
                        className="btn btn-outline-danger waves-effect"
                      >
                        Debit Points
                      </button>
                    </Link>
                </div>*/}
                </div>
                <div className="row mb-4">
                  <div className="col-md-3">
                    <div className="form-floating form-floating-outline mb-4">
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        onChange={this.handleChangeText}
                        value={this.state.name}
                      />
                      <label htmlFor="name">Name</label>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-floating form-floating-outline mb-4">
                      <input
                        type="text"
                        className="form-control"
                        name="email"
                        onChange={this.handleChangeText}
                        value={this.state.email}
                      />
                      <label htmlFor="name">Email</label>
                    </div>
                  </div>
                  <div className="col-md-3 mt-2">
                    <button
                      type="button"
                      className="btn btn-primary me-sm-3 me-1 waves-effect waves-light"
                      onClick={this.searchList.bind(this)}
                    >
                      Search
                    </button>
                    <button
                      type="reset"
                      className="btn btn-label-secondary waves-effect"
                      onClick={this.resetSearch.bind(this)}
                    >
                      Reset
                    </button>
                  </div>
                </div>

                <div className="card">
                  <div className="table-responsive text-nowrap p-1 mt-4">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Customer Name</th>
                          <th>Email</th>
                          <th>Credit Points</th>
                          <th>Debit Points</th>
                          <th>Reason</th>
                          <th>Created On</th>
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
                                  <strong>{item.customer_name}</strong>
                                </td>
                                <td>{item.customer_email}</td>
                                <td>
                                  {item.currency_symbol}
                                  {item.credit_points}
                                </td>
                                <td>
                                  {item.currency_symbol}
                                  {item.debit_points}
                                </td>
                                <td>
                                  {item.reason}
                                  {item.debit_reason !== "" &&
                                    item.debit_reason !== null && (
                                      <>
                                        <br />
                                        <b>Debit Reason:</b>
                                        {item.debit_reason}
                                      </>
                                    )}
                                </td>
                                <td>{item.created_on}</td>
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
