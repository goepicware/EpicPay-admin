/* eslint-disable */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import cookie from "react-cookies";
import Select from "react-select";
import axios from "axios";
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
var module = "clientpanel/menuitem/";
var moduleName = "Menu Item";
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
      menuGroup: [],
      name: "",
      menu_group: "",
      status: "",
    };
    this.handleChangeText = this.handleChangeText.bind(this);
  }
  componentDidMount() {
    this.loadList(1);
    this.loadmenuGroup();
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
  removeItem(deleteID) {
    var params = { delete_id: deleteID, company_id: this.state.companyID };
    var delurl = module + "delete";
    removeItem(params, delurl, "client");
  }
  loadmenuGroup() {
    var urlShringTxt =
      apiUrl +
      "clientpanel/menugroup/dropdownlist?company_id=" +
      this.state.companyID;
    axios.get(urlShringTxt, clientheaderconfig).then((res) => {
      if (res.data.status === "ok") {
        this.setState({ menuGroup: res.data.result });
      }
    });
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
      this.state.menu_group !== null &&
      Object.keys(this.state.menu_group).length > 0
    ) {
      addParams += "&menu_group=" + this.state.menu_group.value;
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
        menu_group: "",
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
          <Header {...this.props} currentPage={"menuitem"} />
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
                      <label htmlFor="outlet_pos_id">Group Name</label>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-floating form-floating-outline custm-select-box filter-select">
                      <Select
                        value={this.state.menu_group}
                        onChange={this.handleSelectChange.bind(
                          this,
                          "menu_group"
                        )}
                        placeholder="Select Menu Group"
                        isClearable={true}
                        options={this.state.menuGroup}
                      />
                      <label className="select-box-label">Menu Group</label>
                    </div>
                  </div>

                  <div className="col-md-2">
                    <div className="form-floating form-floating-outline custm-select-box filter-select">
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
                  <div className="col-md-1 mt-2">
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
                          <th>Menu Title</th>
                          <th>Menu Group Name</th>
                          <th>Menu Type</th>
                          <th>Sequence</th>
                          <th>Status</th>
                          <th>Actions</th>
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
                                  <strong>{item.nav_title}</strong>
                                </td>
                                <td>{item.menu_title}</td>
                                <td>
                                  {item.nav_parent_title !== "" &&
                                  item.nav_parent_title !== null
                                    ? "Sub Menu"
                                    : "Main Menu"}
                                </td>

                                <td>{item.nav_position}</td>
                                <td>{showStatus(item.nav_status)}</td>
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
                                          encodeValue(item.nav_id)
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
                                          encodeValue(item.nav_id)
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
                            <td className="text-center" colSpan={6}>
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
