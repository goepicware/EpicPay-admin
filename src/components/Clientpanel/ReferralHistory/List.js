/* eslint-disable */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import cookie from "react-cookies";
import axios from "axios";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { apiUrl, adminlimit, clientheaderconfig } from "../../Helpers/Config";
import { GET_LISTDATA } from "../../../actions";
import { decodeValue, removeItem } from "../../Helpers/SettingHelper";
import Header from "../Layout/Header";
import Topmenu from "../Layout/Topmenu";
import Footer from "../Layout/Footer";
import Pagenation from "../Layout/Pagenation";
var module = "clientpanel/adminusers/";
var moduleName = "Referral History";
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
      user: "",
      start_date: "",
      end_date: "",
      userList: [],
      totalReferral: 0,
      totalReferralAmount: 0,
      exportUrl: "",
    };
    this.handleChangeText = this.handleChangeText.bind(this);
  }
  componentDidMount() {
    this.loadList(1);
    this.laodUserRole();
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.listdata !== this.state.listdata) {
      this.setState({
        listdata: nextProps.listdata,
        loading: false,
        totalRecords: nextProps.totalRecords,
        totalPage: nextProps.totalPages,
        totalReferral: nextProps.totalReferral,
        totalReferralAmount: nextProps.totalReferralAmount,
      });
    }
  }
  laodUserRole() {
    var urlShringTxt =
      apiUrl +
      "clientpanel/adminusers/dropdownlist?company_id=" +
      this.state.companyID;
    axios.get(urlShringTxt, clientheaderconfig).then((res) => {
      if (res.data.status === "ok") {
        this.setState({ userList: res.data.result });
      }
    });
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
  removeItem(deleteID) {
    var params = { delete_id: deleteID, company_id: this.state.companyID };
    var delurl = module + "delete";
    removeItem(params, delurl, "client");
  }
  handleChangeText(event) {
    var name = event.target.name;
    var value = event.target.value;
    this.setState({ [name]: value });
  }
  handleSelectChange(name, value) {
    this.setState({ [name]: value });
  }

  handleChangeDate(name, value) {
    this.setState({ [name]: value });
  }

  searchList() {
    this.setState({ loading: true }, function () {
      this.loadList(1);
    });
  }
  loadList(offset) {
    var addParams = "";

    if (this.state.user !== "") {
      addParams += "&user=" + this.state.user.value;
    }
    if (
      cookie.load("clientID") !== "" &&
      cookie.load("clientLoginType") === "SubAdmin"
    ) {
      addParams += "&user=" + decodeValue(cookie.load("clientID"));
    }

    if (this.state.start_date !== "" && this.state.end_date !== "") {
      addParams +=
        "&from_date=" +
        moment(this.state.start_date).format("Y-MM-DD HH:mm:ss") +
        "&to_date=" +
        moment(this.state.end_date).format("Y-MM-DD HH:mm:ss");
    } else if (this.state.start_date !== "" && this.state.end_date !== "") {
      addParams +=
        "&from_date=" +
        moment(this.state.start_date).format("Y-MM-DD HH:mm:ss");
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
      url: apiUrl + module + "referrallist",
      authType: "client",
    };
    var exportUrl =
      apiUrl +
      "clientpanel/adminusers/exportreferral?company_id=" +
      this.state.companyID +
      addParams;
    this.setState({ exportUrl: exportUrl });
    this.props.getListData(params);
  }
  resetSearch() {
    this.setState(
      {
        loading: true,
        name: "",
        email: "",
        userrole: "",
        status: "",
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
          <Header {...this.props} currentPage={"referral"} />
          <div className="layout-page">
            <Topmenu />

            <div className="content-wrapper">
              <div className="container-xxl flex-grow-1 container-p-y">
                <div className="row mb-3">
                  <div className="col-lg-10 col-md-6">
                    <h4 className="fw-bold">{moduleName}</h4>
                  </div>
                </div>
                <div className="row mb-4">
                  {cookie.load("clientLoginType") != "SubAdmin" && (
                    <div className="col-md-3">
                      <div className="form-floating form-floating-outline custm-select-box filter-select mb-4">
                        <Select
                          value={this.state.user}
                          onChange={this.handleSelectChange.bind(this, "user")}
                          placeholder="Select User"
                          isClearable={true}
                          options={this.state.userList}
                        />
                        <label className="select-box-label">User</label>
                      </div>
                    </div>
                  )}
                  <div className="col-md-4">
                    <div className="form-floating form-floating-outline mb-4">
                      <DatePicker
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        showTimeSelect
                        dropdownMode="select"
                        className="form-control"
                        selected={this.state.start_date}
                        dateFormat="d-MM-yyyy h:mm aa"
                        placeholderText="Start Date"
                        onChange={this.handleChangeDate.bind(
                          this,
                          "start_date"
                        )}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-floating form-floating-outline mb-4">
                      <DatePicker
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        showTimeSelect
                        dropdownMode="select"
                        className="form-control"
                        selected={this.state.end_date}
                        minDate={
                          this.state.start_date !== ""
                            ? this.state.start_date
                            : ""
                        }
                        dateFormat="d-MM-yyyy h:mm aa"
                        placeholderText="Start Date"
                        onChange={this.handleChangeDate.bind(this, "end_date")}
                      />
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
                    {this.state.listdata.length > 0 &&
                      this.state.exportUrl !== "" && (
                        <a
                          href={this.state.exportUrl}
                          target="_blank"
                          style={{ marginLeft: "4px" }}
                        >
                          <button
                            type="button"
                            className="btn btn-info waves-effect waves-light"
                          >
                            Export
                          </button>
                        </a>
                      )}
                  </div>
                </div>
                <div className="pagination-outline-primary justify-content-end mb-4">
                  <strong>Total Referral</strong> : {this.state.totalReferral}
                  <strong className="ml-4">Total Referral Amount</strong> :{" "}
                  {this.state.totalReferralAmount}
                </div>

                <div className="card">
                  <div className="table-responsive text-nowrap p-1 mt-4">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Staff Name</th>
                          <th>Customer Name</th>
                          <th>Customer Email</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Referral On</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.loading === true ? (
                          <tr>
                            <td colSpan={6} align="center">
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
                                  <strong>{item.stafName}</strong>
                                </td>
                                <td>{item.customerName}</td>
                                <td>{item.customer_email}</td>
                                <td>{item.payAmount}</td>
                                <td>
                                  {item.referralStatus == "C"
                                    ? "Paid"
                                    : "Registered"}
                                </td>
                                <td>{item.referralCreatedOn}</td>
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
  var totalReferral = 0;
  var totalReferralAmount = 0;
  if (Object.keys(state.listdata).length > 0) {
    listdataStatus = state.listdata[0].status;
    if (state.listdata[0].status === "ok") {
      listdata = state.listdata[0].result;
      totalPages = state.listdata[0].totalPages;
      totalRecords = state.listdata[0].totalRecords;
      totalReferral =
        state.listdata[0]?.referral !== "" &&
        typeof state.listdata[0]?.referral !== "undefined" &&
        typeof state.listdata[0]?.referral !== undefined
          ? state.listdata[0]?.referral.totalReferral
          : 0;
      totalReferralAmount =
        state.listdata[0]?.referral !== "" &&
        typeof state.listdata[0]?.referral !== "undefined" &&
        typeof state.listdata[0]?.referral !== undefined
          ? state.listdata[0]?.referral.totalReferralAmount
          : 0;
    }
  }
  return {
    listdata: listdata,
    totalPages: totalPages,
    totalRecords: totalRecords,
    totalReferral: totalReferral,
    totalReferralAmount: totalReferralAmount,
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
