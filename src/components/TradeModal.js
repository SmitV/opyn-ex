import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog, faLink, faArrowCircleDown } from '@fortawesome/free-solid-svg-icons'
import '../assets/css/TradeModal.css';

class TradeModal extends React.Component {
    constructor() {
        super();
        this.state = {
            fromValue: '',
            toValue: '',
            regExp:  /^[0-9]*[.,]?[0-9]*$/, 
            primaryBtnText: 'Connect Wallet',
            fromToken: { name: 'oToken', price: Math.random() * (100 - 10) + 10, balance: 1000},
            toToken: { name: 'USDT', price: 1, balance: 10000 },
            showLoader: false,
            isValid: false,
          }    
    }

    componentWillUpdate(props) {
        if (props.connected && this.state.primaryBtnText === 'Connect Wallet') {
            this.setState({ primaryBtnText: 'Swap' }, function(){ this.isValid() });
        }
    }

    handleInputChange(e) {
        const inputText = e.target.value;
        if(inputText == '' || this.state.regExp.test(inputText)) {
            this.setState({ [e.target.name]: inputText }, function() { this.computeToToken(inputText); this.isValid(); });
        }
        // this.isValid();
    }

    computeToToken(val) {
        const convPrice = this.state.fromToken.price / this.state.toToken.price;
        this.setState({ toValue: (convPrice * val).toFixed(2) });
    }

    isValid() {
        const fromVal = this.state.fromValue;
        const fromTokenObj = this.state.fromToken;
        const toTokenObj = this.state.toToken;
        debugger;

        if (this.state.primaryBtnText !== 'Connect Wallet' &&
            this.state.fromValue > 0 && 
            fromTokenObj.balance > 0 &&
            toTokenObj.balance > 0 &&
            fromVal <= fromTokenObj.balance) {
            this.setState({ isValid: true });
        } else {
            this.setState({ isValid: false });
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        if(this.state.primaryBtnText !== 'Connected Wallet') {
            this.computeTrade();    
        }
    }

    computeTrade() {
        const fromTokenObj = this.state.fromToken;
        const toTokenObj = this.state.toToken;
        fromTokenObj.balance -= parseFloat(this.state.fromValue);
        toTokenObj.balance += parseFloat(this.state.toValue);
        this.setState({ fromValue: '', toValue: '', fromToken: fromTokenObj, toToken: toTokenObj }, function() {
            this.isValid();
        });
    }

    conversionLogic() {
        if (this.state.isValid) {
            const convPrice = this.state.fromToken.price / this.state.toToken.price;
            return <span>1 {this.state.fromToken.name} =  {convPrice} {this.state.toToken.name}</span>
        } else {
            return <span>Insufficient balance, please try again</span>
        }
    }

    handleSwapArrowClick(e) {
        e.preventDefault();
        this.setState({ fromToken: this.state.toToken, toToken: this.state.fromToken });
    }

    handleMaxClick(e) {
        e.preventDefault();
        const convPrice = this.state.fromToken.price / this.state.toToken.price;
        this.setState({ 
            fromValue: this.state.fromToken.balance, 
            toValue: (convPrice * this.state.fromToken.balance).toFixed(2),
        }, function() {
            this.isValid();
        });
    }

    render() {
        return (
            <div className="opyn-trade__modal-container">
                <div className="opyn-trade__modal-contents">
                    <ul className="opyn-trade__setting-options">
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
                            <label><span>Pay</span><a onClick={(e   ) => this.handleMaxClick(e)} href="#" className="opyn-trade__label-span opyn-trade__label-click">Max: {this.state.fromToken.balance}</a></label>
                            <button className="opyn-trade__token-btn">{this.state.fromToken.name}</button>
                            <input onChange={(e) => this.handleInputChange(e)} inputmode="decimal" autocomplete="off" type="text" pattern="^[0-9]*[.,]?[0-9]*$" placeholder="0.0" minlength="1" maxlength="79" name="fromValue" value={this.state.fromValue}></input>
                        </div>
                        <button onClick={(e) => this.handleSwapArrowClick(e)}className="opyn-trade__side-swap">
                            <FontAwesomeIcon icon={faArrowCircleDown} />
                        </button>
                        <div>
                            <label><span>Receive</span><span className="opyn-trade__label-span">Available: {this.state.toToken.balance}</span></label>
                            <button className="opyn-trade__token-btn">{this.state.toToken.name}</button>
                            <input inputmode="decimal" type="text" placeholder="0.0" name="toValue" value={this.state.toValue}></input>
                        </div>
                        <div className="opyn-trade__conv-container">{this.conversionLogic()}</div>
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
                        <button onClick={(e) => this.handleSubmit(e)} className={this.state.isValid ? "opyn-trade__primary-btn" : "opyn-trade__primary-btn opyn-trade__primary-btn-invalid"}>{this.state.primaryBtnText}</button>
                    </form>
                </div>
            </div>
        );
    }
}

export default TradeModal;
