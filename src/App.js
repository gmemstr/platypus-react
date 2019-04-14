import React, {Component} from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      servers: []
    };
    this.websocketMessage = this.websocketMessage.bind(this);
    this.socket = new WebSocket('ws://localhost:8080/getstats');
    this.socket.onopen = (event) => {
      console.log("websocket opened")
    };
    this.socket.onmessage = (event) => {this.websocketMessage(event)};
  }

  websocketMessage(event) {
    let servers = JSON.parse(event.data);
    let serversArray = [];
    for (var key in servers) {
      serversArray.push(servers[key]);
    }
    this.setState({servers: serversArray});
  }
  render() {
    return (
      <div className="App">
        <ServersHeading />
        <Servers servers={this.state.servers}/>
      </div>
    );
  }
}

class Servers extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let serverComponents = this.props.servers.map((server) => {
      return <Server key={server.stats.hostname} server={server}/>
    });
    return <div>{serverComponents}</div>;
  }
}

class Server extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="Server">
        <span className="Hostname">{this.props.server.stats.hostname}</span>
        <span className="Cpu">{this.props.server.stats.cpu}%</span>
        <span className="Memory">{this.props.server.stats.memory}%</span>
        <span className="Disk">{this.props.server.stats.disk}%</span>
      </div>
    );
  }
}

class ServersHeading extends Component {
  render() {
    return (
      <div className="ServersHeading">
        <h2>Hostname</h2>
        <h2>CPU Usage</h2>
        <h2>Memory Usage</h2>
        <h2>Disk Usage</h2>
      </div>
    );
  }
}

export default App;
