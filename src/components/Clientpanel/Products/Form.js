/* eslint-disable */
import React, { Component } from "react";
import cookie from "react-cookies";
import axios from "axios";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import update from "immutability-helper";
import { validated } from "react-custom-validation";
import validator from "validator";
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
  isValidPrice,
  isNumber,
} from "../../Helpers/SettingHelper";
import PageLoader from "../../Helpers/PageLoader";
import Header from "../Layout/Header";
import Topmenu from "../Layout/Topmenu";
import Footer from "../Layout/Footer";
import Editor from "../Layout/Editor";
import AWS from "aws-sdk";
AWS.config.update(awsCredentials);
const s3 = new AWS.S3();
/*var module = "clientpanel/products/";*/
var module = "clientpanel/paintbasedproducts/";
var moduleName = "Product";
var modulePath = "/clientpanel/catalog-products";
var dayList = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
import { format } from "date-fns";
class Form extends Component {
  constructor(props) {
    super(props);
    var editID = "";
    if (
      this.props.match.path === "/clientpanel/catalog-products/edit/:EditID"
    ) {
      editID = this.props.match.params.EditID;
    }
    this.state = {
      editID: editID,
      pageloading: false,
      clientdata: {
        assign_outlet: "",
        product_type: "",
        company_catid: "",
        product_name: "",
        alias_name: "",
        sku: "",
        short_description: "",
        long_description: "",
        price: "",
        special_price: "",
        special_price_from_date: "",
        special_price_to_date: "",
        status: [],
        voucher_expity_date: "",
        thumbnail: "",
        action: "add",
      },
      loading: true,
      formpost: [],
      companyDetail: [],
      outletList: [],
      productTypeList: [],
      companyCatList: [],
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.loadOutlet();
    this.loadproductTypeList();
    this.comapanyCatlist();

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
            product_type: result.product_type,
            company_catid: result.product_company_catid,
            product_name: result.product_name,
            alias_name: result.product_alias,
            sku: result.product_sku,
            short_description: result.product_short_description,
            long_description: result.product_long_description,
            price: result.product_price,
            special_price: result.product_special_price,
            special_price_from_date:
              result.product_special_price_from_date !== "" &&
              result.product_special_price_from_date !== null &&
              result.product_special_price_from_date !== "0000-00-00"
                ? new Date(result.product_special_price_from_date)
                : "",
            special_price_to_date:
              result.product_special_price_to_date !== "" &&
              result.product_special_price_to_date !== null &&
              result.product_special_price_to_date !== "0000-00-00"
                ? new Date(result.product_special_price_to_date)
                : "",
            voucher_expity_date:
              result.product_voucher_expiry_date !== "" &&
              result.product_voucher_expiry_date !== null &&
              result.product_voucher_expiry_date !== "0000-00-00"
                ? new Date(result.product_voucher_expiry_date)
                : "",
            thumbnail:
              result.product_thumbnail !== "" &&
              result.product_thumbnail !== null
                ? result.product_thumbnail
                : "",
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

  comapanyCatlist() {
    var urlShringTxt =
      apiUrl + "clientpanel/paintbasedproducts/comapany_catlist?company_id=" + CompanyID();
    axios.get(urlShringTxt, clientheaderconfig).then((res) => {
      if (res.data.status === "ok") {
        this.setState({ companyCatList: res.data.result });
      }
    });
  }

  loadproductTypeList() {
    var urlShringTxt =
      apiUrl + module + "productType?company_id=" + CompanyID();
    axios.get(urlShringTxt, clientheaderconfig).then((res) => {
      if (res.data.status === "ok") {
        this.setState({ productTypeList: res.data.result });
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
    showLoader("submit_frm", "class");
    var postData = this.state.clientdata;

    var product_type =
      Object.keys(postData.product_type).length > 0
        ? postData.product_type.value
        : "";

    var postObject = {
      product_type: product_type,
      product_name: postData.product_name,
      shop_type: 1,
      alias_name: postData.alias_name,
      sku: postData.sku,
      short_description: postData.short_description,
      long_description: postData.long_description,
      thumbnail: "",
      status:
        Object.keys(postData.status).length > 0 ? postData.status.value : "A",
      price: postData.price,
      special_price: postData.special_price,
      special_price_from_date:
        parseFloat(postData.special_price) > 0 &&
        postData.special_price_from_date !== ""
          ? format(postData.special_price_from_date, "yyyy-MM-dd")
          : "",
      special_price_to_date:
        parseFloat(postData.special_price) > 0 &&
        postData.special_price_to_date !== ""
          ? format(postData.special_price_to_date, "yyyy-MM-dd")
          : "",
      paired_products: "",
      assign_outlet:
        Object.keys(postData.assign_outlet).length > 0
          ? postData.assign_outlet.value
          : "",
      company_catid:
          Object.keys(postData.company_catid).length > 0
            ? postData.company_catid.value
            : "",    
      voucher_expity_date:
        product_type === "5"
          ? postData.voucher_expity_date !== ""
            ? format(postData.voucher_expity_date, "yyyy-MM-dd")
            : ""
          : "",
      thumbnail: postData.thumbnail,
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
          <Header {...this.props} currentPage={"catalog-products"} />
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
                  companyCatList={this.state.companyCatList}
                  productTypeList={this.state.productTypeList}
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
  const {
    assign_outlet,
    product_type,
    company_catid,
    product_name,
    sku,
    price,
    special_price,
    status,
  } = props.fields;

  return {
    fields: [
      "assign_outlet",
      "product_type",
      "company_catid",
      "product_name",
      "sku",
      "price",
      "special_price",
      "status",
    ],

    validations: {
      assign_outlet: [[isSingleSelect, assign_outlet]],
      product_type: [[isSingleSelect, product_type]],
      company_catid: [[isSingleSelect, company_catid]],
      product_name: [[isEmpty, product_name]],
      sku: [[isEmpty, sku]],
      price: [
        [isEmpty, price],
        [isValidPrice, price],
      ],
      special_price: [[isValidPrice, special_price]],
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
  myFilter(elm) {
    return elm != null && elm !== false && elm !== "";
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
      errMsgProductType,
      errMsgCompanyCatId,
      errMsgProName,
      errMsgsku,
      errMsgStatus,
      errMsgProPrice,
      errMsgProSpecialPrice;
      
    if ($validation.assign_outlet.error.reason !== undefined) {
      errMsgOutlet = $validation.assign_outlet.show && (
        <span className="error">{$validation.assign_outlet.error.reason}</span>
      );
    }
    if ($validation.product_type.error.reason !== undefined) {
      errMsgProductType = $validation.product_type.show && (
        <span className="error">{$validation.product_type.error.reason}</span>
      );
    }
    if ($validation.company_catid.error.reason !== undefined) {
      errMsgCompanyCatId = $validation.company_catid.show && (
        <span className="error">{$validation.company_catid.error.reason}</span>
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
    if ($validation.price.error.reason !== undefined) {
      errMsgProPrice = $validation.price.show && (
        <span className="error">{$validation.price.error.reason}</span>
      );
    }
    if ($validation.special_price.error.reason !== undefined) {
      errMsgProSpecialPrice = $validation.special_price.show && (
        <span className="error">{$validation.special_price.error.reason}</span>
      );
    }

    if ($validation.status.error.reason !== undefined) {
      errMsgStatus = $validation.status.show && (
        <span className="error">{$validation.status.error.reason}</span>
      );
    }
    var producttype = "";
    if (fields.product_type !== "") {
      if (fields.product_type.value === "2") {
        producttype = fields.product_type.value;
      }
    }

    console.log('QQQWWWW', fields.status);

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
                    <div
                      className={
                        errMsgProductType !== "" &&
                        errMsgProductType !== false &&
                        errMsgProductType !== undefined
                          ? "col-md-6 error-select error"
                          : "col-md-6"
                      }
                    >
                      <div className="form-floating form-floating-outline custm-select-box mb-4">
                        <Select
                          value={fields.product_type}
                          onChange={this.handleSelectChange.bind(
                            this,
                            "product_type"
                          )}
                          placeholder={"Select Product Type"}
                          options={this.props.productTypeList}
                          isClearable={true}
                        />
                        <label className="select-box-label">
                          Product Type<span className="error">*</span>
                        </label>
                        {errMsgProductType}
                      </div>
                    </div>
                    
                    <div
                      className={
                        errMsgCompanyCatId !== "" &&
                        errMsgCompanyCatId !== false &&
                        errMsgCompanyCatId !== undefined
                          ? "col-md-6 error-select error"
                          : "col-md-6"
                      }
                    >
                      <div className="form-floating form-floating-outline custm-select-box mb-4">
                        <Select
                          value={fields.company_catid}
                          onChange={this.handleSelectChange.bind(
                            this,
                            "company_catid"
                          )}
                          placeholder={"Select Category"}
                          options={this.props.companyCatList}
                          isClearable={true}
                        />
                        <label className="select-box-label">
                          Company Category<span className="error">*</span>
                        </label>
                        {errMsgCompanyCatId}
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
                    <div className="col-md-6">
                      <div className="form-floating form-floating-outline mb-4 custm-date-box">
                        <DatePicker
                          peekNextMonth
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          className="form-control"
                          selected={fields.voucher_expity_date}
                          minDate={new Date()}
                          dateFormat="dd/MM/yyyy"
                          onChange={this.handleChange.bind(
                            this,
                            "voucher_expity_date"
                          )}
                        />
                        <label className="select-box-label">
                          Voucher Expiry Date
                        </label>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-floating form-floating-outline mb-4">
                        <input
                          type="text"
                          className={
                            errMsgProPrice !== "" &&
                            errMsgProPrice !== false &&
                            errMsgProPrice !== undefined
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          name="price"
                          value={fields.price}
                          {...$field("price", (e) =>
                            onChange("price", e.target.value)
                          )}
                        />
                        <label htmlFor="price">
                          Product Price <span className="error">*</span>
                        </label>
                        {errMsgProPrice}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating form-floating-outline mb-4">
                        <input
                          type="text"
                          className={
                            errMsgProSpecialPrice !== "" &&
                            errMsgProSpecialPrice !== false &&
                            errMsgProSpecialPrice !== undefined
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          name="special_price"
                          value={fields.special_price}
                          {...$field("special_price", (e) =>
                            onChange("special_price", e.target.value)
                          )}
                        />
                        <label htmlFor="special_price">Special Price</label>
                        {errMsgProSpecialPrice}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating form-floating-outline mb-4 custm-date-box">
                        <DatePicker
                          peekNextMonth
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          className="form-control"
                          selected={fields.special_price_from_date}
                          minDate={new Date()}
                          dateFormat="dd/MM/yyyy"
                          onChange={this.handleChange.bind(
                            this,
                            "special_price_from_date"
                          )}
                        />
                        <label className="select-box-label">
                          Special Price From Date
                        </label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating form-floating-outline mb-4 custm-date-box">
                        <DatePicker
                          peekNextMonth
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          className="form-control"
                          selected={fields.special_price_to_date}
                          minDate={new Date()}
                          dateFormat="dd/MM/yyyy"
                          onChange={this.handleChange.bind(
                            this,
                            "special_price_to_date"
                          )}
                        />
                        <label className="select-box-label">
                          Special Price To Date
                        </label>
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
                        <label className="select-box-label">Status</label>
                        {errMsgStatus}
                      </div>
                    </div>
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
