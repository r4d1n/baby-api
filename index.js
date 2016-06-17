'use strict'

const fs = require('fs')
const path = require('path')
const http = require('http')

const ruta3 = require('ruta3')
const router = ruta3()

const PORT = 8080

router.addRoute('/data', (req, res) => {
  res.writeHead(200, {'Content-Type': 'text/json'})
  readStatic('data.json').pipe(res)
})

// create http server
const server = http.createServer((req, res) => {
  let match = router.match(req.url)
  if (match) { // route exists
    try {
      match.action(req, res)
    } catch (e) { // something went wrong
      res.writeHead(500, {'Content-Type': 'text/plain'})
      res.end('500 Internal Server Error')
    }
  } else { // route not found
    res.writeHead(404, {'Content-Type': 'text/plain'})
    res.end('404 Not Found')
  }
})

// generic error handling
server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
})

server.listen(PORT)

function readStatic (file) {
  return fs.createReadStream(path.join(__dirname, 'static', file))
}
