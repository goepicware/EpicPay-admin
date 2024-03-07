/* eslint-disable */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import cookie from "react-cookies";
import axios from "axios";
import Select from "react-select";
import { apiUrl, adminlimit, clientheaderconfig } from "../../Helpers/Config";
import { GET_LISTDATA } from "../../../actions";
import {
  showStatus,
  encodeValue,
  removeItem,
  showSorting,
} from "../../Helpers/SettingHelper";
import Header from "../Layout/Header";
import Topmenu from "../Layout/Topmenu";
import Footer from "../Layout/Footer";
import Pagenation from "../Layout/Pagenation";
var module = "clientpanel/wallettopupplan/";
var moduleName = "Credit Setup";
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
      status: "",
      storeID: "",
      outletList: [],
      sortField: "topupplan_display_name",
      sortType: "ASC",
    };
    this.handleChangeText = this.handleChangeText.bind(this);
  }
  componentDidMount() {
    this.loadList(1);
    this.loadOutlet();
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
  loadOutlet() {
    var urlShringTxt =
      apiUrl +
      "clientpanel/outlets/dropdownlist?company_id=" +
      this.state.companyID;
    axios.get(urlShringTxt, clientheaderconfig).then((res) => {
      if (res.data.status === "ok") {
        var result = [{ label: "All Outlet", value: "alloutlet" }];
        res.data.result.map((item) => {
          result.push(item);
        });
        this.setState({ outletList: result });
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
    if (
      this.state.storeID !== null &&
      Object.keys(this.state.storeID).length > 0
    ) {
      addParams += "&storeID=" + this.state.storeID.value;
    }
    if (
      this.state.status !== null &&
      Object.keys(this.state.status).length > 0
    ) {
      addParams += "&status=" + this.state.status.value;
    }

    var params = {
      params:
        "limit=" +
        adminlimit +
        "&offset=" +
        offset +
        "&company_id=" +
        this.state.companyID +
        addParams +
        "&sortField=" +
        this.state.sortField +
        "&sortType=" +
        this.state.sortType,
      url: apiUrl + module + "list",
      authType: "client",
    };
    this.props.getListData(params);
  }
  sortItem(sortField) {
    var sortType = "";
    if (sortField === this.state.sortField) {
      if (this.state.sortType == "ASC") {
        sortType = "DESC";
      } else {
        sortType = "ASC";
      }
    } else {
      sortType = "ASC";
    }
    this.setState(
      { sortField: sortField, sortType: sortType, loading: true },
      function () {
        this.loadList(1);
      }
    );
  }
  resetSearch() {
    this.setState(
      {
        loading: true,
        name: "",
        storeID: "",
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
          <Header {...this.props} currentPage={"wallettopupplans"} />
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
                      <label htmlFor="name">Topup Plan Title</label>
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="form-floating form-floating-outline custm-select-box filter-select mb-4">
                      <Select
                        value={this.state.storeID}
                        onChange={this.handleSelectChange.bind(this, "storeID")}
                        placeholder="Select Outlet"
                        isClearable={true}
                        options={this.state.outletList}
                      />
                      <label className="select-box-label">Outlet</label>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-floating form-floating-outline custm-select-box filter-select mb-4">
                      <Select
                        value={this.state.status}
                        onChange={this.handleSelectChange.bind(this, "status")}
                        placeholder="Select Status"
                        isClearable={true}
                        options={[
                          { value: "A", label: "Active" },
                          { value: "I", label: "In Active" },
                        ]}
                      />
                      <label className="select-box-label">Status</label>
                    </div>
                  </div>
                  <div className="col-md-1 mt-2">
                    <button
                      type="button"
                      className="btn btn-primary me-sm-3 me-1 waves-effect waves-light"
                      onClick={this.searchList.bind(this)}
                    >
                      Search
                    </button>
                  </div>
                  <div className="col-md-1 mt-2 cust-ml-5">
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
                          <th
                            onClick={this.sortItem.bind(
                              this,
                              "topupplan_display_name"
                            )}
                          >
                            Plan Title &nbsp;
                            {this.state.sortField === "topupplan_display_name"
                              ? showSorting(this.state.sortType)
                              : showSorting("ASC")}
                          </th>
                          <th>Outlet</th>
                          <th
                            onClick={this.sortItem.bind(
                              this,
                              "topupplan_display_name"
                            )}
                          >
                            credits &nbsp;
                            {this.state.sortField === "topupplan_credits_amount"
                              ? showSorting(this.state.sortType)
                              : showSorting("ASC")}
                          </th>
                          <th
                            onClick={this.sortItem.bind(
                              this,
                              "topupplan_bonus_amount"
                            )}
                          >
                            bonus &nbsp;
                            {this.state.sortField === "topupplan_bonus_amount"
                              ? showSorting(this.state.sortType)
                              : showSorting("ASC")}
                          </th>
                          <th>Start Date</th>
                          <th>End Date</th>
                          <td>Status</td>
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
                        ) : this.state.listdata.length > 0 ? (
                          this.state.listdata.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td>
                                  <strong>{item.topupplan_display_name}</strong>
                                </td>
                                <td>
                                  {item.outlet_name !== "" &&
                                  item.outlet_name !== null
                                    ? item.outlet_name
                                    : "All Outlet"}
                                </td>
                                <td>${item.topupplan_credits_amount}</td>
                                <td>${item.topupplan_bonus_amount}</td>
                                <td>{item.topupplan_start_date}</td>
                                <td>{item.topupplan_end_date}</td>
                                <td>{showStatus(item.topupplan_status)}</td>
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
                                          encodeValue(item.topupplan_id)
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
                                          encodeValue(item.topupplan_id)
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
                              No Plans Found
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
