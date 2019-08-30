const ColyseusServer = require('colyseus')
const ColyseusClient = require('colyseus.js')

async function createServer() {  
  // ColyseusServer (barebones)
  const port = process.env.port || 2567

  const gameServer = new ColyseusServer.Server()
  gameServer.listen(port)

  class BattleRoom extends ColyseusServer.Room {
    // When room is initialized
    onCreate(options) {}

    // Authorize client based on provided options before WebSocket handshake is complete
    onAuth(client, options, request) {
      return true
    }

    // When client successfully join the room
    onJoin(client, options, auth) {}

    // When a client sends a message
    onMessage(client, message) {}

    // When a client leaves the room
    onLeave(client, consented) {}

    // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
    onDispose() {}
  }
  // Define "battle" room
  gameServer.define('battle', BattleRoom)

  let client = new ColyseusClient.Client(`ws://${require('ip').address()}:2567`)
  client.create("battle", {/* options */}).then(room => {
    console.log("joined successfully", room);
  }).catch(e => {
    console.error("join error", e);
  });
}

document.querySelector('#hostGame').addEventListener('click', () => {
  createServer()
})
