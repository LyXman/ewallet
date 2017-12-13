import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Button } from 'react-bootstrap';
import { getTranslate } from 'react-localize-redux';

import { userActions } from "../../actions";
import OMGFieldGroup from "../../components/OMGFieldGroup"

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      submitted: false,
      didModifyEmail: false,
      didModifyPassword: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    const { id, value } = e.target;
    var { didModifyEmail, didModifyPassword} = this.state
    if (id === "email") { didModifyEmail = true }
    else if (id === "password") { didModifyPassword = true }
    this.setState({ [id]: value,
                    didModifyEmail: didModifyEmail,
                    didModifyPassword: didModifyPassword
                  });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({ submitted: true });
    const { email, password } = this.state;
    const { dispatch } = this.props;
    if (email && password) {
      dispatch(userActions.login(email, password));
    }
  }

  isEmailValid() {
    return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/.test(this.state.email))
  }

  isPasswordValid() {
    return this.state.password.length >= 8
  }

  isFormValid() {
    return this.isEmailValid() && this.isPasswordValid()
  }

  getEmailValidationState() {
    const { submitted, didModifyEmail } = this.state;
    return (!this.isEmailValid() && (submitted || didModifyEmail)) ? "error" : null
  }

  getPasswordValidationState() {
    const { submitted, didModifyPassword } = this.state;
    return (!this.isPasswordValid() && (submitted || didModifyPassword)) ? "error" : null
  }

  render() {
    const { loggingIn, translate } = this.props;
    const { email, password } = this.state;
    return (
      <div className="row">
        <div className="col-xs-12 col-sm-8 col-sm-offset-2">
          <div className="omg-form">
            <h2 className="omg-form__title">{translate("sign-in.sign-in")}</h2>
            <form onSubmit={this.handleSubmit}>
              <OMGFieldGroup
                id="email"
                label={translate("sign-in.email.label")}
                help = {translate("sign-in.email.help")}
                validationState={this.getEmailValidationState()}
                type="text"
                value={email}
                onChange={this.handleChange}
              />
              <OMGFieldGroup
                id="password"
                label={translate("sign-in.password.label")}
                help={translate("sign-in.password.help")}
                validationState={this.getPasswordValidationState()}
                type="password"
                value={password}
                onChange={this.handleChange}
              />
              <Button bsClass="btn btn-omg-blue"
                      bsStyle="primary"
                      disabled={loggingIn || !this.isFormValid()}
                      type="submit"
              >
                {loggingIn ? translate("global.loading") : translate("sign-in.sign-in")}
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { loggingIn } = state.authentication;
  const translate = getTranslate(state.locale);
  return {
    loggingIn, translate
  };
}

export default withRouter(connect(mapStateToProps)(SignIn));
