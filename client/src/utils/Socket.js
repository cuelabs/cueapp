function Socket(evId, immediateSend, payload) {
  const url = `ws://ws?event=${evId}`
  this.ws = new WebSocket(url)

  this.ws.onopen = () => {
    if (!immediateSend) {
      console.log('connection established!')
    } else {
      this.ws.send(JSON.stringify(payload))
    }
  }

  this.assignMessageReader = function(handler) {
    this.ws.onmessage = event => {
      const msg = JSON.parse(event.data)
      handler(msg)
    }
  }

  this.sendMessage = function(m) {
    this.ws.send(JSON.stringify(m))
  }

  this.destroy = function() {
    this.ws.onmessage = null
    this.ws.close()
  }
}

export default Socket
