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
        <table>
          <ServersHeading/>
          <tbody>
            <Servers servers={this.state.servers}/>
          </tbody>
        </table>
      </div>
    );
  }
}

class Servers extends Component {
  render() {
    let serverComponents = this.props.servers.map((server) => {
      return <Server key={server.stats.hostname} server={server}/>
    });
    return <div>{serverComponents}</div>;
  }
}

class Server extends Component {
  render() {
    return (
      <tr className="Server">
        <td className="Hostname">{this.props.server.stats.hostname}</td>
        <td className="Cpu">{this.props.server.stats.cpu}%</td>
        <td className="Memory">{this.props.server.stats.memory}%</td>
        <td className="Disk">{this.props.server.stats.disk}%</td>
      </tr>
    );
  }
}

class ServersHeading extends Component {
  render() {
    return (
      <thead>
      <tr className="ServersHeading">
        <th>Hostname</th>
        <th>CPU Usage</th>
        <th>Memory Usage</th>
        <th>Disk Usage</th>
      </tr>
      </thead>
    );
  }
}

export default App;
