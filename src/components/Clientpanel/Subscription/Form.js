/* eslint-disable */
import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Select from "react-select";
import update from "immutability-helper";
import { validated } from "react-custom-validation";
import { GET_FORMPOST, GET_DETAILDATA } from "../../../actions";
import {
  apiUrl,
  clientheaderconfig,
  awsCredentials,
  bucketName,
  foldername,
} from "../../Helpers/Config";
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
import Editor from "../Layout/Editor";
import AWS from "aws-sdk";
AWS.config.update(awsCredentials);
const s3 = new AWS.S3();
var module = "clientpanel/paintbasedproducts/";
var moduleName = "Subscription";
var modulePath = "/clientpanel/subscription";
var emptyVoucher = [{ product: "", quantity: "" }];
var subscriptionTypes = [
  "Weekly",
  "Monthly",
  "Quarterly",
  "Biannually",
  "Annually",
];
class Form extends Component {
  constructor(props) {
    super(props);
    var editID = "";
    if (this.props.match.path === "/clientpanel/subscription/edit/:EditID") {
      editID = this.props.match.params.EditID;
    }
    this.state = {
      editID: editID,
      pageloading: false,
      clientdata: {
        assign_outlet: "",
        product_name: "",
        alias_name: "",
        sku: "",
        short_description: "",
        long_description: "",
        status: [],
        thumbnail: "",
        subscription: {
          weekly: {
            amount: "",
            infotext: "",
            vouchers: emptyVoucher,
          },
          monthly: {
            amount: "",
            infotext: "",
            vouchers: emptyVoucher,
          },
          quarterly: {
            amount: "",
            infotext: "",
            vouchers: emptyVoucher,
          },
          biannually: {
            amount: "",
            infotext: "",
            vouchers: emptyVoucher,
          },
          annually: {
            amount: "",
            infotext: "",
            vouchers: emptyVoucher,
          },
        },
        action: "add",
      },
      loading: true,
      formpost: [],
      companyDetail: [],
      outletList: [],
      voucherList: [],
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.loadOutlet();
    this.loadVoucherProduct();
    if (this.state.editID !== "") {
      var params = {
        params: "company_id=" + CompanyID() + "&detail_id=" + this.state.editID,
        url: apiUrl + module + "details",
        type: "client",
      };
      this.setState({ pageloading: true });
      this.props.getDetailData(params);
    }
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
          var product_status =
            result.product_status == "A" ? "Active" : "In Active";
          var status =
            result.product_status !== "" && result.product_status !== null
              ? {
                  label: product_status,
                  value: result.product_status,
                }
              : "";
          var clientupdatedata = {
            assign_outlet: result.outlet.length > 0 ? result.outlet[0] : "",
            product_name: result.product_name,
            alias_name: result.product_alias,
            sku: result.product_sku,
            short_description: result.product_short_description,
            long_description: result.product_long_description,
            thumbnail:
              result.product_thumbnail !== "" &&
              result.product_thumbnail !== null
                ? result.product_thumbnail
                : "",
            subscription:
              result.product_subscription !== "" &&
              result.product_subscription !== null
                ? JSON.parse(result.product_subscription)
                : {
                    weekly: {
                      amount: "",
                      infotext: "",
                      vouchers: emptyVoucher,
                    },
                    monthly: {
                      amount: "",
                      infotext: "",
                      vouchers: emptyVoucher,
                    },
                    quarterly: {
                      amount: "",
                      infotext: "",
                      vouchers: emptyVoucher,
                    },
                    biannually: {
                      amount: "",
                      infotext: "",
                      vouchers: emptyVoucher,
                    },
                    annually: {
                      amount: "",
                      infotext: "",
                      vouchers: emptyVoucher,
                    },
                  },
            status: status,
            action: "edit",
          };
          this.setState({ clientdata: clientupdatedata, pageloading: false });
        } else {
          this.setState({ pageloading: false });
          this.props.history.push(modulePath);
          showAlert("Error", "Invalid Product", "error");
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
  loadVoucherProduct() {
    var urlShringTxt =
      apiUrl +
      module +
      "dropdownVoucher?company_id=" +
      CompanyID() +
      "&product_type=5";
    axios.get(urlShringTxt, clientheaderconfig).then((res) => {
      if (res.data.status === "ok") {
        this.setState({ voucherList: res.data.result });
      }
    });
  }

  sateValChange = (field, value) => {
    if (field === "page") {
    }
  };

  handleChange(checked, name) {
    this.setState({ checked });
  }

  /* signin - start*/
  fieldChange = (field, value) => {
    this.setState(
      update(this.state, { clientdata: { [field]: { $set: value } } }),
      function () {
        if (field === "assign_outlet") {
        }
      }
    );
  };

  handleSubmit = () => {
    var postData = this.state.clientdata;
    var cycleerror = 0;
    //var producterror = "";

    var subscription = postData.subscription;
    var updsubscription = [];
    subscriptionTypes.map((item) => {
      var subscribe = subscription[item.toLowerCase()];

      var updvouchers = [];
      if (subscribe.vouchers.length > 0) {
        subscribe.vouchers.map((vitem) => {
          var product = vitem?.product || "";
          var quantity = vitem?.quantity || "";
          if (product !== "" && quantity !== "") {
            updvouchers.push({
              product: product.value,
              quantity: quantity,
            });
          }
        });
      }
      if (updvouchers.length === 0) {
        updvouchers.push(emptyVoucher[0]);
      }
      if (subscribe.amount.trim() !== "") {
        cycleerror++;
      }
      updsubscription[item.toLowerCase()] = {
        amount: subscribe.amount,
        infotext: subscribe.infotext,
        vouchers: updvouchers,
      };
    });
    if (cycleerror === 0) {
      showAlert("warning", "Please Select Any One Subscription Cycle");
      return false;
    }
    showLoader("submit_frm", "class");
    var postObject = {
      product_type: 6,
      product_name: postData.product_name,
      shop_type: 1,
      alias_name: postData.alias_name,
      sku: postData.sku,
      short_description: postData.short_description,
      long_description: postData.long_description,
      thumbnail: "",
      status:
        Object.keys(postData.status).length > 0 ? postData.status.value : "A",
      paired_products: "",
      assign_outlet:
        Object.keys(postData.assign_outlet).length > 0
          ? postData.assign_outlet.value
          : "",
      company_catid: 17,
      thumbnail: postData.thumbnail,
      subscription: JSON.stringify(postData.subscription),
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
          <Header {...this.props} currentPage={"subscription"} />
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
                  fields={this.state.clientdata}
                  onChange={this.fieldChange}
                  onValid={this.handleSubmit}
                  error_msg={this.state.error_msg}
                  outletList={this.state.outletList}
                  voucherList={this.state.voucherList}
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
  const { assign_outlet, product_name, sku, status } = props.fields;

  return {
    fields: ["assign_outlet", "product_name", "sku", "status"],

    validations: {
      assign_outlet: [[isSingleSelect, assign_outlet]],
      product_name: [[isEmpty, product_name]],
      sku: [[isEmpty, sku]],
      status: [[isSingleSelect, status]],
    },
  };
}

class PostForm extends Component {
  constructor(props) {
    super(props);
    this.setContent = this.setContent.bind(this);
    this.setLoginContent = this.setLoginContent.bind(this);
  }

  handleChange(name, value) {
    this.props.onChange(name, value);
  }
  handleSelectChange(name, value) {
    this.props.onChange(name, value);
  }

  setContent(value) {
    this.props.onChange("short_description", value);
  }
  setLoginContent(value) {
    this.props.onChange("long_description", value);
  }
  handleChangeCheck(name, event) {
    var value = event.target.checked === true ? "1" : "0";
    this.props.onChange(name, value);
  }
  handleChangeSubscription(types, name, event) {
    var subscription = this.props.fields.subscription;
    var nameDetails = types.toLowerCase();
    if (name === "amount") {
      var validNumber = new RegExp(/^\d*\.?\d*$/);
      if (!validNumber.test(event.target.value)) {
        return false;
      }
    }
    subscription[nameDetails][name] = event.target.value;
    this.props.onChange("subscription", subscription);
  }

  handleChangeVoucher(cycleType, updIndex, name, event) {
    var subscription = this.props.fields.subscription;
    var vouchers = subscription[cycleType]["vouchers"];
    var updatevoucher = [];
    if (vouchers.length > 0) {
      vouchers.map((item, index) => {
        if (updIndex === index) {
          var product = item.product;
          if (name === "product") {
            product = event;
          }
          var quantity = item.quantity;
          if (name === "quantity") {
            var validNumber = new RegExp(/^\d*\.?\d*$/);
            if (validNumber.test(event.target.value)) {
              quantity = event.target.value;
            }
          }
          updatevoucher.push({ product: product, quantity: quantity });
        } else {
          updatevoucher.push(item);
        }
      });
    }
    subscription[cycleType]["vouchers"] = updatevoucher;
    this.props.onChange("subscription", subscription);
  }

  addVoucher(cycleType) {
    var subscription = this.props.fields.subscription;
    var vouchers = subscription[cycleType]["vouchers"];
    vouchers.push(emptyVoucher);
    subscription[cycleType]["vouchers"] = vouchers;
    this.props.onChange("subscription", subscription);
  }
  removeVoucher(cycleType, removeIndex) {
    var subscription = this.props.fields.subscription;
    var vouchers = subscription[cycleType]["vouchers"];
    var updatevoucher = [];
    if (vouchers.length > 0) {
      vouchers.map((item, index) => {
        if (removeIndex !== index) {
          updatevoucher.push(item);
        }
      });
    }
    subscription[cycleType]["vouchers"] = updatevoucher;
    this.props.onChange("subscription", subscription);
  }

  async uplaodFiles(imageType) {
    var imagefile = document.querySelector("#" + imageType);
    const file = imagefile.files[0];
    const params = {
      Bucket: bucketName,
      Key: `media/${foldername}/category/${file.name}`,
      Body: file,
      ACL: "public-read",
    };
    const { Location } = await s3.upload(params).promise();
    this.props.onChange(imageType, Location);
    $("#" + imageType).val("");
  }
  async removeImage(fileNamme, imageType) {
    var fileNammeSplit = fileNamme.split("/");
    var params = {
      Bucket: bucketName,
      Key: `media/${foldername}/category/${
        fileNammeSplit[fileNammeSplit.length - 1]
      }`,
    };
    await s3.deleteObject(params).promise();
    this.props.onChange(imageType, "");
  }

  render() {
    const { fields, onChange, onValid, onInvalid, $field, $validation } =
      this.props;
    let errMsgOutlet,
      errMsgCompanyCatId,
      errMsgProName,
      errMsgsku,
      errMsgStatus;

    if ($validation.assign_outlet.error.reason !== undefined) {
      errMsgOutlet = $validation.assign_outlet.show && (
        <span className="error">{$validation.assign_outlet.error.reason}</span>
      );
    }

    if ($validation.product_name.error.reason !== undefined) {
      errMsgProName = $validation.product_name.show && (
        <span className="error">{$validation.product_name.error.reason}</span>
      );
    }
    if ($validation.sku.error.reason !== undefined) {
      errMsgsku = $validation.sku.show && (
        <span className="error">{$validation.sku.error.reason}</span>
      );
    }

    if ($validation.status.error.reason !== undefined) {
      errMsgStatus = $validation.status.show && (
        <span className="error">{$validation.status.error.reason}</span>
      );
    }

    return (
      <form className="card fv-plugins-bootstrap5" id="modulefrm">
        <div className="row g-3">
          <div
            className="accordion mt-3 accordion-header-primary"
            id="accordionStyle1"
          >
            <div className="accordion-item active">
              <h2 className="accordion-header">
                <button
                  type="button"
                  className="accordion-button"
                  data-bs-toggle="collapse"
                  data-bs-target="#accordionStyle1-3"
                  aria-expanded="true"
                >
                  General Info
                </button>
              </h2>
              <div
                id="accordionStyle1-3"
                className="accordion-collapse collapse show  mt-3"
                data-bs-parent="#accordionStyle1"
              >
                <div className="accordion-body">
                  <div className="row g-3">
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
                          value={fields.assign_outlet}
                          onChange={this.handleSelectChange.bind(
                            this,
                            "assign_outlet"
                          )}
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
                    <div className="col-md-6">
                      <div className="form-floating form-floating-outline mb-4">
                        <input
                          type="text"
                          className={
                            errMsgProName !== "" &&
                            errMsgProName !== false &&
                            errMsgProName !== undefined
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          name="product_name"
                          value={fields.product_name}
                          {...$field("product_name", (e) =>
                            onChange("product_name", e.target.value)
                          )}
                        />
                        <label htmlFor="product_name">
                          Product Name <span className="error">*</span>
                        </label>
                        {errMsgProName}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating form-floating-outline mb-4">
                        <input
                          type="text"
                          className="form-control"
                          name="alias_name"
                          value={fields.alias_name}
                          {...$field("alias_name", (e) =>
                            onChange("alias_name", e.target.value)
                          )}
                        />
                        <label htmlFor="alias_name">Alias Name</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating form-floating-outline mb-4">
                        <input
                          type="text"
                          className={
                            errMsgsku !== "" &&
                            errMsgsku !== false &&
                            errMsgsku !== undefined
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          name="sku"
                          value={fields.sku}
                          {...$field("sku", (e) =>
                            onChange("sku", e.target.value)
                          )}
                        />
                        <label htmlFor="sku">
                          SKU <span className="error">*</span>
                        </label>
                        {errMsgsku}
                      </div>
                    </div>
                    <div className="col-md-12">
                      <label>Short Description</label>
                      <Editor
                        setContent={this.setContent}
                        data={fields.short_description}
                      />
                    </div>
                    <div className="col-md-12">
                      <label>Login Description</label>
                      <Editor
                        setContent={this.setLoginContent}
                        data={fields.long_description}
                      />
                    </div>

                    <div className="col-md-6">
                      <div className="form-floating form-floating-outline mb-4">
                        <div className="mb-3">
                          <label htmlFor="formFile" className="form-label">
                            Thumbnail Image
                          </label>
                          <input
                            className="form-control"
                            type="file"
                            id="thumbnail"
                            onChange={(event) => {
                              this.uplaodFiles("thumbnail", event);
                              return false;
                            }}
                          />
                        </div>
                      </div>
                      {fields.thumbnail !== "" && (
                        <div className="dz-preview dz-processing dz-image-preview dz-success dz-complete">
                          <div className="dz-details">
                            <div className="dz-thumbnail">
                              <img alt="" src={fields.thumbnail} />
                            </div>
                          </div>
                          <a
                            className="dz-remove"
                            href={void 0}
                            onClick={this.removeImage.bind(
                              this,
                              fields.thumbnail,
                              "thumbnail"
                            )}
                          >
                            Remove file
                          </a>
                        </div>
                      )}
                    </div>

                    <div
                      className={
                        errMsgStatus !== "" &&
                        errMsgStatus !== false &&
                        errMsgStatus !== undefined
                          ? "col-md-6 error-select error"
                          : "col-md-6"
                      }
                    >
                      <br></br>
                      <div className="form-floating form-floating-outline custm-select-box mb-4">
                        <Select
                          value={fields.status}
                          onChange={this.handleSelectChange.bind(
                            this,
                            "status"
                          )}
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
                  </div>
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  type="button"
                  className="accordion-button"
                  data-bs-toggle="collapse"
                  data-bs-target="#accordionStyle1-4"
                  aria-expanded="true"
                >
                  Subscription
                </button>
              </h2>
              <div
                id="accordionStyle1-4"
                className="accordion-collapse collapse  mt-3"
                data-bs-parent="#accordionStyle4"
              >
                <div className="accordion-body">
                  <div className="row g-3">
                    {subscriptionTypes.map((item, index) => {
                      var subscribe = fields.subscription[item.toLowerCase()];
                      return (
                        <div className="row g-3" key={index}>
                          <div className="col-md-1">
                            <h5 class="mb-0">{item}</h5>
                          </div>
                          <div className="col-md-2">
                            <div className="form-floating form-floating-outline mb-4">
                              <input
                                type="text"
                                className="form-control"
                                name="alias_name"
                                value={subscribe.amount}
                                onChange={this.handleChangeSubscription.bind(
                                  this,
                                  item,
                                  "amount"
                                )}
                              />
                              <label htmlFor="alias_name">Amount</label>
                            </div>
                          </div>
                          <div className="col-md-2">
                            <div className="form-floating form-floating-outline mb-4">
                              <input
                                type="text"
                                className="form-control"
                                name="infotext"
                                value={subscribe.infotext}
                                onChange={this.handleChangeSubscription.bind(
                                  this,
                                  item,
                                  "infotext"
                                )}
                              />
                              <label htmlFor="alias_name">Save Text</label>
                            </div>
                          </div>
                          <div className="col-md-1"></div>
                          {subscribe.vouchers.length > 0 && (
                            <div className="col-md-7">
                              <ul class="list-group">
                                <li className="list-group-item list-group-item-action active waves-effect">
                                  <a href={void 0}>Voucher To Be Issued</a>
                                </li>
                                <li class="list-group-item justify-content-between">
                                  {subscribe.vouchers.map((vitem, vindex) => {
                                    var quantity_error =
                                      vitem?.quantity_error || "";
                                    var product_error =
                                      vitem?.product_error || "";

                                    return (
                                      <div className="row g-3" key={vindex}>
                                        <div
                                          className={
                                            product_error != ""
                                              ? "col-md-9 error-select error"
                                              : "col-md-9"
                                          }
                                        >
                                          <div className="form-floating form-floating-outline custm-select-box mb-4">
                                            <Select
                                              value={vitem.product}
                                              onChange={this.handleChangeVoucher.bind(
                                                this,
                                                item.toLowerCase(),
                                                vindex,
                                                "product"
                                              )}
                                              placeholder={"Select Voucher"}
                                              options={this.props.voucherList}
                                              isClearable={true}
                                            />
                                            {product_error != "" && (
                                              <span className="error">
                                                This field required
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                        <div
                                          className={
                                            quantity_error !== ""
                                              ? "col-md-2 error-select error"
                                              : "col-md-2"
                                          }
                                        >
                                          <div className="form-floating form-floating-outline mb-4">
                                            <input
                                              type="text"
                                              className="form-control"
                                              name="infotext"
                                              value={vitem.quantity}
                                              onChange={this.handleChangeVoucher.bind(
                                                this,
                                                item.toLowerCase(),
                                                vindex,
                                                "quantity"
                                              )}
                                            />
                                            <label htmlFor="alias_name">
                                              Quantity
                                            </label>
                                            {quantity_error !== "" && (
                                              <span className="error">
                                                This field required
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                        <div className="col-md-1 mt-4">
                                          <span
                                            class="mdi mdi-plus"
                                            onClick={this.addVoucher.bind(
                                              this,
                                              item.toLowerCase(),
                                              vindex
                                            )}
                                          ></span>
                                          {subscribe.vouchers.length > 1 && (
                                            <span
                                              class="mdi mdi-delete-outline"
                                              onClick={this.removeVoucher.bind(
                                                this,
                                                item.toLowerCase(),
                                                vindex
                                              )}
                                            ></span>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </li>
                              </ul>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="pt-1 pb-4 pr-2 text-end"
            style={{ paddingRight: "20px" }}
          >
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
