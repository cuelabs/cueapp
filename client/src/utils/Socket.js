import ReconnectingWebSocket from 'reconnectingwebsocket'

function Socket (evId, immediateSend, payload) {
  // const baseURL = 'ws://localhost:8080/'
  const baseURL = 'wss://arcane-tundra-63613.herokuapp.com/'
  const url = `${baseURL}ws?event=${evId}`
  
  this.ws = new ReconnectingWebSocket(url)
  this.ws.maxReconnectAttempts = 20

  this.ws.addEventListener('open', () => {
    if (!immediateSend) {
      console.log('connection established!')
    } else {
      this.ws.send(JSON.stringify(payload))
    }
  })

  this.assignMessageReader = function (handler) {
    this.ws.addEventListener('message', event => {
      const msg = JSON.parse(event.data)
      handler(msg)
    })
  }

  this.sendMessage = function (m) {
    this.ws.send(JSON.stringify(m))
  }

  this.destroy = function () {
    this.ws.close()
  }
}

export default Socket
