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
      categoryList: [],
      loading: true,
    };
  }
  componentDidMount() {
    var params = {
      params: "limit=" + adminlimit + "&offset=1",
      url: apiUrl + "company/companycategory/category_list",
      type: "master",
    };
    this.props.getListData(params);
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.categoryList !== this.state.categoryList) {
      this.setState({
        categoryList: nextProps.categoryList,
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
            url: apiUrl + "company/companycategory/category_list",
            type: "master",
          };
          this.props.getListData(params);
        }
      );
    }
  };

  removeItem(CategoryId) {
    var categorydata = {category_id: CategoryId};
    removeItem(categorydata,'company/companycategory/category_delete');
  }

  render() {
    return (
      <div className="layout-wrapper layout-content-navbar">
        <div className="layout-container">
          <Header {...this.props} currentPage={"companycategory"} />
          <div className="layout-page">
            <Topmenu />

            <div className="content-wrapper">
              <div className="container-xxl flex-grow-1 container-p-y">
                <div className="row mb-3">
                  <div className="col-lg-10 col-md-6">
                    <h4 className="fw-bold">Company Category</h4>
                  </div>
                  <div className="col-lg-2 col-md-6 text-end">
                    <Link to={"/masterpanel/category/add"}>
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
                          <th>Category Name</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.loading === true ? (
                          <tr>
                            <td colSpan={3} align="center">
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
                          this.state.categoryList.length > 0 &&
                          this.state.categoryList.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td>
                                  <strong>{item.cate_name}</strong>
                                </td>
                                <td>{showStatus(item.cate_status)}</td>
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
                                          "/masterpanel/category/edit/" +
                                          encodeValue(item.cate_id)
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
                                          encodeValue(item.cate_id)
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
  var categoryList = Array();
  var categoryListStatus = "";
  var totalPages = 0;
  var totalRecords = 0;
  if (Object.keys(state.listdata).length > 0) {
    categoryListStatus = state.listdata[0].status;
    if (state.listdata[0].status === "ok") {
      categoryList = state.listdata[0].result;
      totalPages = state.listdata[0].totalPages;
      totalRecords = state.listdata[0].totalRecords;
    }
  }
  return {
    categoryList: categoryList,
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
