const ColyseusClient = require('colyseus.js')
const ip = require('ip')
let client

async function joinRoom() {}

async function findRooms() {
  const isPortReachable = require('is-port-reachable')

  const LANScanner = require('lanscanner')
  let network = await LANScanner.scan()
  console.log(network)
  networkIPs = network.map(device => device.ip)
  networkIPs.push(ip.address())
  console.log(networkIPs)

  for (const deviceIP of networkIPs) {
    console.log(deviceIP)
    const wsPing = await isPortReachable(2567, { host: deviceIP })
    console.log(wsPing)

    if (wsPing === true) {
      try {
        const connection = new ColyseusClient.Client(`ws://${deviceIP}:2567`)
        connection
          .getAvailableRooms('battle')
          .then(rooms => {
            console.log(rooms)
          })
          .catch(err => {
            console.error(err)
          })
      } catch (err) {
        console.error(err)
      }
    } else {
    }

    // const connection = new ColyseusClient.Client(`ws://${deviceIP}:2567`)

    // connection.getAvailableRooms('battle').then(rooms => {
    //   console.log(rooms)
    // }).catch(err => {
    //   // console.log(err)
    // })
  }
  // for (const ipAddress of networkIPs) {
  //   console.log(ipAddress)
  //   client = new ColyseusClient.Client(`ws://${ipAddress}:2567`)
  //   let rooms = await client.getAvailableRooms('battle')
  //   console.log(rooms)

  //   // rooms.forEach(room => {
  //   //   console.log(room.roomId)
  //   //   console.log(room.clients)
  //   //   console.log(room.maxClients)
  //   //   console.log(room.metadata)
  //   //   li += '<li>' + ipAddress + ' - ' + room.roomId + '</li>'
  //   // })
  // }
  // document.querySelector('#roomList').innerHTML = li
}

document.querySelector('#findRooms').addEventListener('click', async () => {
  await findRooms()
})
