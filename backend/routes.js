import express from 'express'
import { userController } from './controllers/userController.js'

export const injectRoutes = (app) => {
  app.get('/api/users', userController.getAllUsers)
  app.post('/api/register', userController.registerUser)
  app.get('/api/users/:referralCode', userController.getUserByReferralCode)
}
