# PORTFOLIWISE

A comprehensive web application for managing multiple trading portfolios across different platforms, providing automated tax calculations and AI-driven trading recommendations.

## Features

### Home Screen
- **Balance Graph**: Interactive line chart showing performance across all portfolios
  - Time filters: week, month, year, and all (5 years)
- **Watchlist**: Customizable list of tracked symbols with real-time price updates
- **Marketplace**: Fixed list of popular symbols (Apple, S&P 500, NASDAQ, etc.) with real-time price updates
- **Featured Portfolio Display**: 
  - Shows holdings with key statistics and real-time price updates
  - Interactive donut chart for portfolio visualization
  - Configurable display options

### Login Screen
- Email/password authentication
- Google OAuth integration
- New user registration

### Portfolios Screen
- Multiple portfolio management
- Portfolio connection via API integration
- ML-powered price analysis for trading recommendations
- Portfolio deletion capability
- Set portfolio for Home Screen display

### Tax Screen
- Portfolio-specific profit tracking
- Automated annual tax calculation
- Detailed tax liability breakdown

### Settings Screen
- Profile management (nickname, full name)
- Password updates

## Technical Stack

### Frontend
- React.js

### Backend
- Node.js
- Python scripts for ML integration
- MongoDB Atlas (Cloud Database)

### Authentication
- Local authentication
- Google OAuth integration

## Prerequisites

### Node.js
- Latest stable version recommended

### Python
- Python 3.x required
- Required Python packages:
```
pandas
numpy
yfinance
scikit-learn
xgboost
ta
```

### Database
- MongoDB Atlas account

### API Keys
- Alpaca trading account with API credentials

## Installation

1. Clone the repository:
```bash
git clone git@github.com:guyreuveni33/final_project.git
```

2. Install dependencies for server:
```bash
cd server
npm install
```

3. Install dependencies for client:
```bash
cd ../react
npm install
```

4. Install Python dependencies:
```bash
pip install pandas numpy yfinance scikit-learn xgboost ta
```

5. Set up environment variables:
Edit `.env` with your:
- MongoDB connection string

## Running the Application

1. Start the server:
```bash
cd server
npm start
```

2. In a new terminal, start the React client:
```bash
cd react
npm start
```

## Configuration

### Portfolio Integration
Currently supports:
- Alpaca Trading API
- More platforms planned for future integration

### API Keys Setup
1. Obtain API credentials from Alpaca
2. Add them to your portfolio settings in the application
3. Application automatically syncs with your trading account

## Usage

1. Sign up/Login (email or Google) through the login screen
2. Add trading portfolios using API credentials
3. Customize your watchlist with preferred symbols
4. Monitor real-time updates in the marketplace, watchlist, and home screen portfolio
5. Set up preferred portfolio for home screen display
6. Use tax calculator for annual tax liability assessment

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## Acknowledgments

- Alpaca Trading API
- yfinance library
