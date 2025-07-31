import express from 'express'
import http from 'http'
import { injectMiddleware } from './middleware.js'
import { injectRoutes } from './routes.js'

const app = express()
const PORT = process.env.PORT || 3000

const server = http.createServer(app)

app.get('/health', (req, res) => {
  res.status(200).send('Active!')
})

injectMiddleware(app)
injectRoutes(app)

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
