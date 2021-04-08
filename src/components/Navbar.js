import React from "react";
import { truncateAddress } from "../util";
import "../assets/css/Navbar.css";

export default class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navOptions: ["Trade", "Analytics", "Team", "Contact"],
      account: "",
      isConnected: false,
    };
  }

  connectAccounts() {
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((response) => {
          this.setState({
            account: response[0],
            isConnected: window.ethereum.isConnected(),
          });
          this.props.connect(window.ethereum.isConnected());
        })
        .catch((err) => {
          if (err.code === 4001) {
            // EIP-1193 userRejectedRequest error
            // If this happens, the user rejected the connection request.
            console.log("Please connect to MetaMask.");
          } else {
            console.error(err);
          }
        });
    }
  }

  render() {
    return (
      <nav className="opyn-nav__container flex justify-between items-center p-5">
        <h2>opyn</h2>
        <ul className="opyn-nav__options flex items-center">
          {this.state.navOptions.map((option) => {
            return (
              <li>
                <a href="#">{option}</a>
              </li>
            );
          })}
          {this.state.isConnected ? (
            <li className="opyn-nav__connected-account">
              {truncateAddress(this.state.account)}
            </li>
          ) : (
            <li>
              <button
                onClick={(e) => this.connectAccounts(e)}
                className="opyn-nav__connect-btn"
              >
                Connect
              </button>
            </li>
          )}
        </ul>
      </nav>
    );
  }
}
