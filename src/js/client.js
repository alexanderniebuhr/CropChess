const ColyseusClient = require('colyseus.js')
let client

async function joinRoom() {  
  
}

async function connectServer() {
  let remoteIP = document.querySelector('#remoteIPAddress').value
  console.log(remoteIP)
  client = await new ColyseusClient.Client(`ws://${remoteIP}:2567`);
  console.log(client);
  
}

async function getAvailableRooms() {
  client.getAvailableRooms("battle").then(rooms => {
    rooms.forEach((room) => {
      console.log(room.roomId);
      console.log(room.clients);
      console.log(room.maxClients);
      console.log(room.metadata);
      document.querySelector('#roomList').innerHTML = "<li>" + room.roomId + "</li>"
    });
  }).catch(e => {
    console.error(e);
  });
}

document.querySelector('#findRooms').addEventListener('click', async () => {
  await connectServer()
  await getAvailableRooms()
})
