import React, { Component } from "react";
import message from "antd/lib/message";
import DefaultLayout from "../partials/layouts/layout";

export default class ErrorBoundary extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      if (!window.navigator.onLine) {
        message.error("Network error");
      }

      return <DefaultLayout isDetailApp={this.props.isDetailApp} />;
    }
    return this.props.children;
  }
}
