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
} from "../../Helpers/SettingHelper";
import Header from "../Layout/Header";
import Topmenu from "../Layout/Topmenu";
import Footer from "../Layout/Footer";
import Pagenation from "../Layout/Pagenation";
var module = "clientpanel/wallettopupplan/";
var moduleName = "Wallet Topup History";
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
        addParams,
      url: apiUrl + module + "topuphistory",
      authType: "client",
    };
    this.props.getListData(params);
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
          <Header {...this.props} currentPage={"wallettopuphistory"} />
          <div className="layout-page">
            <Topmenu />

            <div className="content-wrapper">
              <div className="container-xxl flex-grow-1 container-p-y">
                <div className="row mb-3">
                  <div className="col-lg-10 col-md-6">
                    <h4 className="fw-bold">{moduleName}</h4>
                  </div>
                  <div className="col-lg-2 col-md-6 text-end">
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

                  {/*<div className="col-md-3">
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
                  </div>*/}

                  {/*<div className="col-md-3">
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
                  </div>*/}
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
                          <th>Plan Title</th>
                          {/*<th>Outlet</th>*/}
                          <th>Credits</th>
                          <th>Amount</th>
                          <th>Topup Date</th>
                          <th>Customer Name</th>
                          <th>Customer Email</th>
                          <th>Customer Phone</th>
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
                                  <strong>{item.wallettopup_display_name}</strong>
                                </td>
                                <td>({item.wallettopup_credits_amount} + {item.wallettopup_bonus_amount}) {item.wallettopup_total_credits}</td>
                                <td>${item.wallettopup_total_amount}</td>
                                <td>{item.wallettopup_created_on}</td>
                                <td>{item.wallettopup_customer_name}</td>
                                <td>{item.wallettopup_customer_email}</td>
                                <td>{item.wallettopup_customer_phone}</td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td className="text-center" colSpan={7}>
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
