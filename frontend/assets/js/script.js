const API_BASE_URL = '/api'

const totalUsersElement = document.getElementById('totalUsers')
const totalPointsElement = document.getElementById('totalPoints')
const totalReferralsElement = document.getElementById('totalReferrals')

document.addEventListener('DOMContentLoaded', () => {
  loadStats()
})

async function loadStats() {
  try {
    const response = await fetch(`${API_BASE_URL}/users`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()

    if (result.success) {
      updateStats(result.data)
    }
  } catch (error) {
    console.error('Error loading stats:', error)
  }
}

function updateStats(users) {
  const totalUsers = users.length
  const totalPoints = users.reduce((sum, user) => sum + user.points, 0)
  const totalReferrals = users.filter((user) => user.points > 0).length

  animateNumber(totalUsersElement, totalUsers)
  animateNumber(totalPointsElement, totalPoints)
  animateNumber(totalReferralsElement, totalReferrals)
}

function animateNumber(element, targetValue) {
  const currentValue = parseInt(element.textContent) || 0
  const increment = Math.ceil(Math.abs(targetValue - currentValue) / 20)

  const timer = setInterval(() => {
    const current = parseInt(element.textContent) || 0

    if (current === targetValue) {
      clearInterval(timer)
      return
    }

    if (current < targetValue) {
      element.textContent = Math.min(current + increment, targetValue)
    } else {
      element.textContent = Math.max(current - increment, targetValue)
    }
  }, 50)
}
