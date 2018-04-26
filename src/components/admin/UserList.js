import React, { Component } from 'react'
import { connect } from 'react-redux'
import web3utils from 'web3-utils'

import Heading from 'grommet/components/Heading'
import Box from 'grommet/components/Box'
import Label from 'grommet/components/Label'
import List from 'grommet/components/List'
import ListItem  from 'grommet/components/ListItem'
import Image from 'grommet/components/Image'
import Anchor from 'grommet/components/Anchor'
import Toast from 'grommet/components/Toast'
import AddIcon from 'grommet/components/icons/base/Add'
import SubtractIcon from 'grommet/components/icons/base/Subtract'

import { decrypt } from '../../utils/crypto'

class UserList extends Component {
  constructor() {
    super()
    this.state = {
      modalOpen: null,
      success: '',
      failure: '',
      userCount: '',
      users: [],
      toWhitelist: '',
      rmWhitelist: ''
    }

    this.getUsers = this.getUsers.bind(this)
    this.getUsersCount = this.getUsersCount.bind(this)
    this.getUsersCount = this.getUsersCount.bind(this)
    this.addWhitelist = this.addWhitelist.bind(this)
    this.rmWhitelist = this.rmWhitelist.bind(this)
  }

  componentDidMount() {
    this.getUsersCount()
    this.getUsers()
  }
  
  getUsersCount() {
    this.props.Token.deployed().then(async (token) => {
      token.getUserCount().then((res) => {
        this.setState({
          userCount: res ? res.toNumber() : 0
        })
      })
    })

    setTimeout(() => {
        this.getUsersCount()
    }, 2000)
  }

  getUsers() {
    if (this.state.userCount > 0) {
      let userData = []
      this.props.Token.deployed().then(async (token) => {
        for (let i = 0; i < this.state.userCount; i++) {
          token.getUserAtIndex(i, { from: this.props.account }).then(async (res) => {
            const _decryptedHash = await decrypt(res[2], process.env.REACT_APP_HASH_PASS)
            this.props.ipfs.catJSON(_decryptedHash, async (err, data) => {
              const _obj = JSON.parse(await decrypt(await decrypt(data, res[1]), process.env.REACT_APP_ENCRYPTION_PASS))
              if (!err) {
                _obj.user = res[1]
                userData.push(_obj)
                this.setState({
                  users: userData
                })
              } else {
                console.log('getUsers', err)
              }
            })
          })
        }
      })
    }

    setTimeout(() => {
      this.getUsers()
  }, 2000)
  }

  addWhitelist() {
    this.props.Crowdsale.deployed().then(async (token) => {
      if(web3utils.isAddress(this.state.toWhitelist)) {
        token.addToWhitelist(this.state.toWhitelist, {
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
            failure: `Error occurred: ${error.message}`
          })
        })
      } else {
        this.setState({
          modalOpen: true,
          failure: `Address to add isn't Ethereum's`
        })
      }
    })
  }

  rmWhitelist() {
    this.props.Crowdsale.deployed().then(async (token) => {
      if(web3utils.isAddress(this.state.rmWhitelist)) {
        token.removeFromWhitelist(this.state.rmWhitelist, {
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
            failure: `Error occurred: ${error.message}`
          })
        })
      } else {
        this.setState({
          modalOpen: true,
          failure: `Address to remove isn't Ethereum's`
        })
      }
    })
  }

  render() {
    let users = this.state.users
    const usersRendered = []

    for (let i = 0; i < users.length; i++) {
      usersRendered.push(
        <div key={i}>
          <List>
            <ListItem>
              <Box pad='medium' align='start'>
                User:
              </Box>
              <Box pad='medium' align='start'>
                <p>{ users[i].user }</p>
              </Box>
            </ListItem>
            <ListItem>
              <Box pad='medium' align='start'>
                Email:
              </Box>
              <Box pad='medium' align='start'>
                <p>{ users[i].email }</p>
              </Box>
            </ListItem>
            <ListItem>
              <Box pad='medium' align='start'>
              Name:
              </Box>
              <Box pad='medium' align='start'>
                <p>{ users[i].firstName } { users[i].lastName }</p>
                <p>{ users[i].docType } { users[i].docNo }</p>
                { users[i].idDocument ?
                 <p><Image src={users[i].idDocument} /></p>
                  : ''
                }
              </Box>
            </ListItem>
            <ListItem>
              <Box pad='medium' align='start'>
                Address:
              </Box>
              <Box pad='medium' align='start'>
                <p>{ users[i].address } { users[i].city } { users[i].country }</p>
                { users[i].addressDocument ?
                  <p><Image src={users[i].addressDocument} /></p>
                  : ''
                }
              </Box>
            </ListItem>
            <ListItem>
              <Box pad='medium' align='start'>
                Phone:
              </Box>
              <Box pad='medium' align='start'>
                <p>{ users[i].phone }</p>
              </Box>
            </ListItem>
          </List>
          <Box pad='medium' align='start'>
            <Anchor primary={true} icon={<AddIcon />} label='Add to whitelist' onClick={() => { this.setState({toWhitelist: users[i].user});this.addWhitelist()}} />
            <Anchor primary={true} icon={<SubtractIcon />} label='Remove from whitelist' onClick={() => { this.setState({rmWhitelist: users[i].user});this.rmWhitelist()}}/>
          </Box>
          <hr />
        </div>
      )
    }

    return (
      <Box align='center'>
        <Heading>Users</Heading>
        <Label>Found { this.state.userCount } user(s).</Label>
        { usersRendered }
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
    ipfs: state.ipfs,
    Token: state.Token,
    Crowdsale: state.Crowdsale,
    account: state.account
  }
}

export default connect(mapStateToProps)(UserList)
