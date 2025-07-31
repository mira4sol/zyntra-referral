# Zynta Referral System

A modern referral system built with Node.js backend and vanilla JavaScript frontend. Users can register, earn points by referring friends, and view network statistics.

## Features

- User registration with email validation
- Unique 6-digit referral codes
- Points system for successful referrals
- Real-time statistics dashboard
- Responsive design with modern UI
- RESTful API with validation

## Project Structure

```
zynta/
├── backend/
│   ├── controllers/
│   │   └── userController.js
│   ├── models/
│   │   └── User.js
│   ├── middleware.js
│   ├── routes.js
│   ├── index.js
│   └── package.json
├── frontend/
│   ├── assets/
│   │   ├── css/
│   │   │   └── styles.css
│   │   ├── js/
│   │   │   ├── script.js
│   │   │   ├── register.js
│   │   │   └── members.js
│   │   └── logo.svg
│   ├── index.html
│   ├── register.html
│   └── members.html
└── README.md
```

## Prerequisites

- Node.js (v16 or higher)
- npm (comes with Node.js)

## Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:mira4sol/zyntra-referral.git
   cd zynta
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies** (if any)
   ```bash
   cd ../frontend
   # No package.json needed for vanilla JS frontend
   ```

## Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```
   The server will start on `http://localhost:3000`

2. **Access the frontend**
   - Open `http://localhost:3000` in your browser
   - The backend serves the frontend files automatically

## API Endpoints

- `GET /api/users` - Get all users
- `POST /api/register` - Register a new user
- `GET /api/users/:referralCode` - Get user by referral code
- `GET /health` - Health check endpoint

## Usage

1. **Home Page** (`/`)
   - View network statistics
   - Access registration and members pages

2. **Registration** (`/register.html`)
   - Create a new account
   - Enter an optional referral code to earn points for the referrer

3. **Members** (`/members.html`)
   - View all network members
   - See points and referral codes
   - Real-time updates

## Development

- **Backend**: Express.js with ES modules
- **Frontend**: Vanilla JavaScript with modern CSS
- **Database**: In-memory storage (can be extended to use a real database)
- **Validation**: Zod schema validation

## Customization

- Modify `backend/models/User.js` to change the points system
- Update `frontend/assets/css/styles.css` for styling changes
- Add new API endpoints in `backend/controllers/`

## License

ISC License
