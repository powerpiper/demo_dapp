/*import React, { Component } from 'react'
import { connect } from 'react-redux'
import { message, Table, Form, Input, Button } from 'antd'
import _ from 'lodash'
const { Column } = Table

class CertificatesAdmin extends Component {
  constructor() {
    super()
    this.state = {
      certificates: [],
      url: '',
      amount: null,
      loading: false
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.fetchCertificates = this.fetchCertificates.bind(this)
    this.deleteCertificate = this.deleteCertificate.bind(this)
  }

  async componentDidMount() {
    this.fetchCertificates();
    this.interval = setInterval(() => this.fetchCertificates(), 10000)
  }

  handleSubmit(event) {
    event.preventDefault()

    this.setState({
      loading: true
    })
    this.hide = message.loading('Action in progress, do not close or reset this window..', 0)

    this.props.Exchange.deployed().then((exchange) => {
      const _gas = await token.mint.estimateGas(token.address, this.state.amount * 10 ** env.DECIMALS)
      exchange.addCertificate(
        this.state.url,
        this.state.amount * 1000,
        {
          from: this.props.account,
          gas: _gas
        },
      ).then(() => {
        setTimeout(() => {
          this.fetchCertificates()
        }, 1000)

        this.setState({
          url: '',
          amount: null,
          loading: false
        })

        this.hide()
      }).catch((error) => {
        console.log(error.message)
        this.setState({
          loading: false
        })
        this.hide()
      })
    })
  }

  handleChange(event) {
    const { target } = event
    const value = target.type === 'checkbox' ? target.checked : target.value
    const { name } = target

    this.setState({
      [name]: value
    })
  }

  fetchCertificates(cb) {
    let certificates = []
    const that = this

    function addCertificate(res, i, total) {
      certificates.push({
        key: i,
        url: res[0],
        amount: res[1].toNumber() / 1000
      })

      certificates = _.orderBy(certificates, ['key'], ['desc'])

      if (certificates.length === total) {
        that.setState({ certificates })

        if (cb) cb()
      }
    }

    this.props.Exchange.deployed().then((exchange) => {
      exchange.getCertificatesLength({ from: this.props.account })
        .then((total) => {
          for (let i = 0; i < total.toNumber(); i += 1) {
            exchange.getCertificate(i, { from: this.props.account })
              .then((res) => {
                addCertificate(res, i, total.toNumber())
              })
          }
        })
    })
  }

  deleteCertificate(key) {
    this.setState({ loading: true });
    this.hide = message.loading('Action in progress, do not close or reset this window..', 0)

    this.props.Exchange.deployed().then((exchange) => {
      const _gas = await token.mint.estimateGas(token.address, this.state.amount * 10 ** env.DECIMALS)
      exchange.deleteCertificate(
        key,
        {
          from: this.props.account,
          gas: _gas
        },
      ).then(() => {
        this.fetchCertificates(() => {
          setTimeout(() => {
            this.setState({ loading: false })
            this.hide()
          }, 10000)
        });
      }).catch((error) => {
        // eslint-disable-next-line
        console.log(error.message)
        this.hide()
      });
    })
  }

  render() {
    return (
      <div>
        <div>
          <Form onSubmit={this.handleSubmit}>
            <Input type='text' onChange={this.handleChange} value={this.state.url} name='url' placeholder='Certificate URL' />
            <Input type='number' onChange={this.handleChange} value={this.state.amount} name='amount' placeholder='Amount it represents' />
            <Button type='primary' htmlType='submit' loading={this.state.loading}>
            Add certificate
            </Button>
          </Form>

          <Table dataSource={this.state.certificates}>
            <Column title='URL' dataIndex='url' key='url' />
            <Column title='Amount' dataIndex='amount' key='amount' />
            <Column title='Delete?' key='action'
              render={(text, record) => (
                <span>
                  <Button
                    onClick={() => this.deleteCertificate(record.key)}
                    type='primary'
                    loading={this.state.loading}
                  >
                    Delete
                  </Button>
                </span>
              )}
            />
          </Table>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    web3: state.web3,
    Exchange: state.Exchange,
    Token: state.Token,
    account: state.account
  }
}

export default connect(mapStateToProps)(CertificatesAdmin)
*/