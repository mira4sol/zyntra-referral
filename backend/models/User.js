class User {
  constructor(id, name, email, referralCode, points = 0) {
    this.id = id
    this.name = name
    this.email = email
    this.referralCode = referralCode
    this.points = points
  }
}

class UserStore {
  constructor() {
    this.users = []
    this.nextId = 1
    this.initializeSampleUsers()
  }

  initializeSampleUsers() {
    this.users = [
      new User(
        1,
        'John Doe',
        'john@example.com',
        this.generateReferralCode(),
        20
      ),
      new User(
        2,
        'Jane Smith',
        'jane@example.com',
        this.generateReferralCode(),
        0
      ),
      new User(
        3,
        'Alice Johnson',
        'alice@example.com',
        this.generateReferralCode(),
        0
      ),
    ]
    this.nextId = 4
  }

  generateReferralCode() {
    let code
    do {
      code = Math.floor(100000 + Math.random() * 900000).toString()
    } while (this.findByReferralCode(code))
    return code
  }

  findByReferralCode(referralCode) {
    return this.users.find((user) => user.referralCode === referralCode)
  }

  findByEmail(email) {
    return this.users.find((user) => user.email === email)
  }

  getAllUsers() {
    return [...this.users].sort((a, b) => {
      if (b.points !== a.points) {
        return b.points - a.points
      }
      return a.name.localeCompare(b.name)
    })
  }

  createUser(name, email, referralCode = null) {
    if (this.findByEmail(email)) {
      throw new Error('Email already exists')
    }

    const newReferralCode = this.generateReferralCode()
    const newUser = new User(this.nextId++, name, email, newReferralCode, 0)

    if (referralCode) {
      const referrer = this.findByReferralCode(referralCode)
      if (referrer) {
        referrer.points += 10
      } else {
        throw new Error('Invalid referral code')
      }
    }

    this.users.push(newUser)
    return newUser
  }
}

export const userStore = new UserStore()
export { User }
