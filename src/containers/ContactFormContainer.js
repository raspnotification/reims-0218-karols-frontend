import React, { Component } from "react"
import { Field, reduxForm, initialize } from "redux-form"
import Recaptcha from "react-grecaptcha"
import { connect } from "react-redux"
import { Button, Alert } from "reactstrap"
import Zoom from "react-reveal/Zoom"

import { fetchCreateReservation } from "../api/fetchCreateReservation"
import {
  getSelectedForm,
  getReservationData,
  getFormErrors,
  getSuccessReservation
} from "../resume"
import { makeSuccessReservation, requestLoading } from "../actions/actions"
import { showButtonRefresh } from "../display"
import ButtonRefresh from "../components/ButtonRefresh"

const validate = values => {
  const errors = {}
  if (!values.firstName) {
    errors.firstName = "Champ requis"
  }
  if (!values.lastName) {
    errors.lastName = "Champ requis"
  }
  if (!values.email) {
    errors.email = "Champ requis"
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Veuillez rentrer une adresse mail valide"
  }
  if (!values.phone) {
    errors.phone = "Champ requis"
  } else if (!/^(0|[0-9][0-9]{9})$/i.test(values.phone)) {
    errors.phone = "Veuillez renter un numéro de téléphone à 10 chiffres"
  }
  return errors
}

const renderField = ({ label, input, meta: { touched, error } }) => (
  <div>
    <label
      style={{
        display: "inline-block",
        width: "140px",
        textAlign: "center"
      }}
    >
      {label}
    </label>
    <input
      style={{
        backgroundColor: "#FFFFFF",
        color: "#181616",
        marginLeft: "20px",
        borderRadius: "10px"
      }}
      {...input}
    />
    <div>
      {touched &&
        error && (
          <span
            style={{
              color: "red",
              fontSize: "13px"
            }}
          >
            {error}
          </span>
        )}
    </div>
  </div>
)

const mapDispatchToProps = dispatch => ({
  onLoading: loading => dispatch(requestLoading(loading)),
  success: () => {
    dispatch(makeSuccessReservation())
  },
  initForm: action => dispatch(action)
})

const mapStateToProps = state => ({
  selectedForm: getSelectedForm(state),
  reservationData: getReservationData(state),
  formErrors: getFormErrors(state),
  successReservation: getSuccessReservation(state),
  buttonRefresh: showButtonRefresh(state),
  showAlert: state.reservation.success
})

class ContactForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      validCaptcha: false,
      data: {}
    }
    this.verifyCallback = this.verifyCallback.bind(this)
  }

  verifyCallback() {
    this.setState({
      validCaptcha: true
    })
  }

  render() {
    const { handleSubmit } = this.props
    return (
      <Zoom>
        <form
          onSubmit={handleSubmit}
          style={{
            margin: "10px auto",
            padding: "16px",
            background: "#F7F7F7",
            fontSize: "22px",
            borderRadius: "60px",
            textAlign: "center",
            border: "2px solid grey"
          }}
          className="justify-content-center"
        >
          <h2
            style={{
              background: "#f2f2f2",
              color: "#26292D",
              fontSize: "30px",
              fontWeight: "100",
              padding: "20px",
              borderRadius: "10px",
              border: "1px solid #797979",
              margin: "30px"
            }}
          >
            {" "}
            Formulaire de réservation{" "}
          </h2>
          <div
            style={{
              marginTop: "20px"
            }}
          >
            <Field
              name="firstName"
              type="text"
              component={renderField}
              label="Prénom"
            />
          </div>
          <div
            style={{
              marginTop: "20px"
            }}
          >
            <Field
              name="lastName"
              type="text"
              component={renderField}
              label="Nom"
            />
          </div>
          <div
            style={{
              marginTop: "20px"
            }}
          >
            <Field
              name="email"
              type="email"
              component={renderField}
              label="Email"
            />
          </div>
          <div
            style={{
              marginTop: "20px"
            }}
          >
            <Field
              name="phone"
              type="number"
              component={renderField}
              label="Téléphone"
            />
          </div>
          <Recaptcha
            sitekey={process.env.REACT_APP_SITE_KEY}
            callback={this.verifyCallback}
            expiredCallback={() => console.log("expiredcaptcha")}
            locale="fr-FR"
            className="customClassName"
            data-theme="grey"
            style={{
              display: "table",
              margin: "0 auto",
              paddingBottom: "30px",
              marginTop: "30px"
            }}
          />
          <Button
            disabled={
              !this.state.validCaptcha ||
              this.props.formErrors ||
              this.props.successReservation
            }
            outline
            color="secondary"
            onClick={() => {
              return fetchCreateReservation({
                loading: this.props.onLoading(true),
                contact: this.props.selectedForm,
                ...this.props.reservationData
              }).then(data => {
                localStorage.setItem(
                  "datas",
                  JSON.stringify(this.props.selectedForm)
                )
                this.props.success()
              })
            }}
          >
            Valider
          </Button>{" "}
          <div
            style={{
              marginTop: "30px"
            }}
          >
            {this.props.buttonRefresh && <ButtonRefresh />}
          </div>
          {this.props.showAlert && (
            <Alert
              style={{
                marginTop: "30px"
              }}
            >
              {" "}
              Vous avez reçu un mail de confirmation{" "}
            </Alert>
          )}
        </form>
      </Zoom>
    )
  }

  componentDidMount() {
    const data = localStorage.getItem("datas")
    if (data) {
      const initializeFormLocalStorage = initialize("contact", JSON.parse(data))
      this.props.initForm(initializeFormLocalStorage)
    }
  }
}

ContactForm = reduxForm({
  form: "contact",
  validate
})(ContactForm)

export default connect(mapStateToProps, mapDispatchToProps)(ContactForm)
