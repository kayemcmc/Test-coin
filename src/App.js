import React, { Component } from 'react'
import TriveCoin from '../build/contracts/TriveCoin.json'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      storageValue: 0,
      web3: null,
      myData: {
        amount: 0,
        sendTo: ""
      }
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      console.log(results.web3);
      this.setState({
        web3: results.web3
      })
      this.instantiateContract()
      // Instantiate contract once web3 provided.

    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
    const contract = require('truffle-contract')
    const coin = contract(TriveCoin)
    coin.setProvider(this.state.web3.currentProvider)

    this.state.web3.eth.getAccounts((error, accounts) => {
      coin.deployed().then((instance) => {
        console.log(instance.address)
      })
    })
  }
  createToken() {
    const contract = require('truffle-contract')
    const coin = contract(TriveCoin)
    coin.setProvider(this.state.web3.currentProvider)

    this.state.web3.eth.getAccounts((error, accounts) => {
      console.log(accounts[0], "is the current account");
      coin.deployed().then((instance) => {
        const coinInstance = instance
        // create tokens (1mil), name, symbol
        return coinInstance.TriveTokenERC20(1000000, "Kaitlin", "CEB", {from: accounts[0], gas: 6654755})
      })
    })
  }

  handleChange(e) {
    const { name, value } = e.target;
        this.setState((prevState) => ({
          myData: {
            ...prevState.myData,
            [name]: value
          }
        }));
  }
  handleSubmit(e) {
    e.preventDefault();
    const contract = require('truffle-contract')
    const coin = contract(TriveCoin)
    coin.setProvider(this.state.web3.currentProvider)
    this.state.web3.eth.getAccounts((error, accounts) => {
      coin.deployed().then((instance) => {
        const coinInstance = instance;
        //send tokens function
        return coinInstance.transfer(this.state.myData.sendTo, (this.state.myData.amount * 10 ** 18), {from: accounts[0], gas: 6654755})
      }).then((result) => {
        console.log(result);
      })
    }).catch(() => {
      console.log("OEPSIE, there is an error");
    })
  }


  render() {
    const {sendTo, amount} = this.state.myData;
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Truffle Box</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Good to Go!</h1>
              <p>Your Truffle Box is installed and ready.</p>
              <button onClick={() => {this.instantiateContract()}}>open console to check contract address from coin</button><br />
              <button onClick={() => {this.createToken()}}>Create Token</button>
              <br />
              <h3>send tokens:</h3>

                <label>address to: <input type="text" name="sendTo" value={sendTo} onChange={this.handleChange}></input></label><br />
                <label>amount: <input type="text" name="amount" value={amount} onChange={this.handleChange}></input></label><br />
                <button onClick={this.handleSubmit}>submit</button>

            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
