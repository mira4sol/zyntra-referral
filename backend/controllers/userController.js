import { z } from 'zod'
import { userStore } from '../models/User.js'

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  email: z.string().email('Invalid email format').min(1, 'Email is required'),
  referralCode: z.string().optional(),
})

export const userController = {
  getAllUsers: (req, res) => {
    try {
      const users = userStore.getAllUsers()
      res.json({
        success: true,
        data: users,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      })
    }
  },

  registerUser: (req, res) => {
    try {
      const validation = registerSchema.safeParse(req.body)

      if (!validation.success) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validation.error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        })
      }

      const { name, email, referralCode } = validation.data

      const newUser = userStore.createUser(name, email, referralCode)

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: newUser,
      })
    } catch (error) {
      if (error.message === 'Email already exists') {
        return res.status(400).json({
          success: false,
          message: 'Email already exists',
        })
      }

      if (error.message === 'Invalid referral code') {
        return res.status(400).json({
          success: false,
          message: 'Invalid referral code',
        })
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      })
    }
  },

  getUserByReferralCode: (req, res) => {
    try {
      const { referralCode } = req.params

      if (!referralCode) {
        return res.status(400).json({
          success: false,
          message: 'Referral code is required',
        })
      }

      const user = userStore.findByReferralCode(referralCode)

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        })
      }

      res.json({
        success: true,
        data: user,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      })
    }
  },
}
