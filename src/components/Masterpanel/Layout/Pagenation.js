/* eslint-disable */
import React, { Component } from "react";
class Pagenation extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  loadPages() {
    var start = 1;
    if (this.props.params.currentPage > 3) {
      start = this.props.params.currentPage - 2;
    }
    var end = parseInt(this.props.params.currentPage) + 2;
    console.log(end, start, "endendend");
    if (this.props.params.totalPage < end) {
      end = this.props.params.totalPage;
    }

    var pageArray = [];
    for (let index = start; index <= end; index++) {
      pageArray.push(index);
    }
    return pageArray.map((item, index) => {
      return (
        <li
          className={
            this.props.params.currentPage === item
              ? "page-item active"
              : "page-item"
          }
          key={index}
        >
          <a
            className="page-link waves-effect"
            href={void 0}
            onClick={this.gotoPage.bind(this, item)}
          >
            {item}
          </a>
        </li>
      );
    });
  }

  gotoPage(goPage) {
    this.props.sateValChange("page", goPage);
  }

  render() {
    if (this.props.params.totalRecords > 0) {
      var prevPage =
        this.props.params.currentPage - 1 > 0
          ? this.props.params.currentPage - 1
          : 1;
      var nextPage =
        parseInt(this.props.params.currentPage) + 1 <
        this.props.params.totalPage
          ? parseInt(this.props.params.currentPage) + 1
          : this.props.params.totalPage;
      return (
        <nav className="mt-4 px-4" aria-label="Page navigation ">
          <ul className="pagination pagination-rounded pagination-outline-primary justify-content-end">
            {this.props.params.currentPage !== 1 && (
              <li className="page-item first">
                <a
                  className="page-link waves-effect"
                  href={void 0}
                  onClick={this.gotoPage.bind(this, 1)}
                >
                  <i className="tf-icon mdi mdi-chevron-double-left"></i>
                </a>
              </li>
            )}
            <li
              className={
                this.props.params.currentPage === 1
                  ? "page-item prev disabled"
                  : "page-item prev "
              }
            >
              <a
                className="page-link waves-effect"
                href={void 0}
                onClick={this.gotoPage.bind(this, prevPage)}
              >
                <i className="tf-icon mdi mdi-chevron-left"></i>
              </a>
            </li>
            {this.loadPages()}
            <li
              className={
                this.props.params.currentPage === this.props.params.totalPage
                  ? "page-item next disabled"
                  : "page-item next"
              }
            >
              <a
                className="page-link waves-effect"
                href={void 0}
                onClick={this.gotoPage.bind(this, nextPage)}
              >
                <i className="tf-icon mdi mdi-chevron-right"></i>
              </a>
            </li>
            {this.props.params.currentPage !== this.props.params.totalPage && (
              <li className="page-item last">
                <a
                  className="page-link waves-effect"
                  href={void 0}
                  onClick={this.gotoPage.bind(
                    this,
                    this.props.params.totalPage
                  )}
                >
                  <i className="tf-icon mdi mdi-chevron-double-right"></i>
                </a>
              </li>
            )}
          </ul>
        </nav>
      );
    } else {
      return;
    }
  }
}

export default Pagenation;
