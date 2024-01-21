/* eslint-disable */
import React, { Component } from "react";

class PageLoader extends Component {
  constructor(props) {
    super(props);
    this.state = { pageloading: false };
  }
  componentDidMount() {}
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.state.pageloading !== nextProps.pageloading) {
      this.setState(
        {
          pageloading: nextProps.pageloading,
        },
        function () {
          if (nextProps.pageloading === true) {
            $.blockUI({
              message:
                '<div class="spinner-border spinner-border-lg text-secondary" role="status"></div>',
              css: {
                backgroundColor: "transparent",
                border: "0",
              },
              overlayCSS: {
                backgroundColor: "#fff",
                opacity: 0.8,
              },
            });
          } else {
            $.unblockUI();
          }
        }
      );
    }
  }

  render() {
    return <div></div>;
  }
}

export default PageLoader;
