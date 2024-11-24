// frontend/src/WebSocketClient.js
class WebSocketClient {
  constructor() {
    this.connect();
  }

  connect() {
    const wsUrl = process.env.REACT_APP_WS_URL || 'wss://voter-compatibility-tool-production.up.railway.app/ws';
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('WebSocket Connected');
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
      setTimeout(() => this.connect(), 5000); // Reconnect after 5s
    };
  }
}