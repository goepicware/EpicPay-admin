/* eslint-disable */
import React, { Component } from "react";
import cookie from "react-cookies";
import axios from "axios";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Select from "react-select";
import update from "immutability-helper";
import { validated } from "react-custom-validation";
import validator from "validator";
import { format } from "date-fns";
import { GET_FORMPOST, GET_DETAILDATA } from "../../../actions";
import { apiUrl, masterheaderconfig } from "../../Helpers/Config";
import {
  showLoader,
  hideLoader,
  showAlert,
  userID,
} from "../../Helpers/SettingHelper";
import PageLoader from "../../Helpers/PageLoader";
import Header from "../Layout/Header";
import Topmenu from "../Layout/Topmenu";
import Footer from "../Layout/Footer";
import Switch from "react-switch";

var todayDate = new Date();
class Clientform extends Component {
  constructor(props) {
    super(props);
    var editID = "";
    if (this.props.match.path === "/masterpanel/category/edit/:categoryID") {
      editID = this.props.match.params.categoryID;
    }
    this.state = {
      editID: editID,
      pageloading: false,
      categorydata: {
        category_name: "",
        category_status: [],
        action: "add",
      },
      loading: true,
      checked: true,
      formpost: [],
      categoryDetail: [],
      statusList: [{
        label: 'Active',
        value: 'A',
      },{
        label: 'Inactive',
        value: 'I',
      }]
    };
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {

    if (this.state.editID !== "") {
      var params = {
        params: "category_id=" + this.state.editID,
        url: apiUrl + "company/companycategory/category_details",
        type: "master",
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
          showAlert("Success", errMsg, "success");
          this.props.history.push("/masterpanel/category");
        } else {
          showAlert("Error", errMsg, "error");
        }
      }
    }
    if (
      this.state.categoryDetail !== nextProps.detaildata &&
      this.state.editID !== ""
    ) {
      this.setState({ categoryDetail: nextProps.detaildata }, function () {
        if (nextProps.detaildata[0].status === "ok") {
          var result = nextProps.detaildata[0].result;
          let cateStatus = [];
          if(result.cate_status == 'A') {
              cateStatus = {
                label: 'Active',
                value: 'A',
              };
          } else if(result.cate_status == 'I') {
              cateStatus = {
                label: 'Inactive',
                value: 'I',
              };
          }
          var categoryupdatedata = {
            category_name: result.cate_name,
            category_status: cateStatus,
            action: "edit",
          };
          this.setState({ categorydata: categoryupdatedata, pageloading: false });
        } else {
          showAlert("Error", "Invalid Company", "error");
        }
      });
    }
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
      update(this.state, { categorydata: { [field]: { $set: value } } })
    );
  };

  handleSubmit = () => {
    showLoader("submit_frm", "class");
    var category_data = this.state.categorydata;
        category_data["category_status"] = Object.keys(category_data.category_status).length > 0 ? category_data.category_status.value : "";
    var post_url = "company/companycategory/add";
    if (category_data.action === "edit" && this.state.editID !== "") {
        category_data["edit_id"] = this.state.editID;
        post_url = "company/companycategory/edit";
    }
    this.props.getFormPost(category_data, post_url, "master");
  };

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
                    <h4 className="fw-bold">
                      {this.state.editID !== "" ? "Update" : "Add New"} Company Category
                    </h4>
                  </div>
                  <div className="col-lg-2 col-md-6 text-end">
                    <Link to={"/masterpanel/category"}>
                      <button
                        type="button"
                        className="btn btn-outline-primary waves-effect"
                      >
                        Back
                      </button>
                    </Link>
                  </div>
                </div>
                <Form
                  {...this.props}
                  fields={this.state.categorydata}
                  onChange={this.fieldChange}
                  onValid={this.handleSubmit}
                  statusList={this.state.statusList}
                  error_msg={this.state.error_msg}
                  onInvalid={() => {
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

export default connect(mapStateTopProps, mapDispatchToProps)(Clientform);

const isEmpty = (value) => (value === "" ? "This field is required." : null);

function validationConfig(props) {
  const {
    category_name,
    category_status,
  } = props.fields;
  if (props.fields.action === "add") {
    return {
      fields: [
        "category_name",
        "category_status",
      ],

      validations: {
        category_name: [[isEmpty, category_name]],
        category_status: [[isEmpty, category_status]],
      },
    };
  } else {
    return {
      fields: [
        "category_name",
        "category_status",
      ],

      validations: {
        category_name: [[isEmpty, category_name]],
        category_status: [[isEmpty, category_status]],
      },
    };
  }
}

class Form extends Component {
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
    let errMsgName = "";
    if ($validation.category_name.error.reason !== undefined) {
      errMsgName = $validation.category_name.show && (
        <span className="error">{$validation.category_name.error.reason}</span>
      );
    }

    return (
      <form className="card-body fv-plugins-bootstrap5" id="modulefrm">
        <div
          className="accordion mt-3 accordion-header-primary"
          id="accordionStyle1"
        >
          <div className="accordion-item active">
            <br></br>
            <div
              id="accordionStyle1-3"
              className="accordion-collapse collapse show"
              data-bs-parent="#accordionStyle1"
            >
              <div className="accordion-body">
                <div className="row g-3">
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
                        name="category_name"
                        value={fields.category_name}
                        {...$field("category_name", (e) =>
                          onChange("category_name", e.target.value)
                        )}
                      />
                      <label htmlFor="category_name">
                      Category Name <span className="error">*</span>
                      </label>
                      {errMsgName}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating form-floating-outline">
                      <Select
                        value={fields.category_status}
                        onChange={this.handleSelectChange.bind(
                          this,
                          "category_status"
                        )}
                        placeholder="Select Status"
                        options={this.props.statusList}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
        <div className="pt-4 text-end">
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
          <Link to={"/masterpanel/category"}>
            <button
              type="reset"
              className="btn btn-label-secondary waves-effect"
            >
              Cancel
            </button>
          </Link>
        </div>
      </form>
    );
  }
}
Form = validated(validationConfig)(Form);
