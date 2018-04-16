import React, { Component } from 'react'
import { connect } from 'react-redux'
import Toast from 'grommet/components/Toast'
import Heading from 'grommet/components/Heading'
import Box from 'grommet/components/Box'
import TextInput from 'grommet/components/TextInput'
import Button from 'grommet/components/Button'
import Label  from 'grommet/components/Label'
import Form  from 'grommet/components/Form'
import env from '../../env'

class PriceMarkupAdmin extends Component {
  constructor() {
    super()
    this.state = {
      percentage: '',
      priceMarkup: ''
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event) {
    const { target } = event
    const value = target.type === 'checkbox' ? target.checked : target.value
    const { name } = target

    this.setState({
      [name]: value
    })
  }

  handleSubmit(event) {
    event.preventDefault()

    this.props.Token.deployed().then(async (token) => {
      token.priceMarkup().call().then((res) => {
        this.setState({
          priceMarkup: res.toNumber()
        })
      })

      if(this.state.percentage > 0) {
        token.setPriceMarkup(this.state.percentage * 10 ** env.DECIMALS, {
          from: this.props.account,
          gas: 300000
        })
        .then((receipt) => {
          // console.log('Success: ', receipt)
          this.setState({
            modalOpen: true,
            success: `Success! Your tx: ${receipt.tx}`
          })
        })
        .catch((error) => {
          // console.log(error.message)
          this.setState({
            modalOpen: true,
            failure: `Error occured: ${error.message}`
          })
        })
      } else {
        this.setState({
          modalOpen: true,
          failure: 'Please check the form.'
        })
      }
    })
  }

  render() {
    return (
      <Box align='center'>
        <Heading>Set new price markup</Heading>
        <Label>Current markup is { this.state.priceMarkup / 10 ** env.DECIMALS }</Label>
        <Form onSubmit={this.handleSubmit}>
          <Box pad='small' align='center'>
            <Label labelFor="fee">New markup:</Label>
          </Box>
          <Box pad='small' align='center'>
            <TextInput
              if='fee'
              step='1'
              type='number'
              onChange={this.handleChange}
              value={this.state.percentage}
              name='percentage'
              placeholder='Percentage over spot price, e.g. 1'/>
          </Box>
          <Box pad='small' align='center'>
              <Button primary={true} type='submit' label='Set' />
          </Box>
        </Form>
          { this.state.modalOpen && <Toast
            status={this.state.success ? 'ok' : 'critical' }>
              <p>{ this.state.success ? this.state.success : null }</p>
              <p>{ this.state.failure ? this.state.failure : null }</p>
            </Toast>
          }
      </Box>
    )
  }
}

function mapStateToProps(state) {
  return {
    web3: state.web3,
    Token: state.Token,
    account: state.account
  }
}

export default connect(mapStateToProps)(PriceMarkupAdmin)
