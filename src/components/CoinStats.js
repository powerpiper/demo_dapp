import React, { Component } from 'react'
import { connect } from 'react-redux'

class CoinStats extends Component {
  constructor(props) {
    super(props)

    this.state = {
      supply: '...',
      kwh: '...',
      certificates: '...',
      tokensAvailable: '...'
    }

    this.getCoinStats = this.getCoinStats.bind(this)
  }

  componentDidMount() {
    this.getCoinStats()
  }

  getCoinStats(Token) {
    this.props.Token.deployed().then((token) => {
      token.totalSupply().then((supply) => {
        this.setState({
          supply: supply.toNumber() / 1000
        })
      })
    })

    this.props.Token.deployed().then((token) => {
      token.getEnergyReserves().then((reserves) => {
        this.setState({
          kwh: reserves.toNumber() / 1000
        })
      })

      /*
      exchange.getCertificatesLength({ from: this.props.account })
        .then((length) => {
          this.setState({
            certificates: length.toNumber()
          })
        })
        */

      token.tokensSupplyAvailable().then((tokensAvailable) => {
        this.setState({
          tokensAvailable: tokensAvailable.toNumber() / 1000
        })
      })
    })

    setTimeout(() => {
      this.getCoinStats(Token)
    }, 2000)
  }

  render() {
    return (
      <div>
        <h4>Market Info</h4>
        <h5>Tokens in Circulation: <span>{this.state.supply} PWP</span></h5>
        <h5>Energy Reserves: <span>{this.state.kwh} kWh</span></h5>
        <h5>Tokens available: <span>{this.state.tokensAvailable} PWP</span></h5>
         { /* <h5>Certificates: <span>{this.state.certificates}</span></h5> */ }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    Token: state.Token,
    Crowdsale: state.Crowdsale,
    Exchange: state.Exchange,
    account: state.account
  }
}

export default connect(mapStateToProps)(CoinStats)
