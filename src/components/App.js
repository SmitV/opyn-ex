import React from 'react';
import Navbar from './Navbar';
import TradeModal from './TradeModal';
import '../assets/css/App.css';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      isConnected: false,
    }
    this.connectCache = this.connectCache.bind(this);
  }

  connectCache(connectedFlag) {
    this.setState({ isConnected: connectedFlag });
  }

  render() {
    return (
      <div className="opyn-main__container">
        <Navbar connect={this.connectCache}/>
        <TradeModal connected={this.state.isConnected} />
      </div>
    );
  }
}

export default App;
