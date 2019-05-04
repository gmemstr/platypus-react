import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      servers: [],
      websocketConnected: true,
    };
    this.websocketMessage = this.websocketMessage.bind(this);
    var loc = window.location, new_uri;
    if (loc.protocol === "https:") {
      new_uri = "wss:";
    } else {
      new_uri = "ws:";
    }
    new_uri += "//" + loc.host;
    new_uri += loc.pathname + "getstats";

    this.socket = new WebSocket(new_uri);
    this.socket.onopen = (event) => {
      console.log("websocket opened");
      this.setState({websocketConnected: true});
    };
    this.socket.onclose = event => {
      console.log("websocket closed");
      this.setState({websocketConnected: false});
    }
    this.socket.onmessage = (event) => { this.websocketMessage(event) };
  }

  websocketMessage(event) {
    let servers = JSON.parse(event.data);
    let serversArray = [];
    for (var key in servers) {
      serversArray.push(servers[key]);
    }
    this.setState({ servers: serversArray });
  }
  render() {
    return (
      <div className="App">
        <div className="Websocket"><WebsocketState state={this.state.websocketConnected} /></div>
        <div className="Servers">
          <table>
            <ServersHeading />
            <tbody>
              <Servers servers={this.state.servers} />
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

class WebsocketState extends Component {
  render() {
    return (
      <span className={`Websocket-${this.props.state}`}>{this.props.state === true ? "Connected" : "Disconnected"}</span>
    );
  }
}

class Servers extends Component {
  render() {
    let serverComponents = this.props.servers.map((server) => {
      return <Server key={server.stats.hostname} server={server} />
    });
    return <div>{serverComponents}</div>;
  }
}

class Server extends Component {
  render() {
    return (
      <tr className="Server">
        <td className="Hostname">{this.props.server.stats.hostname}</td>
        <td className="Cpu">{this.props.server.online === true ? this.props.server.stats.cpu + '%' : 'OFFLINE'}</td>
        <td className="Memory">{this.props.server.online === true ? this.props.server.stats.memory + '%' : 'OFFLINE'}</td>
        <td className="Disk">{this.props.server.online === true ? this.props.server.stats.disk + '%' : 'OFFLINE'}</td>
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
