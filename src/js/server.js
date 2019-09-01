const ColyseusServer = require('colyseus')
const ColyseusClient = require('colyseus.js')

async function createServer() {  
  // ColyseusServer (barebones)
  const port = process.env.port || 2567

  const gameServer = new ColyseusServer.Server()
  gameServer.listen(port)

  const schema = require('@colyseus/schema');
  const Schema = schema.Schema;
  const ArraySchema = schema.ArraySchema;
  const MapSchema = schema.MapSchema;

  class Player extends Schema {
    constructor(sessionId, name) {
      super();
      this.id = sessionId;
      this.name = name;
      this.points = 0;   
    }
  }
  schema.defineTypes(Player, {
    id: "string",
    name: "string",
    points: "number"
  });

  class MainState extends Schema {
    constructor () {
        super();

        this.players = new MapSchema();
    }
  }

  schema.defineTypes(MainState, {
    players:{ map: Player },
  });

  class BattleRoom extends ColyseusServer.Room {
    // When room is initialized
    onCreate(options) {
      this.setState(new MainState())
    }

    // Authorize client based on provided options before WebSocket handshake is complete
    onAuth(client, options, request) {
      return true
    }

    // When client successfully join the room
    onJoin(client, options, auth) {
      console.log(client);
      
      // console.log(require('node-random-name')({ first: true }));
      this.state.players[client.sessionId] = new Player(client.sessionId, require('node-random-name')({ first: true }));
    }

    // When a client sends a message
    onMessage(client, message) {}

    // When a client leaves the room
    onLeave(client, consented) {
      delete this.state.players[client.sessionId];
    }

    // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
    onDispose() {}
  }
  // Define "battle" room
  gameServer.define('battle', BattleRoom)









  let client = new ColyseusClient.Client(`ws://${require('ip').address()}:2567`)
  client.create("battle", {/* options */}).then(room => {
    console.log("joined successfully", room);
    room.onStateChange.once((state) => {
      console.log(state);

    });    
  }).catch(e => {
    console.error("join error", e);
  });

  document.querySelector('#menuWindow').classList.add('hidden')
  document.querySelector('#gameWindow').classList.remove('hidden')
  // const remote = require('electron').remote
  // let w = remote.getCurrentWindow()
  // w.loadFile('./src/game.html')
}

document.querySelector('#hostGame').addEventListener('click', () => {
  createServer()
})
