/* eslint-disable */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import cookie from "react-cookies";
import Select from "react-select";
import { apiUrl, adminlimit } from "../../Helpers/Config";
import { GET_LISTDATA } from "../../../actions";
import { encodeValue, removeItem } from "../../Helpers/SettingHelper";
import Header from "../Layout/Header";
import Topmenu from "../Layout/Topmenu";
import Footer from "../Layout/Footer";
import Pagenation from "../Layout/Pagenation";
var module = "clientpanel/outlets/";
class List extends Component {
  constructor(props) {
    super(props);
    var companyID = cookie.load("companyID");
    this.state = {
      companyID: companyID,
      totalRecords: 0,
      totalPage: 0,
      currentPage: 1,
      listdata: [],
      loading: true,
      name: "",
      email: "",
      contactnumber: "",
      status: "",
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
    if (this.state.email !== "") {
      addParams += "&email=" + this.state.email;
    }
    if (this.state.contactnumber !== "") {
      addParams += "&contactnumber=" + this.state.contactnumber;
    }
    if (Object.keys(this.state.status).length > 0) {
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
          <Header {...this.props} currentPage={"outlet"} />
          <div className="layout-page">
            <Topmenu />

            <div className="content-wrapper">
              <div className="container-xxl flex-grow-1 container-p-y">
                <div className="row mb-3">
                  <div className="col-lg-10 col-md-6">
                    <h4 className="fw-bold">Outlets</h4>
                  </div>
                  <div className="col-lg-2 col-md-6 text-end">
                    <Link to={"/clientpanel/outlet/add"}>
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
                      <label htmlFor="outlet_pos_id">Name</label>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="form-floating form-floating-outline mb-4">
                      <input
                        type="text"
                        className="form-control"
                        name="email"
                        onChange={this.handleChangeText}
                        value={this.state.email}
                      />
                      <label htmlFor="outlet_pos_id">Email</label>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="form-floating form-floating-outline mb-4">
                      <input
                        type="text"
                        className="form-control"
                        name="contactnumber"
                        onChange={this.handleChangeText}
                        value={this.state.contactnumber}
                      />
                      <label htmlFor="outlet_pos_id">Contact Number</label>
                    </div>
                  </div>

                  <div className="col-md-2">
                    <div className="form-floating form-floating-outline custm-select-box filter-select">
                      <Select
                        value={this.state.status}
                        onChange={this.handleSelectChange.bind(this, "status")}
                        placeholder="Select"
                        options={[
                          { value: "1", label: "Open" },
                          { value: "0", label: "Closed" },
                        ]}
                      />
                      <label className="select-box-label">Status</label>
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
                          <th>Outlet Name</th>
                          <th>Outlet ID</th>
                          <th>Email</th>
                          <th>Contact No.</th>
                          <th>Address</th>
                          <th>Sort Order</th>
                          <th>Shop Open Status</th>
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
                              <tr
                                key={index}
                                className={
                                  item.outlet_availability === "0"
                                    ? "text-danger"
                                    : ""
                                }
                              >
                                <td>
                                  <strong>{item.outlet_name}</strong>
                                </td>
                                <td className="text-center">
                                  {item.outlet_id}
                                </td>
                                <td>
                                  <a
                                    href={"mailto:" + item.outlet_email}
                                    className={
                                      item.outlet_availability === "0"
                                        ? "text-danger"
                                        : ""
                                    }
                                  >
                                    {item.outlet_email}
                                  </a>
                                </td>
                                <td>{item.outlet_phone}</td>
                                <td>{item.outlet_address_line1}</td>
                                <td className="text-center">
                                  {item.outlet_sequence}
                                </td>
                                <td>
                                  {item.outlet_availability === "1"
                                    ? "Open"
                                    : "Closed"}
                                </td>
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
                                          "/clientpanel/outlet/edit/" +
                                          encodeValue(item.outlet_id)
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
                                          encodeValue(item.outlet_id)
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
                              No Outlet Found
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
