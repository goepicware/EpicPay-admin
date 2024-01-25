import React from "react";
/* import { render } from "react-dom"; */
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { getStore } from "./store";

import "./assets/vendor/fonts/materialdesignicons.css";
import "./assets/vendor/fonts/fontawesome.css";
import "./assets/vendor/css/rtl/core.css";
import "./assets/vendor/css/rtl/theme-default.css";
import "./assets/css/demo.css";
import "./assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css";
import "./assets/vendor/libs/node-waves/node-waves.css";
import "./assets/vendor/libs/typeahead-js/typeahead.css";
import "./assets/vendor/libs/formvalidation/dist/css/formValidation.min.css";
import "./assets/vendor/css/pages/page-auth.css";
import "./assets/vendor/libs/toastr/toastr.css";
import "./assets/vendor/libs/dropzone/dropzone.css";

import "./common/css/slick.css";
import "./common/css/custom.css";

import Login from "./components/Masterpanel/Auth/Login";
import Dashboard from "./components/Masterpanel/Dashboard/Dashboard";
import Clientlist from "./components/Masterpanel/Client/List";
import Clientform from "./components/Masterpanel/Client/Clientform";
import CmCategorylist from "./components/Masterpanel/Category/List";
import CmCategoryform from "./components/Masterpanel/Category/Categoryform";
//import Logout from "./components/Myaccount/Logout";

import Clientlogin from "./components/Clientpanel/Auth/Login";
import Clientdashboard from "./components/Clientpanel/Dashboard/Dashboard";
import Outletlist from "./components/Clientpanel/Outlet/List";
import Outletform from "./components/Clientpanel/Outlet/Form";
import Zonelist from "./components/Clientpanel/Zone/List";
import Zoneform from "./components/Clientpanel/Zone/Zoneform";
import Sitelocationlist from "./components/Clientpanel/Sitelocation/List";
import Sitelocationform from "./components/Clientpanel/Sitelocation/Form";
import Brandslist from "./components/Clientpanel/Brands/List";
import Brandsform from "./components/Clientpanel/Brands/Form";
import Menugrouplist from "./components/Clientpanel/Menugroup/List";
import Menugroupform from "./components/Clientpanel/Menugroup/Form";
import Menuitemlist from "./components/Clientpanel/Menuitem/List";
import Menuitemform from "./components/Clientpanel/Menuitem/Form";
import Pagelist from "./components/Clientpanel/Pages/List";
import Pageform from "./components/Clientpanel/Pages/Form";
import Staticblocklist from "./components/Clientpanel/Staticblock/List";
import Staticblockform from "./components/Clientpanel/Staticblock/Form";
import Bannerlist from "./components/Clientpanel/Banner/List";
import Bannerform from "./components/Clientpanel/Banner/Form";
import Faqcategorylist from "./components/Clientpanel/Faqcategory/List";
import Faqcategoryform from "./components/Clientpanel/Faqcategory/Form";
import Faqlist from "./components/Clientpanel/Faq/List";
import Faqform from "./components/Clientpanel/Faq/Form";
import Emailtemplatelist from "./components/Clientpanel/Emailtemplate/List";
import Emailtemplateform from "./components/Clientpanel/Emailtemplate/Form";
import Userroleslist from "./components/Clientpanel/Userroles/List";
import Userrolesform from "./components/Clientpanel/Userroles/Form";
import Userlist from "./components/Clientpanel/User/List";
import Userform from "./components/Clientpanel/User/Form";
import Promotionlist from "./components/Clientpanel/Promotion/List";
import Promotionform from "./components/Clientpanel/Promotion/Form";
import Wallettopupplanlist from "./components/Clientpanel/Wallettopupplan/List";
import Wallettopupplanform from "./components/Clientpanel/Wallettopupplan/Form";
import Wallettopuphistorylist from "./components/Clientpanel/Wallettopuphistory/List";
import Customerlist from "./components/Clientpanel/Customer/List";
import Customerform from "./components/Clientpanel/Customer/Form";
import Categorylist from "./components/Clientpanel/Category/List";
import Categoryform from "./components/Clientpanel/Category/Form";
import Subcategorylist from "./components/Clientpanel/Subcategory/List";
import Subcategoryform from "./components/Clientpanel/Subcategory/Form";
import Productslist from "./components/Clientpanel/Products/List";
import Productsform from "./components/Clientpanel/Products/Form";
import Crmsettingsform from "./components/Clientpanel/Crmsettings/Form";
import Rewardsettingsform from "./components/Clientpanel/Rewardsettings/Form";
import Missionform from "./components/Clientpanel/Mission/Form";
import Pointssettingsform from "./components/Clientpanel/Pointssettings/Form";
import Grouplist from "./components/Clientpanel/Group/List";
import Groupform from "./components/Clientpanel/Group/Form";
import Orderlist from "./components/Clientpanel/Orders/List";
import OrderDetails from "./components/Clientpanel/Orders/Details";
import Reportlist from "./components/Clientpanel/Reports/List";
import Timeslotlist from "./components/Clientpanel/Timeslot/List";
import Timeslotform from "./components/Clientpanel/Timeslot/Form";
import Tagslist from "./components/Clientpanel/Tags/List";
import Tagsform from "./components/Clientpanel/Tags/Form";
import Ownriderlist from "./components/Clientpanel/Ownrider/List";
import Ownriderform from "./components/Clientpanel/Ownrider/Form";
import Pointslist from "./components/Clientpanel/Points/List";
import Pointsform from "./components/Clientpanel/Points/Form";
import Settingsform from "./components/Clientpanel/Settings/Form";
import ReferralHistory from "./components/Clientpanel/ReferralHistory/List";

import Refpage from "./components/Layout/Refpage";
import Logout from "./components/Layout/Logout";
import Page404 from "./Page404";

const store = getStore();
const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <Provider store={store}>
    <Router>
      <Switch>
        {/*  Master Admin Start*/}
        <Route exact path="/" component={Clientlogin} />
        <Route exact path="/masterpanel" component={Login} />
        <Route exact path="/masterpanel/dashboard" component={Dashboard} />
        <Route exact path="/masterpanel/client" component={Clientlist} />
        <Route exact path="/masterpanel/client/add" component={Clientform} />
        <Route
          exact
          path="/masterpanel/client/edit/:clientID"
          component={Clientform}
        />
        <Route exact path="/masterpanel/category" component={CmCategorylist} />
        <Route
          exact
          path="/masterpanel/category/add"
          component={CmCategoryform}
        />
        <Route
          exact
          path="/masterpanel/category/edit/:categoryID"
          component={CmCategoryform}
        />
        <Route path={"/logout/:LoginType"} component={Logout} />
        <Route path={"/logout"} component={Logout} />
        {/*  Master Admin End*/}

        {/*  Client Panel Start*/}
        <Route
          path={"/clientpanel/login/:LoginType/:clientID"}
          component={Clientlogin}
        />
        <Route exact path="/clientpanel/login" component={Clientlogin} />
        <Route
          exact
          path="/clientpanel/dashboard"
          component={Clientdashboard}
        />

        <Route exact path="/clientpanel/outlet/" component={Outletlist} />
        <Route exact path="/clientpanel/outlet/add" component={Outletform} />
        <Route
          exact
          path="/clientpanel/outlet/edit/:EditID"
          component={Outletform}
        />
        <Route exact path="/clientpanel/zone/" component={Zonelist} />
        <Route exact path="/clientpanel/zone/add" component={Zoneform} />
        <Route
          exact
          path="/clientpanel/zone/edit/:EditID"
          component={Zoneform}
        />
        <Route
          exact
          path="/clientpanel/sitelocation/"
          component={Sitelocationlist}
        />
        <Route
          exact
          path="/clientpanel/sitelocation/add"
          component={Sitelocationform}
        />
        <Route
          exact
          path="/clientpanel/sitelocation/edit/:EditID"
          component={Sitelocationform}
        />
        <Route exact path="/clientpanel/brand/" component={Brandslist} />
        <Route exact path="/clientpanel/brand/add" component={Brandsform} />
        <Route
          exact
          path="/clientpanel/brand/edit/:EditID"
          component={Brandsform}
        />
        <Route exact path="/clientpanel/menugroup/" component={Menugrouplist} />
        <Route
          exact
          path="/clientpanel/menugroup/add"
          component={Menugroupform}
        />
        <Route
          exact
          path="/clientpanel/menugroup/edit/:EditID"
          component={Menugroupform}
        />
        <Route exact path="/clientpanel/menuitem/" component={Menuitemlist} />
        <Route
          exact
          path="/clientpanel/menuitem/add"
          component={Menuitemform}
        />
        <Route
          exact
          path="/clientpanel/menuitem/edit/:EditID"
          component={Menuitemform}
        />
        <Route exact path="/clientpanel/pages/" component={Pagelist} />
        <Route exact path="/clientpanel/pages/add" component={Pageform} />
        <Route
          exact
          path="/clientpanel/pages/edit/:EditID"
          component={Pageform}
        />
        <Route
          exact
          path="/clientpanel/staticblock/"
          component={Staticblocklist}
        />
        <Route
          exact
          path="/clientpanel/staticblock/add"
          component={Staticblockform}
        />
        <Route
          exact
          path="/clientpanel/staticblock/edit/:EditID"
          component={Staticblockform}
        />
        <Route exact path="/clientpanel/banner/" component={Bannerlist} />
        <Route exact path="/clientpanel/banner/add" component={Bannerform} />
        <Route
          exact
          path="/clientpanel/banner/edit/:EditID"
          component={Bannerform}
        />
        <Route
          exact
          path="/clientpanel/faqcategory/"
          component={Faqcategorylist}
        />
        <Route
          exact
          path="/clientpanel/faqcategory/add"
          component={Faqcategoryform}
        />
        <Route
          exact
          path="/clientpanel/faqcategory/edit/:EditID"
          component={Faqcategoryform}
        />
        <Route exact path="/clientpanel/faq/" component={Faqlist} />
        <Route exact path="/clientpanel/faq/add" component={Faqform} />
        <Route exact path="/clientpanel/faq/edit/:EditID" component={Faqform} />
        <Route
          exact
          path="/clientpanel/emailtemplate/"
          component={Emailtemplatelist}
        />
        <Route
          exact
          path="/clientpanel/emailtemplate/add"
          component={Emailtemplateform}
        />
        <Route
          exact
          path="/clientpanel/emailtemplate/edit/:EditID"
          component={Emailtemplateform}
        />
        <Route exact path="/clientpanel/userroles/" component={Userroleslist} />
        <Route
          exact
          path="/clientpanel/userroles/add"
          component={Userrolesform}
        />
        <Route
          exact
          path="/clientpanel/userroles/edit/:EditID"
          component={Userrolesform}
        />
        <Route exact path="/clientpanel/users/" component={Userlist} />
        <Route exact path="/clientpanel/users/add" component={Userform} />
        <Route
          exact
          path="/clientpanel/users/edit/:EditID"
          component={Userform}
        />
        <Route
          exact
          path="/clientpanel/referral/"
          component={ReferralHistory}
        />
        <Route
          exact
          path="/clientpanel/promotions/"
          component={Promotionlist}
        />
        <Route
          exact
          path="/clientpanel/promotions/add"
          component={Promotionform}
        />
        <Route
          exact
          path="/clientpanel/promotions/edit/:EditID"
          component={Promotionform}
        />
        <Route
          exact
          path="/clientpanel/wallettopupplan/"
          component={Wallettopupplanlist}
        />
        <Route
          exact
          path="/clientpanel/wallettopupplan/add"
          component={Wallettopupplanform}
        />
        <Route
          exact
          path="/clientpanel/wallettopupplan/edit/:EditID"
          component={Wallettopupplanform}
        />
        <Route
          exact
          path="/clientpanel/wallettopuphistory/"
          component={Wallettopuphistorylist}
        />
        <Route
          exact
          path="/clientpanel/crmsettings/"
          component={Crmsettingsform}
        />
        <Route
          exact
          path="/clientpanel/rewardsettings/"
          component={Rewardsettingsform}
        />
        <Route exact path="/clientpanel/mission/" component={Missionform} />
        <Route
          exact
          path="/clientpanel/pointssettings/"
          component={Pointssettingsform}
        />
        <Route exact path="/clientpanel/customers/" component={Customerlist} />
        <Route
          exact
          path="/clientpanel/customers/add"
          component={Customerform}
        />
        <Route
          exact
          path="/clientpanel/customers/edit/:EditID"
          component={Customerform}
        />
        <Route
          exact
          path="/clientpanel/catalog-categories/"
          component={Categorylist}
        />
        <Route
          exact
          path="/clientpanel/catalog-categories/add"
          component={Categoryform}
        />
        <Route
          exact
          path="/clientpanel/catalog-categories/edit/:EditID"
          component={Categoryform}
        />
        <Route
          exact
          path="/clientpanel/catalog-subcategories/"
          component={Subcategorylist}
        />
        <Route
          exact
          path="/clientpanel/catalog-subcategories/add"
          component={Subcategoryform}
        />
        <Route
          exact
          path="/clientpanel/catalog-subcategories/edit/:EditID"
          component={Subcategoryform}
        />
        <Route
          exact
          path="/clientpanel/catalog-products/"
          component={Productslist}
        />
        <Route
          exact
          path="/clientpanel/catalog-products/add"
          component={Productsform}
        />
        <Route
          exact
          path="/clientpanel/catalog-products/edit/:EditID"
          component={Productsform}
        />
        <Route exact path="/clientpanel/catalog-group/" component={Grouplist} />
        <Route
          exact
          path="/clientpanel/catalog-group/add"
          component={Groupform}
        />
        <Route
          exact
          path="/clientpanel/catalog-group/edit/:EditID"
          component={Groupform}
        />
        <Route
          exact
          path="/clientpanel/order/:orderType/:orderID"
          component={OrderDetails}
        />
        <Route
          exact
          path="/clientpanel/order/:orderType/"
          component={Orderlist}
        />
        <Route
          exact
          path="/clientpanel/order-reports/"
          component={Reportlist}
        />
        <Route
          exact
          path="/clientpanel/order/:orderType/"
          component={Orderlist}
        />
        <Route exact path="/clientpanel/timeslot/" component={Timeslotlist} />
        <Route
          exact
          path="/clientpanel/timeslot/add"
          component={Timeslotform}
        />
        <Route
          exact
          path="/clientpanel/timeslot/edit/:EditID"
          component={Timeslotform}
        />
        <Route exact path="/clientpanel/catalog-tag/" component={Tagslist} />
        <Route exact path="/clientpanel/catalog-tag/add" component={Tagsform} />
        <Route
          exact
          path="/clientpanel/catalog-tag/edit/:EditID"
          component={Tagsform}
        />
        <Route exact path="/clientpanel/own-rider/" component={Ownriderlist} />
        <Route
          exact
          path="/clientpanel/own-rider/add"
          component={Ownriderform}
        />
        <Route
          exact
          path="/clientpanel/own-rider/edit/:EditID"
          component={Ownriderform}
        />
        <Route exact path="/clientpanel/points/" component={Pointslist} />
        <Route exact path="/clientpanel/points/:Type" component={Pointsform} />
        <Route exact path="/clientpanel/settings" component={Settingsform} />

        {/*  Client Panel Start*/}
        <Route path={"/refpage/:slugtext"} component={Refpage} />
        <Route component={Page404} />
      </Switch>
    </Router>
  </Provider>
);
