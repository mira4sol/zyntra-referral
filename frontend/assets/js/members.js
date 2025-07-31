const API_BASE_URL = '/api'

const usersContainer = document.getElementById('usersContainer')
const totalUsersElement = document.getElementById('totalUsers')
const totalPointsElement = document.getElementById('totalPoints')
const totalReferralsElement = document.getElementById('totalReferrals')
const refreshBtn = document.getElementById('refreshBtn')

document.addEventListener('DOMContentLoaded', () => {
  loadUsers()
  setupEventListeners()
})

function setupEventListeners() {
  refreshBtn.addEventListener('click', () => {
    refreshBtn.textContent = 'Refreshing...'
    refreshBtn.disabled = true
    loadUsers().finally(() => {
      refreshBtn.textContent = 'Refresh'
      refreshBtn.disabled = false
    })
  })
}

async function loadUsers() {
  try {
    showLoadingState()

    const response = await fetch(`${API_BASE_URL}/users`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()

    if (result.success) {
      displayUsers(result.data)
      updateStats(result.data)
    } else {
      throw new Error(result.message || 'Failed to load users')
    }
  } catch (error) {
    console.error('Error loading users:', error)
    showUsersError(
      'Failed to load users. Please check if the server is running.'
    )
  }
}

function displayUsers(users) {
  if (!users || users.length === 0) {
    usersContainer.innerHTML = `
      <div class="loading">
        No members yet. <a href="register.html" class="text-link">Be the first to join!</a>
      </div>
    `
    return
  }

  usersContainer.innerHTML = users
    .map(
      (user, index) => `
    <div class="user-card">
      <div class="user-info">
        <div class="user-rank">#${index + 1}</div>
        <div class="user-details">
          <h4>${escapeHtml(user.name)}</h4>
          <p class="email">${escapeHtml(user.email)}</p>
          <p class="code">Code: ${user.referralCode}</p>
        </div>
        <div class="user-points">
          <div class="points">${user.points}</div>
          <div class="label">points</div>
        </div>
      </div>
    </div>
  `
    )
    .join('')
}

function updateStats(users) {
  const totalUsers = users.length
  const totalPoints = users.reduce((sum, user) => sum + user.points, 0)
  const totalReferrals = users.filter((user) => user.points > 0).length

  animateNumber(totalUsersElement, totalUsers)
  animateNumber(totalPointsElement, totalPoints)
  animateNumber(totalReferralsElement, totalReferrals)
}

// Animate number changes
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

function showLoadingState() {
  usersContainer.innerHTML = `
    <div class="loading">
      <div class="loading-spinner"></div>
      Loading members...
    </div>
  `
}

function showUsersError(message) {
  usersContainer.innerHTML = `
    <div class="error-state">
      <div class="error-icon">⚠️</div>
      <p>${escapeHtml(message)}</p>
      <button onclick="loadUsers()" class="btn-secondary" style="margin-top: 1rem;">
        Retry
      </button>
    </div>
  `
}

function escapeHtml(text) {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

setInterval(() => {
  if (document.visibilityState === 'visible') {
    loadUsers()
  }
}, 30000)
