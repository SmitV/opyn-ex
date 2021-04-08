import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCog,
  faLink,
  faArrowCircleDown,
  faUnlockAlt,
} from "@fortawesome/free-solid-svg-icons";
import Loader from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../assets/css/TradeModal.scss";

const approvalStates = ["Connect Wallet", "Swap"];

class TradeModal extends React.Component {
  constructor() {
    super();
    this.state = {
      fromValue: "",
      toValue: "",
      regExp: /^[0-9]*[.,]?[0-9]*$/,
      primaryActionState: 0,
      fromToken: {
        name: "oToken",
        price: Math.random() * (100 - 10) + 10,
        balance: 1000,
      },
      toToken: { name: "USDT", price: 1, balance: 10000 },
      isValid: false,
      isLoading: false,
      isApprovalLoading: false,
      approvedTokens: new Set(),
      isTokenApproved: false,
    };
  }

  componentWillUpdate(props) {
    if (props.connected && !this.state.primaryActionState) {
      this.setState({ primaryActionState: 1 }, function () {
        this.isValid();
      });
    }
  }

  handleInputChange(e) {
    const inputText = e.target.value;
    if (inputText == "" || this.state.regExp.test(inputText)) {
      this.setState({ [e.target.name]: inputText }, function () {
        this.computeToToken(inputText);
        this.isValid();
      });
    }
  }

  approveToken() {
    const { approvedTokens, fromToken } = this.state;
    approvedTokens.add(fromToken.name);
    this.setState({ approvedTokens: approvedTokens });
  }

  computeToToken(val) {
    const convPrice = this.state.fromToken.price / this.state.toToken.price;
    this.setState({ toValue: (convPrice * val).toFixed(2) });
  }

  isValid() {
    const { fromValue, fromToken, isTokenApproved } = this.state;

    if (
      this.state.primaryActionState === 1 &&
      fromValue > 0 &&
      isTokenApproved &&
      fromToken.balance > 0 &&
      fromValue <= fromToken.balance
    ) {
      this.setState({ isValid: true });
    } else {
      this.setState({ isValid: false });
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.isValid) {
      this.handleLoadingState();
    }
  }

  computeTrade() {
    const fromTokenObj = this.state.fromToken;
    const toTokenObj = this.state.toToken;
    fromTokenObj.balance -= parseFloat(this.state.fromValue);
    toTokenObj.balance += parseFloat(this.state.toValue);
    this.setState(
      {
        fromValue: "",
        toValue: "",
        fromToken: fromTokenObj,
        toToken: toTokenObj,
      },
      function () {
        this.isValid();
      }
    );
  }

  conversionLogic() {
    if (this.state.isValid) {
      const convPrice = this.state.fromToken.price / this.state.toToken.price;
      return (
        <span>
          1 {this.state.fromToken.name} = {convPrice} {this.state.toToken.name}
        </span>
      );
    } else {
      return <span>Please approve token and check balance is sufficient</span>;
    }
  }

  handleLoadingState() {
    this.setState({ isLoading: true });
    if(!this.state.isLoading) {
      setTimeout(() => {
        this.setState({ isLoading: false });
        this.computeTrade();
        toast.dark("✨ Trade successfully executed!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }, 5000);
    }
  }

  handleSwapArrowClick(e) {
    e.preventDefault();
    this.setState(
      { fromToken: this.state.toToken, toToken: this.state.fromToken },
      () => {
        this.checkTokenApproval();
      }
    );
  }

  checkTokenApproval() {
    const { approvedTokens, fromToken } = this.state;
    if (!approvedTokens.has(fromToken.name)) {
      this.setState({ isTokenApproved: false });
    } else {
      this.setState({ isTokenApproved: true });
    }
  }

  handleMaxClick(e) {
    e.preventDefault();
    const convPrice = this.state.fromToken.price / this.state.toToken.price;
    this.setState(
      {
        fromValue: this.state.fromToken.balance,
        toValue: (convPrice * this.state.fromToken.balance).toFixed(2),
      },
      function () {
        this.isValid();
      }
    );
  }

  handleApproval(e) {
    e.preventDefault();
    this.setState({ isApprovalLoading: true });
    setTimeout(() => {
      this.approveToken();
      this.setState({ isApprovalLoading: false, isTokenApproved: true });
      this.isValid();
      toast.dark("✨ " + this.state.fromToken.name +  " has been approved!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }, 5000);
  }

  render() {
    return (
      <div className="opyn-trade__modal-container flex justify-center items-center">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <div className="opyn-trade__modal-contents">
          <ul className="opyn-trade__setting-options flex justify-end mb-4">
            <li>
              <button>
                <FontAwesomeIcon icon={faLink} />
              </button>
            </li>
            <li>
              <button>
                <FontAwesomeIcon icon={faCog} />
              </button>
            </li>
          </ul>
          <form className="opyn-trade__input-container">
            <div>
              <label className="flex justify-between items-center">
                <span>Pay</span>
                <a
                  onClick={(e) => this.handleMaxClick(e)}
                  href="#"
                  className="opyn-trade__label-span opyn-trade__label-click"
                >
                  Max: {this.state.fromToken.balance}
                </a>
              </label>
              <div className="opyn-trade__value-container flex justify-between mt-1">
                <button className="opyn-trade__token-btn">
                  {this.state.fromToken.name}
                </button>
                <input
                  onChange={(e) => this.handleInputChange(e)}
                  inputmode="decimal"
                  autocomplete="off"
                  type="text"
                  pattern="^[0-9]*[.,]?[0-9]*$"
                  placeholder="0.0"
                  minlength="1"
                  maxlength="79"
                  name="fromValue"
                  value={this.state.fromValue}
                ></input>
                {!this.state.isTokenApproved &&
                this.state.primaryActionState ? (
                  <button
                    onClick={(e) => this.handleApproval(e)}
                    className="opyn-trade__approve-btn"
                  >
                    {this.state.isApprovalLoading ? (
                      <Loader
                        type="TailSpin"
                        color="#00BFFF"
                        height={20}
                        width={20}
                      />
                    ) : (
                      <div>
                        <FontAwesomeIcon icon={faUnlockAlt} />{" "}
                        <span>Approve</span>
                      </div>
                    )}
                  </button>
                ) : null}
              </div>
            </div>
            <button
              onClick={(e) => this.handleSwapArrowClick(e)}
              className="opyn-trade__side-swap mt-4"
            >
              <FontAwesomeIcon icon={faArrowCircleDown} />
            </button>
            <div>
              <label className="flex justify-between items-center">
                <span>Receive</span>
                <span className="opyn-trade__label-span">
                  Available: {this.state.toToken.balance}
                </span>
              </label>
              <div className="opyn-trade__value-container flex justify-between mt-1">
                <button className="opyn-trade__token-btn">
                  {this.state.toToken.name}
                </button>
                <input
                  inputmode="decimal"
                  type="text"
                  placeholder="0.0"
                  name="toValue"
                  value={this.state.toValue}
                  readOnly
                ></input>
              </div>
            </div>
            <div className="opyn-trade__conv-container my-4">
              {this.conversionLogic()}
            </div>
            <ul className="opyn-trade__detail-container">
              <li>
                <span>Slippage Tolerance</span>
                <span>0.5%</span>
              </li>
              <li>
                <span>Minimum Received</span>
                <span>0</span>
              </li>
            </ul>
            <div className="opyn-trade__submission-container mt-4">
              <button
                onClick={(e) => this.handleSubmit(e)}
                className={
                  this.state.isValid
                    ? "opyn-trade__primary-btn flex items-center justify-center"
                    : "opyn-trade__primary-btn opyn-trade__primary-btn-invalid"
                }
              >
                {this.state.isLoading ? (
                  <Loader
                    type="TailSpin"
                    color="#00BFFF"
                    className=""
                    height={40}
                    width={40}  
                  />
                ) : (
                  approvalStates[this.state.primaryActionState]
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default TradeModal;
