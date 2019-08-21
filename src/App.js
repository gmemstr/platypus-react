import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      servers: [],
      plugins: [],
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
    let pluginsArray = [];
    for (var key in servers) {
      console.log(servers[key])
      if (servers[key]["type"] == "stats") {
        serversArray.push(servers[key]);
      }
      else {
        pluginsArray.push(servers[key]);
      }
    }

    this.setState({ servers: serversArray, plugins: pluginsArray });
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
        <div className="Plugins">
          <Plugins plugins={this.state.plugins} />
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

class Plugins extends Component {
  render() {
    let pluginComponents = this.props.plugins.map((plugin) => {
      return <Plugin key={plugin.type} plugin={plugin} />
    });
    return <table><tbody>{pluginComponents}</tbody></table>; 
  }
}

class Plugin extends Component {
  render() {
    let plugin = this.props.plugin;
    console.log(plugin)
    let custom = JSON.parse(plugin.custom)
    if (plugin) {
      console.log(custom)
      let elems = [];
      for (let key in custom) {
        console.log(key, custom[key])
        elems.push(<td>{key}: {custom[key]}</td>)
      };
      return <tr className="Plugin">{elems}</tr>
    }
  }
}

export default App;