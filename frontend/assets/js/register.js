const API_BASE_URL = '/api'

const registrationForm = document.getElementById('registrationForm')
const messageContainer = document.getElementById('messageContainer')
const messageContent = document.getElementById('messageContent')

const nameError = document.getElementById('nameError')
const emailError = document.getElementById('emailError')
const referralCodeError = document.getElementById('referralCodeError')

let usersCache = []

document.addEventListener('DOMContentLoaded', () => {
  loadUsers()
  setupEventListeners()
})

function setupEventListeners() {
  registrationForm.addEventListener('submit', handleRegistration)

  const inputs = document.querySelectorAll('input')
  inputs.forEach((input) => {
    input.addEventListener('blur', validateInput)
    input.addEventListener('input', clearValidationError)
  })
}

async function handleRegistration(event) {
  event.preventDefault()

  const formData = new FormData(registrationForm)
  const userData = {
    name: formData.get('name').trim(),
    email: formData.get('email').trim(),
    referralCode: formData.get('referralCode').trim() || undefined,
  }

  const isValid = await validateFormData(userData)
  if (!isValid) {
    return
  }

  const submitButton = event.target.querySelector('button[type="submit"]')
  const originalText = submitButton.textContent

  try {
    submitButton.textContent = 'Registering...'
    submitButton.disabled = true
    hideMessage()

    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })

    const result = await response.json()

    if (result.success) {
      showMessage(
        'success',
        `Welcome ${result.data.name}! Your referral code is: ${result.data.referralCode}. Redirecting to members page...`
      )
      registrationForm.reset()

      setTimeout(() => {
        window.location.href = 'members.html'
      }, 3000)
    } else {
      showMessage('error', result.message || 'Registration failed')
    }
  } catch (error) {
    console.error('Registration error:', error)
    showMessage(
      'error',
      'Network error. Please check if the server is running.'
    )
  } finally {
    submitButton.textContent = originalText
    submitButton.disabled = false
  }
}

async function validateFormData(data) {
  const validationResults = await Promise.all([
    validateNameField(data.name),
    validateEmailField(data.email),
    validateReferralCodeField(data.referralCode || ''),
  ])

  return validationResults.every((result) => result)
}

async function validateInput(event) {
  const input = event.target
  const value = input.value.trim()

  input.classList.remove('error')

  switch (input.name) {
    case 'name':
      await validateNameField(value)
      break
    case 'email':
      await validateEmailField(value)
      break
    case 'referralCode':
      await validateReferralCodeField(value)
      break
  }
}

async function validateNameField(value) {
  if (!value) {
    showFieldError('name', 'Name is required')
    return false
  }
  hideFieldError('name')
  return true
}

async function validateEmailField(value) {
  if (!value) {
    showFieldError('email', 'Email is required')
    return false
  }

  if (!isValidEmail(value)) {
    showFieldError('email', 'Please enter a valid email address')
    return false
  }

  const existingUser = usersCache.find(
    (user) => user.email.toLowerCase() === value.toLowerCase()
  )
  if (existingUser) {
    showFieldError('email', 'This email is already registered')
    return false
  }

  hideFieldError('email')
  return true
}

async function validateReferralCodeField(value) {
  if (!value) {
    hideFieldError('referralCode')
    return true // Optional field
  }

  if (value.length !== 6) {
    showFieldError('referralCode', 'Referral code must be exactly 6 digits')
    return false
  }

  if (!/^\d{6}$/.test(value)) {
    showFieldError('referralCode', 'Referral code must contain only numbers')
    return false
  }

  try {
    const response = await fetch(`${API_BASE_URL}/users/${value}`)
    if (response.ok) {
      const result = await response.json()
      if (result.success) {
        showFieldSuccess('referralCode', `Valid code for ${result.data.name}`)
        return true
      }
    }
    showFieldError('referralCode', 'Invalid referral code')
    return false
  } catch (error) {
    hideFieldError('referralCode')
    return true
  }
}

function clearValidationError(event) {
  const input = event.target
  const fieldName = input.name

  setTimeout(() => {
    if (input.value.trim()) {
      validateInput(event)
    } else {
      hideFieldError(fieldName)
    }
  }, 100)
}

function showFieldError(fieldName, message) {
  const input = document.getElementById(fieldName)
  const errorElement = document.getElementById(`${fieldName}Error`)

  input.classList.add('error')
  errorElement.textContent = message
  errorElement.classList.add('show')
}

function hideFieldError(fieldName) {
  const input = document.getElementById(fieldName)
  const errorElement = document.getElementById(`${fieldName}Error`)

  input.classList.remove('error', 'success')
  errorElement.classList.remove('show', 'success')
}

function showFieldSuccess(fieldName, message) {
  const input = document.getElementById(fieldName)
  const errorElement = document.getElementById(`${fieldName}Error`)

  input.classList.remove('error')
  input.classList.add('success')
  errorElement.textContent = message
  errorElement.classList.add('show', 'success')
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

async function loadUsers() {
  try {
    const response = await fetch(`${API_BASE_URL}/users`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()

    if (result.success) {
      usersCache = result.data
    }
  } catch (error) {
    console.error('Error loading users:', error)
  }
}

function showMessage(type, message) {
  const isSuccess = type === 'success'

  messageContent.className = `message-content ${
    isSuccess ? 'message-success' : 'message-error'
  }`

  messageContent.textContent = message
  messageContainer.classList.add('show')

  if (isSuccess) {
    setTimeout(hideMessage, 5000)
  }
}

function hideMessage() {
  messageContainer.classList.remove('show')
}

// Add keyboard navigation
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    hideMessage()
  }
})
