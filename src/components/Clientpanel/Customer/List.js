/* eslint-disable */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import cookie from "react-cookies";
import Select from "react-select";
import { apiUrl, adminlimit } from "../../Helpers/Config";
import { GET_LISTDATA } from "../../../actions";
import {
  showStatus,
  encodeValue,
  removeItem,
  clientID,
  CompanyID,
  showAlert,
  showLoader,
  hideLoader,
} from "../../Helpers/SettingHelper";
import Header from "../Layout/Header";
import Topmenu from "../Layout/Topmenu";
import Footer from "../Layout/Footer";
import Pagenation from "../Layout/Pagenation";
var module = "clientpanel/customer/";
var moduleName = "Customers";
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
      phone: "",
      status: "",
      errorFile: false,
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
    if (this.state.phone !== "") {
      addParams += "&phone=" + this.state.phone;
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
        email: "",
        phone: "",
        storeID: "",
        status: "",
      },
      function () {
        this.loadList(1);
      }
    );
  }

  importCustomer() {
    $("#customermodal").modal("toggle");
  }

  confirmimportCustomer() {
    var formData = new FormData();
    var imagefile = document.querySelector("#cusatomer_file");
    if (imagefile.files.length === 0) {
      this.setState({ errorFile: true });
      return false;
    } else {
      this.setState({ errorFile: false });
    }

    showLoader("import_cust");
    formData.append("cusatomer_file", imagefile.files[0]);
    formData.append("company_admin_id", clientID());
    formData.append("company_id", CompanyID());
    axios
      .post(apiUrl + module + "import", formData, {
        headers: {
          Authorization: cookie.load("clientAccessToken"),
          "Content-Type": "multipart/form-data",
        },
      })
      .then(function (res) {
        $("#customermodal").modal("toggle");
        hideLoader("import_cust");
        $("#cusatomer_file").val("");
        var errMsg =
          res.data.form_error !== "" ? res.data.form_error : res.data.message;
        if (res.data.status === "success") {
          showAlert("Success", errMsg, "success", "No");
        } else {
          showAlert("Error", errMsg, "error", "No");
        }
      });
  }

  render() {
    return (
      <div className="layout-wrapper layout-content-navbar">
        <div className="layout-container">
          <Header {...this.props} currentPage={"customers"} />
          <div className="layout-page">
            <Topmenu />
            <a
              href={void 0}
              className="hidden"
              data-bs-toggle="modal"
              data-bs-target="#customermodal"
              id="openmodel"
            >
              Load
            </a>

            <div className="content-wrapper">
              <div className="container-xxl flex-grow-1 container-p-y">
                <div className="row mb-3">
                  <div className="col-lg-9 col-md-6">
                    <h4 className="fw-bold">{moduleName}</h4>
                  </div>
                  <div className="col-lg-3 col-md-6 text-end">
                    <Link to={this.state.path + "add"}>
                      <button
                        type="button"
                        className="btn btn-outline-primary waves-effect"
                      >
                        Add New
                      </button>
                    </Link>
                    &nbsp;
                    {/*<button
                      type="button"
                      className="btn btn-outline-primary waves-effect"
                      onClick={this.importCustomer.bind(this)}
                    >
                      Import
                    </button>*/}
                  </div>
                  {/*  <div className="col-lg-2 col-md-6 text-end">
                    
                  </div> */}
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
                  <div className="col-md-2">
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
                  <div className="col-md-2">
                    <div className="form-floating form-floating-outline mb-4">
                      <input
                        type="text"
                        className="form-control"
                        name="phone"
                        onChange={this.handleChangeText}
                        value={this.state.phone}
                      />
                      <label htmlFor="name">Phone</label>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="form-floating form-floating-outline custm-select-box filter-select mb-4">
                      <Select
                        value={this.state.status}
                        onChange={this.handleSelectChange.bind(this, "status")}
                        placeholder="Select"
                        isClearable={true}
                        options={[
                          { value: "A", label: "Active" },
                          { value: "I", label: "In Active" },
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
                          <th>Customer Name</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Status</th>
                          <td>Register On </td>
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
                                  <strong>{item.customer_name}</strong>
                                </td>
                                <td>{item.customer_email}</td>
                                <td>{item.customer_phone}</td>
                                <td>{showStatus(item.customer_status)}</td>
                                <td>{item.customer_created_on}</td>
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
                                          encodeValue(item.customer_id)
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
                                          encodeValue(item.customer_id)
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
                              No Customer Found
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
        <div
          className="modal fade"
          id="customermodal"
          aria-hidden="true"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
        >
          <div
            className="modal-dialog modal-lg modal-dialog-centered"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Import Customer</h4>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className=" mb-4">
                  <div className="card-body mt-3">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-floating form-floating-outline mb-4">
                          <div className="mb-3">
                            <label htmlFor="formFile" className="form-label">
                              Import Customer File
                            </label>
                            <input
                              className="form-control"
                              type="file"
                              id="cusatomer_file"
                              name="cusatomer_file"
                            />
                            {this.state.errorFile === true && (
                              <span className="error">
                                This field is required
                              </span>
                            )}
                          </div>
                        </div>
                        <a href="/files/customer.csv">Downlaod Sample File</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-label-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  id="import_cust"
                  onClick={this.confirmimportCustomer.bind(this)}
                >
                  Import
                </button>
              </div>
            </div>
          </div>
        </div>
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
