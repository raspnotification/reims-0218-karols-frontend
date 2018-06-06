import React, { Component } from "react"
import { connect } from "react-redux"
import ChoicePrestation from "../components/ChoicePrestation"
import { fetchPrestation } from "../api"
import { makePrestationsReceived } from "../actions/actions"

const mapStateToProps = state => ({
  prestations: state.prestations
})

const mapDispatchToProps = dispatch => ({
  onPrestationsReceived: response => dispatch(makePrestationsReceived(response))
})

class PrestationWrap extends Component {
  render() {
    return (
      <div>
        {this.props.prestations.map(prestation => console.log(prestation))}
        <ChoicePrestation {...this.props.prestations} />
      </div>
    )
  }

  componentDidMount() {
    fetchPrestation().then(prestations =>
      this.props.onPrestationsReceived(prestations)
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PrestationWrap)
