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
var module = "clientpanel/crmsettings/";
var moduleName = "CRM Settings";
var modulePath = "/clientpanel/crmsettings";
var dayList = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
var TierList = ["-", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
import { format } from "date-fns";
class Form extends Component {
  constructor(props) {
    super(props);
    var editID = "";
    this.state = {
      editID: editID,
      pageloading: false,
      clientdata: {
        product_name: "test",
        action: "add",
      },
      loading: true,
      formpost: [],
      companyDetail: [],
      memberShipDetail: [],
      memberShipData: [],
      productList: [],
      productListOptions: [],
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.loadMemberDetail();
    this.loadproductList();

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
      hideLoader("submit_frm", "class");
      if (nextProps.formpost.length > 0) {
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
  }

  loadMemberDetail() {
    var urlShringTxt = apiUrl + module + "list?company_id=" + CompanyID();
    axios.get(urlShringTxt, clientheaderconfig).then((res) => {
      if (res.data.status === "ok") {
        this.setState({ memberShipDetail: res.data.result, memberShipData: res.data.result });
      }
    });
  }

  loadproductList() {
    this.setState({ pageloading: true });
    var urlShringTxt =
      apiUrl + "clientpanel/paintbasedproducts/simpleproductlist?company_id=" + CompanyID();
    axios.get(urlShringTxt, clientheaderconfig).then((res) => {
      if (res.data.status === "ok") {
        this.setState({ productList: res.data.result, pageloading: false },
          function () {
              var tempVal = '';
              this.productListOption(tempVal);
          });
      }
    });
  }

  productListOption = (selectedId) => {
    var productList = this.state.productList;
    if(selectedId != '' && selectedId != null  && selectedId != undefined) {
      var productLstHtml = productList.map((productlst, proInt) => {
      if(selectedId == productlst.product_id) {
        return ({value: productlst.product_id,label: productlst.product_name});
      }
    });
    return (productLstHtml != '')?productLstHtml:'';
    } else {
      var productLstHtml = productList.map((productlst, proInt) => {
          return ({value: productlst.product_id,label: productlst.product_name});
      });
      this.setState({ productListOptions: productLstHtml });
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
  fieldChange = (field, value, teirval) => {
    var memberShipData = this.state.memberShipData;
    if(field=='tier_enable_status') {
      var fieldString = 'tierListVal';
      var tierListVal = memberShipData.tierListVal;
          //tierListVal['membr_'+teirval] = value.value;
          tierListVal['membr_'+teirval] = value;
          this.setState(update(this.state, { memberShipData: { [fieldString]: { $set: tierListVal } } }));
    } else {
      var fieldString = 'membershipDetResp';
      var membershipDetRespArr = memberShipData['membershipDetResp'];
        membershipDetRespArr['membr_'+teirval][field] = value;
        this.setState(update(this.state, { memberShipData: { [fieldString]: { $set: membershipDetRespArr } } }));
    }
    
  };

  handleSubmit = () => {
    showLoader("submit_frm", "class");
    var postData = this.state.memberShipData;
    var postObject = {
      membershipDetResp: postData['membershipDetResp'],
      loginID: userID(),
      company_admin_id: clientID(),
      company_id: CompanyID(),
    };
    var post_url = module + "update";
    this.props.getFormPost(postObject, post_url, "client");
  };

  render() {
    return (
      <div className="layout-wrapper layout-content-navbar">
        <div className="layout-container">
          <Header {...this.props} currentPage={"crmsettings"} />
          <div className="layout-page">
            <Topmenu />
            <div className="content-wrapper">
              <div className="container-xxl flex-grow-1 container-p-y">
                <div className="row mb-3">
                  <div className="col-lg-10 col-md-6">
                    <h4 className="fw-bold">
                      {moduleName}
                    </h4>
                  </div>
                  <div className="col-lg-2 col-md-6 text-end">
                  </div>
                </div>
                <PostForm
                  {...this.props}
                  fields={this.state.clientdata}
                  onChange={this.fieldChange}
                  onValid={this.handleSubmit}
                  error_msg={this.state.error_msg}
                  memberShipDetail={this.state.memberShipDetail}
                  memberShipData={this.state.memberShipData}
                  productList={this.state.productList}
                  productListOptions={this.state.productListOptions}
                  productListOption={this.productListOption}
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
    product_name
  } = props.fields;

  return {
    fields: [
      "product_name"
    ],

    validations: {
      product_name: [[isEmpty, product_name]]
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
  handleChangeTierAct(name, membershipdt_id, value) {
    this.props.onChange(name, value.value, membershipdt_id);
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
  
  async uplaodFiles(imageType, membershipdt_id) {
    var imagefile = document.querySelector("#" + imageType+"_"+membershipdt_id);
    const file = imagefile.files[0];
    const params = {
      Bucket: bucketName,
      Key: `media/${foldername}/category/${file.name}`,
      Body: file,
      ACL: "public-read",
    };
    const { Location } = await s3.upload(params).promise();
    this.props.onChange(imageType, Location, membershipdt_id);
    $("#" + imageType+"_"+membershipdt_id).val("");
  }
  async removeImage(fileNamme, imageType, membershipdt_id) {
    var fileNammeSplit = fileNamme.split("/");
    var params = {
      Bucket: bucketName,
      Key: `media/${foldername}/category/${
        fileNammeSplit[fileNammeSplit.length - 1]
      }`,
    };
    await s3.deleteObject(params).promise();
    this.props.onChange(imageType, "", membershipdt_id);
  }

  memberShipListView(fields,$field, onChange) {
    var productListOptions = this.props.productListOptions;
    var memberShipDetail = this.props.memberShipDetail;
    var memberShipData = this.props.memberShipData;
    if(memberShipDetail != undefined && memberShipDetail != '' && Object.keys(memberShipDetail).length > 0) {
    var membershipArr = this.props.memberShipDetail.membershipArr;

    const memberShipHtml = membershipArr.map((membershipdt, memInt) => {
      var accordionActvcls = (memInt == 0) ? 'active' : '';
      var accordionDtlActvcls = (memInt == 0) ? 'show' : '';
      var memIntVal = memInt + 1;
      var membershipDetResp = memberShipData.membershipDetResp;
      var membershipDetVl = membershipDetResp['membr_'+membershipdt.id];
      /*var tierListVal = memberShipData.tierListVal;
      var memberDataEnbl = tierListVal['membr_'+membershipdt.id];
          if(memberDataEnbl == 'Yes') {
            var memberDataEnblSlt = {value: 'Yes',label: 'Enable'};
          } else {
            var memberDataEnblSlt = {value: 'No',label: 'Disable'};
          }*/
          
      if((Object.keys(membershipDetVl).length > 0) && membershipDetVl.membership_status == 'A') {
        var memberDataEnblSlt = {value: 'A',label: 'Enable'};
        var memberDataEnbl = 'Yes';
      } else {
        var memberDataEnblSlt = {value: 'I',label: 'Disable'};
        var memberDataEnbl = 'No';
      }
      var membership_birthday_spend_type = {value: 'freeproduct',label: 'Free Product'};
      var membership_birthday_free_products = '';
      if((Object.keys(membershipDetVl).length > 0) && membershipDetVl.membership_birthday_free_products != '') {
        membership_birthday_free_products = this.props.productListOption(membershipDetVl.membership_birthday_free_products);
      }

      return (<div className={"accordion-item "+accordionActvcls}>
      <h2 className={(memberDataEnbl == 'Yes')?"accordion-header accordion-header-act":"accordion-header accordion-header-inact"}>
        <button
          type="button"
          className={(memberDataEnbl == 'Yes')?"accordion-button accordion-button-act":"accordion-button accordion-button-inact"}
          data-bs-toggle="collapse"
          data-bs-target={"#accordionStyle"+memIntVal+"-"+memInt}
          aria-expanded="true"
        >
          Tier {TierList[memIntVal]}
        </button>
        <div className="custm-select-box-cls">
          <Select
            value={memberDataEnblSlt}
            onChange={this.handleChangeTierAct.bind(
              this,
              "membership_status",
              membershipdt.id
            )}
            placeholder="Status"
            options={[
              { value: "A", label: "Enable" },
              { value: "I", label: "Disable" },
            ]}
          />
        </div>
      </h2>
      <div
        id={"accordionStyle"+memIntVal+"-"+memInt}
        className={"accordion-collapse collapse "+accordionDtlActvcls+" mt-3"}
        data-bs-parent={"#accordionStyle"+memIntVal}
      >
        <div className="accordion-body">
          <div className="row g-3">
            
            <div className="col-md-6">
              <div className="form-floating form-floating-outline mb-4">
                <input
                  type="text"
                  className="form-control"
                  name="membership_display_name"
                  value={(Object.keys(membershipDetVl).length > 0) ? membershipDetVl.membership_display_name: ''}
                  {...$field("membership_display_name", (e) =>
                    onChange("membership_display_name", e.target.value, membershipdt.id)
                  )}
                />
                <label htmlFor="membership_display_name">Display Name</label>
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-floating form-floating-outline mb-4">
                <input
                  type="text"
                  className="form-control"
                  name="membership_min_spend"
                  value={(Object.keys(membershipDetVl).length > 0) ? membershipDetVl.membership_min_spend : ''}
                  {...$field("membership_min_spend", (e) =>
                    onChange("membership_min_spend", e.target.value, membershipdt.id)
                  )}
                />
                <label htmlFor="membership_min_spend">
                Minimum Spend [ To Reach The Tier ] <span className="error">*</span>
                </label>
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-floating form-floating-outline mb-4">
                <input
                  type="text"
                  className="form-control"
                  name="membership_cashback_percentage"
                  value={(Object.keys(membershipDetVl).length > 0) ? membershipDetVl.membership_cashback_percentage : ''}
                  {...$field("membership_cashback_percentage", (e) =>
                    onChange("membership_cashback_percentage", e.target.value, membershipdt.id)
                  )}
                />
                <label htmlFor="membership_cashback_percentage">Loyalty [ cashback ] Percentage </label>
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-floating form-floating-outline mb-4">
                <input
                  type="text"
                  className="form-control membership_cashback_expirydays"
                  name="membership_cashback_expirydays"
                  value={(Object.keys(membershipDetVl).length > 0) ? membershipDetVl.membership_cashback_expirydays : ''}
                  {...$field("membership_cashback_expirydays", (e) =>
                    onChange("membership_cashback_expirydays", e.target.value, membershipdt.id)
                  )}
                /><span className="membership_cashback_expirydays_txt"> [ Days ]</span>
                <label htmlFor="membership_cashback_expirydays">
                Loyalty [ Cashback ] Expiry On
                </label>
              </div>
            </div>
            
            <div className="col-md-6 member_image_div">
              <div className="form-floating form-floating-outline mb-4">
                <div className="mb-3">
                  <label htmlFor="formFile" className="form-label">
                  Tier I Image
                  </label>
                  <input
                    className="form-control"
                    type="file"
                    id={"membership_image_"+membershipdt.id}
                    onChange={(event) => {
                      this.uplaodFiles("membership_image", membershipdt.id, event);
                      return false;
                    }}
                  />
                </div>
              </div>
              {((Object.keys(membershipDetVl).length > 0) && membershipDetVl.membership_image !== "" && membershipDetVl.membership_image !== null && membershipDetVl.membership_image !== undefined) && (
                <div className="dz-preview dz-processing dz-image-preview dz-success dz-complete">
                  <div className="dz-details">
                    <div className="dz-thumbnail">
                      <img alt="" src={membershipDetVl.membership_image} />
                    </div>
                  </div>
                  <a
                    className="dz-remove"
                    href={void 0}
                    onClick={this.removeImage.bind(
                      this,
                      membershipDetVl.membership_image,
                      "membership_image",
                      membershipdt.id
                    )}
                  >
                    Remove file
                  </a>
                </div>
              )}
            </div>

            <div className="col-md-6 membership_dollar_to_points_div">
              <div className="form-floating form-floating-outline mb-4">
                <input
                  type="text"
                  className="form-control membership_dollar_to_points"
                  name="membership_dollar_to_points"
                  value={(Object.keys(membershipDetVl).length > 0) ? membershipDetVl.membership_dollar_to_points : ''}
                  {...$field("membership_dollar_to_points", (e) =>
                    onChange("membership_dollar_to_points", e.target.value, membershipdt.id)
                  )}
                /><span className="membership_dollar_to_points_txt"> [ Number of points each $ is worth ]</span>
                <label htmlFor="membership_dollar_to_points">
                Points To $ Ratio (S$1.00)
                </label>
              </div>
            </div>

            <div className="col-md-12 membership_birthday_promodiv">
                <label className="membership_birthday_promo">
                        <b>Birthday Promotions :-</b>
                </label>
            </div>

            <div className="col-md-6">
              <div className="form-floating form-floating-outline custm-select-box mb-4">
                  <Select
                    value={membership_birthday_spend_type}
                    placeholder={"Select Promotion Type"}
                    options={[
                      { value: "freeproduct", label: "Free Product" }
                    ]}
                  />
                  <label className="select-box-label">
                    Promotion Type
                  </label>
                </div>
              </div>


            <div className="col-md-6 membership_birthday_free_products">
              <div className="form-floating form-floating-outline custm-select-box mb-4">
                  <Select
                    value={membership_birthday_free_products}
                    placeholder={"Select Products"}
                    onChange={this.handleChangeTierAct.bind(
                      this,
                      "membership_birthday_free_products",
                      membershipdt.id
                    )}
                    options={productListOptions}
                  />
                  <label className="select-box-label">
                    Promo Products
                  </label>
                </div>
              </div>
          

            <div className="col-md-6">
              <div className="form-floating form-floating-outline mb-4">
                <input
                  type="text"
                  className="form-control"
                  name="membership_birthday_expirydays"
                  value={(Object.keys(membershipDetVl).length > 0) ? membershipDetVl.membership_birthday_expirydays : ''}
                  {...$field("membership_birthday_expirydays", (e) =>
                    onChange("membership_birthday_expirydays", e.target.value, membershipdt.id)
                  )}
                />
                <label htmlFor="membership_birthday_expirydays">Expiry Days</label>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>); 

    });


    return memberShipHtml;

  } else {
    return '';
  }


  }

  render() {
    const { fields, onChange, onValid, onInvalid, $field, $validation } =
      this.props;

    return (
      <form className="card fv-plugins-bootstrap5 crm-setting-maindiv" id="modulefrm">
        <input type="hidden" name="product_name" value={fields.product_name} />
        <div className="row g-3">
          <div
            className="accordion mt-3 accordion-header-primary"
            id="accordionStyle1"
          >
            {this.memberShipListView(fields,$field, onChange)}
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
