/* eslint-disable */
import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Select from "react-select";
import update from "immutability-helper";
import { validated } from "react-custom-validation";
import { GET_FORMPOST, GET_DETAILDATA } from "../../../actions";
import { apiUrl, clientheaderconfig } from "../../Helpers/Config";
import {
  showLoader,
  hideLoader,
  showAlert,
  userID,
  clientID,
  CompanyID,
  isEmpty,
  isSingleSelect,
} from "../../Helpers/SettingHelper";
import PageLoader from "../../Helpers/PageLoader";
import Header from "../Layout/Header";
import Topmenu from "../Layout/Topmenu";
import Footer from "../Layout/Footer";
var module = "clientpanel/productgroup/";
var moduleName = "Product Group";
var modulePath = "/clientpanel/catalog-group";
class Form extends Component {
  constructor(props) {
    super(props);
    var editID = "";
    if (this.props.match.path === "/clientpanel/catalog-group/edit/:EditID") {
      editID = this.props.match.params.EditID;
    }

    this.state = {
      editID: editID,
      pageloading: false,
      postdata: {
        group_name: "",
        group_outlet: "",
        status: "'",
        action: "add",
      },
      loading: true,
      formpost: [],
      companyDetail: [],
      productList: [],
      outletList: [],
    };
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    this.loadOutlet();
    this.loadProducts();

    this.setState({ pageloading: true });
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      this.state.formpost !== nextProps.formpost &&
      this.props.formpost != nextProps.formpost
    ) {
      if (nextProps.formpost.length > 0) {
        hideLoader("submit_frm", "class");
        var errMsg =
          nextProps.formpost[0].form_error !== ""
            ? nextProps.formpost[0].form_error
            : nextProps.formpost[0].message;
        if (nextProps.formpost[0].status === "success") {
          showAlert("Success", errMsg, "success", "No");
          var history = this.props.history;
          setTimeout(function () {
            history.push(modulePath);
          }, 1000);
        } else {
          showAlert("Error", errMsg, "error", "No");
        }
      }
    }
    if (
      this.state.companyDetail !== nextProps.detaildata &&
      this.state.editID !== ""
    ) {
      this.setState({ companyDetail: nextProps.detaildata }, function () {
        if (nextProps.detaildata[0].status === "ok") {
          var result = nextProps.detaildata[0].result;

          var pro_group_status =
            result.pro_group_status == "A" ? "Active" : "In Active";
          var status =
            result.pro_group_status !== "" && result.pro_group_status !== null
              ? {
                  label: pro_group_status,
                  value: result.pro_group_status,
                }
              : "";
          var group_products = result.group_products;
          var finaProList = [];
          this.state.productList.map((item) => {
            var subcate = [];
            var subcateCount = 0;
            if (item.sub_category.length > 0) {
              item.sub_category.map((item1) => {
                var producs = [];
                var prochekCount = 0;
                if (item1.products.length > 0) {
                  item1.products.map((item2) => {
                    var proCheck =
                      group_products.indexOf(item2.product_id) >= 0
                        ? true
                        : false;
                    if (proCheck === true) {
                      prochekCount++;
                    }
                    producs.push({
                      product_primary_id: item2.product_primary_id,
                      product_id: item2.product_id,
                      product_name: item2.product_name,
                      checked: proCheck,
                    });
                  });
                }
                var subcatCheck = prochekCount > 0 ? true : false;
                if (subcatCheck === true) {
                  subcateCount++;
                }
                subcate.push({
                  subcate_id: item1.subcate_id,
                  subcate_name: item1.subcate_name,
                  checked: subcatCheck,
                  products: producs,
                });
              });
            }
            var catCheck = subcateCount > 0 ? true : false;
            finaProList.push({
              cate_id: item.cate_id,
              cate_name: item.cate_name,
              checked: catCheck,
              sub_category: subcate,
            });
          });

          var clientupdatedata = {
            group_name: result.pro_group_name,
            group_outlet: result.group_outlet,

            status: status,
            action: "edit",
          };
          this.setState({
            postdata: clientupdatedata,
            productList: finaProList,
            pageloading: false,
          });
        } else {
          this.props.history.push(modulePath);
          showAlert("Error", "Invalid" + moduleName, "error");
        }
      });
    }
  }
  loadOutlet() {
    var urlShringTxt =
      apiUrl + "clientpanel/outlets/dropdownlist?company_id=" + CompanyID();
    axios.get(urlShringTxt, clientheaderconfig).then((res) => {
      if (res.data.status === "ok") {
        this.setState({ outletList: res.data.result });
      }
    });
  }
  loadProducts() {
    var urlShringTxt =
      apiUrl +
      "clientpanel/products/dropdownlistWithCategory?company_id=" +
      CompanyID();
    axios.get(urlShringTxt, clientheaderconfig).then((res) => {
      if (res.data.status === "ok") {
        var finaProList = [];
        res.data.result.map((item) => {
          var subcate = [];
          if (item.sub_category.length > 0) {
            item.sub_category.map((item1) => {
              var producs = [];
              if (item1.products.length > 0) {
                item1.products.map((item2) => {
                  producs.push({
                    product_primary_id: item2.product_primary_id,
                    product_id: item2.product_id,
                    product_name: item2.product_name,
                    checked: false,
                  });
                });
              }
              subcate.push({
                subcate_id: item1.subcate_id,
                subcate_name: item1.subcate_name,
                checked: false,
                products: producs,
              });
            });
          }
          finaProList.push({
            cate_id: item.cate_id,
            cate_name: item.cate_name,
            checked: false,
            sub_category: subcate,
          });
        });
        this.setState({ productList: finaProList }, function () {
          if (this.state.editID !== "") {
            var params = {
              params:
                "company_id=" + CompanyID() + "&detail_id=" + this.state.editID,
              url: apiUrl + module + "details",
              type: "client",
            };
            this.setState({ pageloading: true });
            this.props.getDetailData(params);
          } else {
            this.setState({ pageloading: false });
          }
        });
      }
    });
  }
  sateValChange = (field, value) => {};

  selectProduct = (catindex, subcateIndex, updindex, updType, event) => {
    var productList = this.state.productList;
    var checkedStatus = event.target.checked;
    var finaProList = [];
    productList.map((item, index) => {
      var subcate = [];
      var catChecked = item.checked;

      if (catindex === index && updType === "category") {
        catChecked = checkedStatus;
      }
      var totalSubCatCheck = 0;
      if (item.sub_category.length > 0) {
        item.sub_category.map((item1, index1) => {
          var subcatCheckd = item1.checked;
          if (
            catindex === index &&
            subcateIndex === index1 &&
            updType === "subcategory"
          ) {
            subcatCheckd = checkedStatus;
          }
          var producs = [];
          var totalProCheck = 0;
          if (item1.products.length > 0) {
            item1.products.map((item2, index2) => {
              var proChecked = item2.checked;
              if (
                catindex === index &&
                subcateIndex === index1 &&
                updindex === index2 &&
                updType === "product"
              ) {
                proChecked = checkedStatus;
              }
              if (
                catindex === index &&
                subcateIndex === index1 &&
                (updType === "category" || updType === "subcategory")
              ) {
                proChecked = checkedStatus;
              }
              if (proChecked === true) {
                totalProCheck++;
              }

              producs.push({
                product_primary_id: item2.product_primary_id,
                product_id: item2.product_id,
                product_name: item2.product_name,
                checked: proChecked,
              });
            });
          }
          if (totalProCheck === item1.products.length) {
            subcatCheckd = true;
          }
          if (subcatCheckd === true) {
            totalSubCatCheck++;
          }
          subcate.push({
            subcate_id: item1.subcate_id,
            subcate_name: item1.subcate_name,
            checked: subcatCheckd,
            products: producs,
          });
        });
      }
      if (totalSubCatCheck === item.sub_category.length) {
        catChecked++;
      }
      finaProList.push({
        cate_id: item.cate_id,
        cate_name: item.cate_name,
        checked: catChecked,
        sub_category: subcate,
      });
    });
    this.setState({ productList: finaProList });
  };

  handleChange(checked, name) {
    this.setState({ checked });
  }

  /* signin - start*/
  fieldChange = (field, value) => {
    this.setState(
      update(this.state, { postdata: { [field]: { $set: value } } })
    );
  };

  handleSubmit = () => {
    showLoader("submit_frm", "class");
    var postData = this.state.postdata;
    var product_id = [];
    if (this.state.productList.length > 0) {
      this.state.productList.map((cat) => {
        if (cat.sub_category.length > 0) {
          cat.sub_category.map((subcat) => {
            if (subcat.products.length > 0) {
              subcat.products.map((pro) => {
                if (pro.checked === true) {
                  product_id.push(pro.product_id);
                }
              });
            }
          });
        }
      });
    }
    var postObject = {
      group_name: postData.group_name,
      product_id: product_id.length > 0 ? product_id.join(",") : "",
      outlet_id:
        Object.keys(postData.group_outlet).length > 0
          ? postData.group_outlet.value
          : "",
      status:
        Object.keys(postData.status).length > 0 ? postData.status.value : "A",
      loginID: userID(),
      company_admin_id: clientID(),
      company_id: CompanyID(),
      action: postData.action,
    };

    var post_url = module + "add";
    if (postData.action === "edit" && this.state.editID !== "") {
      postObject["edit_id"] = this.state.editID;
      post_url = module + "update";
    }
    this.props.getFormPost(postObject, post_url, "client");
  };

  render() {
    return (
      <div className="layout-wrapper layout-content-navbar">
        <div className="layout-container">
          <Header {...this.props} currentPage={"catalog-group"} />
          <div className="layout-page">
            <Topmenu />
            <div className="content-wrapper">
              <div className="container-xxl flex-grow-1 container-p-y">
                <div className="row mb-3">
                  <div className="col-lg-10 col-md-6">
                    <h4 className="fw-bold">
                      {this.state.editID !== "" ? "Update" : "Add New"}{" "}
                      {moduleName}
                    </h4>
                  </div>
                  <div className="col-lg-2 col-md-6 text-end">
                    <Link to={modulePath}>
                      <button
                        type="button"
                        className="btn btn-outline-primary waves-effect"
                      >
                        Back
                      </button>
                    </Link>
                  </div>
                </div>
                <PostForm
                  {...this.props}
                  fields={this.state.postdata}
                  productList={this.state.productList}
                  outletList={this.state.outletList}
                  onChange={this.fieldChange}
                  onValid={this.handleSubmit}
                  selectProduct={this.selectProduct}
                  error_msg={this.state.error_msg}
                  onInvalid={() => {
                    console.log("Form invalid!");
                    setTimeout(function () {
                      if ($("#modulefrm .is-invalid").length > 0) {
                        $("html, body").animate(
                          {
                            scrollTop:
                              $(document)
                                .find("#modulefrm .is-invalid:first")
                                .offset().top - 100,
                          },
                          500
                        );
                      }
                    }, 500);
                  }}
                />
              </div>

              <Footer />
            </div>
          </div>
        </div>

        <div className="layout-overlay layout-menu-toggle"></div>
        <div className="drag-target"></div>
        <PageLoader pageloading={this.state.pageloading} />
      </div>
    );
  }
}

const mapStateTopProps = (state) => {
  return {
    formpost: state.formpost,
    detaildata: state.detaildata,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getFormPost: (formPayload, postUrl, authType) => {
      dispatch({ type: GET_FORMPOST, formPayload, postUrl, authType });
    },
    getDetailData: (datas) => {
      dispatch({ type: GET_DETAILDATA, datas });
    },
  };
};

export default connect(mapStateTopProps, mapDispatchToProps)(Form);

function validationConfig(props) {
  const { group_name, group_outlet, status } = props.fields;

  return {
    fields: ["group_name", "group_outlet", "status"],

    validations: {
      group_name: [[isEmpty, group_name]],
      group_outlet: [[isSingleSelect, group_outlet]],
      status: [[isSingleSelect, status]],
    },
  };
}

class PostForm extends Component {
  constructor(props) {
    super(props);
  }

  handleChange(name, value) {
    this.props.onChange(name, value);
  }
  handleSelectChange(name, value) {
    this.props.onChange(name, value);
  }

  render() {
    const { fields, onChange, onValid, onInvalid, $field, $validation } =
      this.props;
    let errMsgName,
      errMsgOutlet,
      errMsgStatus = "";
    if ($validation.group_name.error.reason !== undefined) {
      errMsgName = $validation.group_name.show && (
        <span className="error">{$validation.group_name.error.reason}</span>
      );
    }
    if ($validation.group_outlet.error.reason !== undefined) {
      errMsgOutlet = $validation.group_outlet.show && (
        <span className="error">{$validation.group_outlet.error.reason}</span>
      );
    }

    if ($validation.status.error.reason !== undefined) {
      errMsgStatus = $validation.status.show && (
        <span className="error">{$validation.status.error.reason}</span>
      );
    }

    return (
      <form className="card fv-plugins-bootstrap5" id="modulefrm">
        <div className="card-body row g-3">
          <div className="col-md-6">
            <div className="form-floating form-floating-outline mb-4">
              <input
                type="text"
                className={
                  errMsgName !== "" &&
                  errMsgName !== false &&
                  errMsgName !== undefined
                    ? "form-control is-invalid"
                    : "form-control"
                }
                name="group_name"
                value={fields.group_name}
                {...$field("group_name", (e) =>
                  onChange("group_name", e.target.value)
                )}
              />
              <label htmlFor="group_name">
                Group Name <span className="error">*</span>
              </label>
              {errMsgName}
            </div>
          </div>
          <div
            className={
              errMsgOutlet !== "" &&
              errMsgOutlet !== false &&
              errMsgOutlet !== undefined
                ? "col-md-6 error-select error"
                : "col-md-6"
            }
          >
            <div className="form-floating form-floating-outline custm-select-box mb-4">
              <Select
                value={fields.group_outlet}
                onChange={this.handleSelectChange.bind(this, "group_outlet")}
                placeholder={"Select Outlet"}
                options={this.props.outletList}
                isClearable={true}
              />
              <label className="select-box-label">
                Outlet<span className="error">*</span>
              </label>
              {errMsgOutlet}
            </div>
          </div>
          {this.props.productList.length > 0 && (
            <div className="col-md-12 col-12">
              <div className="mb-md-0 mb-4">
                <div className="jstree jstree-5 jstree-default jstree-checkbox-selection">
                  <ul className="jstree-container-ul jstree-children jstree-wholerow-ul jstree-no-dots">
                    {this.props.productList.map((item, index) => {
                      return (
                        <li
                          role="none"
                          className="jstree-node  jstree-open"
                          key={index}
                        >
                          <div unselectable="on" className="jstree-wholerow">
                            &nbsp;
                          </div>
                          <i className="jstree-icon jstree-ocl"></i>
                          <a
                            className={
                              item.checked === true
                                ? "jstree-anchor jstree-clicked"
                                : "jstree-anchor"
                            }
                            href={void 0}
                          >
                            <div className="form-check form-check-inline">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                onClick={this.props.selectProduct.bind(
                                  this,
                                  index,
                                  "",
                                  "",
                                  "category"
                                )}
                                checked={item.checked}
                              />
                              <i className="jstree-icon jstree-themeicon mdi mdi-folder-outline jstree-themeicon-custom"></i>
                              {item.cate_name}
                            </div>
                          </a>
                          {item.sub_category.length > 0 && (
                            <ul role="group" className="jstree-children">
                              {item.sub_category.map(
                                (subcateItem, subcateIndex) => {
                                  return (
                                    <li
                                      role="none"
                                      className="jstree-node  jstree-open"
                                      key={subcateIndex}
                                    >
                                      <div
                                        unselectable="on"
                                        className="jstree-wholerow"
                                      >
                                        &nbsp;
                                      </div>
                                      <i className="jstree-icon jstree-ocl"></i>
                                      <a
                                        className={
                                          subcateItem.checked === true
                                            ? "jstree-anchor jstree-clicked"
                                            : "jstree-anchor"
                                        }
                                        href={void 0}
                                      >
                                        <div className="form-check form-check-inline">
                                          <input
                                            className="form-check-input"
                                            type="checkbox"
                                            onClick={this.props.selectProduct.bind(
                                              this,
                                              index,
                                              subcateIndex,
                                              "",
                                              "subcategory"
                                            )}
                                            checked={subcateItem.checked}
                                          />
                                          <i className="jstree-icon jstree-themeicon mdi mdi-folder-outline jstree-themeicon-custom"></i>
                                          {subcateItem.subcate_name}
                                        </div>
                                      </a>
                                      {subcateItem.products.length > 0 && (
                                        <ul
                                          role="group"
                                          className="jstree-children"
                                        >
                                          {subcateItem.products.map(
                                            (proItem, proIndex) => {
                                              return (
                                                <li
                                                  role="none"
                                                  className="jstree-node  jstree-leaf"
                                                  key={proIndex}
                                                >
                                                  <div
                                                    unselectable="on"
                                                    className="jstree-wholerow"
                                                  >
                                                    &nbsp;
                                                  </div>
                                                  <i className="jstree-icon jstree-ocl"></i>
                                                  <a
                                                    className={
                                                      proItem.checked === true
                                                        ? "jstree-anchor jstree-clicked"
                                                        : "jstree-anchor"
                                                    }
                                                    href={void 0}
                                                  >
                                                    <div className="form-check form-check-inline">
                                                      <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        onClick={this.props.selectProduct.bind(
                                                          this,
                                                          index,
                                                          subcateIndex,
                                                          proIndex,
                                                          "product"
                                                        )}
                                                        checked={
                                                          proItem.checked
                                                        }
                                                      />
                                                      <i className="jstree-icon jstree-themeicon mdi mdi-alpha-p-circle-outline jstree-themeicon-custom"></i>
                                                      {proItem.product_name}
                                                    </div>
                                                  </a>
                                                </li>
                                              );
                                            }
                                          )}
                                        </ul>
                                      )}
                                    </li>
                                  );
                                }
                              )}
                            </ul>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          )}
          <div
            className={
              errMsgStatus !== "" &&
              errMsgStatus !== false &&
              errMsgStatus !== undefined
                ? "col-md-6 error-select error"
                : "col-md-6"
            }
          >
            <div className="form-floating form-floating-outline custm-select-box mb-4">
              <Select
                value={fields.status}
                onChange={this.handleSelectChange.bind(this, "status")}
                placeholder="Select Status"
                options={[
                  { value: "A", label: "Active" },
                  { value: "I", label: "In Active" },
                ]}
                isClearable={true}
              />
              <label className="select-box-label">
                Status<span className="error">*</span>
              </label>
              {errMsgStatus}
            </div>
          </div>
          <div className="pt-1 pb-4 pt-1 text-end">
            <button
              type="button"
              className="btn btn-primary me-sm-3 me-1 waves-effect waves-light submit_frm"
              onClick={(e) => {
                e.preventDefault();
                this.props.$submit(onValid, onInvalid);
              }}
            >
              Submit
            </button>
            <Link to={modulePath}>
              <button
                type="reset"
                className="btn btn-label-secondary waves-effect"
              >
                Cancel
              </button>
            </Link>
          </div>
        </div>
      </form>
    );
  }
}
PostForm = validated(validationConfig)(PostForm);
