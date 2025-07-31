import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'

export const injectMiddleware = (app) => {
  app.use(express.json())
  app.use(helmet())
  app.use(
    morgan(
      '[:date[clf]] - :method :url :status :res[content-length] - :response-time ms'
    )
  )

  app.use('/', express.static('../frontend'))

  const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Forwarded-Proto',
      'X-Requested-With',
      'Accept',
    ],
    credentials: true,
    maxAge: 86400,
  }
  app.use(cors(corsOptions))
}
