const ColyseusClient = require('colyseus.js')
const ip = require('ip')
let client

async function joinRoom(id, ip) {
  console.log(id + ' at ' + ip);
  
}

async function findRooms() {
  document.querySelector('#roomList').innerHTML = ""
  const isPortReachable = require('is-port-reachable')
  const arp = require('@network-utils/arp-lookup')
  const network = await arp.getTable()
  
  // const LANScanner = require('lanscanner')
  // let network = await LANScanner.scan()
  console.log(network)
  networkIPs = network.map(device => device.ip)
  networkIPs.push(ip.address())
  networkIPs.sort()
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
            rooms.forEach((room) => {
              console.log(room.roomId);
              console.log(room.clients);
              console.log(room.maxClients);
              console.log(room.metadata);
              appendNewRoom(room.roomId, deviceIP)
            });
          })
          .catch(err => {
            console.error(err)
          })
      } catch (err) {
        console.error(err)
      }
    } else {
    }

  }
}
  
const list = document.querySelector('#roomList')
function appendNewRoom(id, ip){
  const li = document.createElement('li')
  li.setAttribute("data-ip", ip);
  li.setAttribute("data-id", id);
  li.innerHTML = '<button class="roomEntry" type="button" data-ip="'+ ip +'" data-id="'+ id +'" disabled>' + ip + ' - ' + id + '</button>'
  list.appendChild(li)
}

document.querySelector('#findRooms').addEventListener('click', async (e) => {
  // <i class="fas fa-quidditch fa-sm fa-spin"></i>
  e.target.disabled = true
  e.target.getElementsByTagName("I")[0].classList.remove('fa-search')
  e.target.getElementsByTagName("I")[0].classList.add('fa-spinner')
  e.target.getElementsByTagName("I")[0].classList.add('fa-spin')
  await findRooms()
  e.target.getElementsByTagName("I")[0].classList.remove('fa-spin')
  e.target.getElementsByTagName("I")[0].classList.remove('fa-spinner')
  e.target.getElementsByTagName("I")[0].classList.add('fa-search')
  e.target.disabled = false
  tmp()
})
function tmp() {
  document.querySelector('.roomEntry').disabled = false
  document.querySelector('.roomEntry').addEventListener('click', (e) => {
    joinRoom(e.target.attributes['data-id'].value, e.target.attributes['data-ip'].value)
  })
}
