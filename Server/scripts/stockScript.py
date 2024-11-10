"""
import yfinance as yf
import json
import sys

def fetch_stock_data(symbols):
    stock_data = {}
    for symbol in symbols:
        stock = yf.Ticker(symbol)
        stock_info = stock.history(period="5d")  # Fetch the last 5 days' data
        if not stock_info.empty and len(stock_info) >= 2:
            current_close = stock_info['Close'].iloc[-1]  # Most recent close
            previous_close = stock_info['Close'].iloc[-2]  # Previous day's close
            price_change = current_close - previous_close
            percentage_change = (price_change / previous_close) * 100

            stock_data[symbol] = {
                'price': current_close,
                'change': price_change,
                'percentage_change': percentage_change
            }
        else:
            stock_data[symbol] = {'price': 'N/A', 'change': 'N/A', 'percentage_change': 'N/A'}
    return stock_data

if __name__ == '__main__':
    symbols = sys.argv[1:]  # Get symbols from command-line arguments
    result = fetch_stock_data(symbols)
    print(json.dumps(result))  # Print the result to stdout
"""
import json
import random
import sys

# Define the 10 most common stocks with constant base prices
TOP_10_STOCKS = {
    "AAPL": 150,
    "MSFT": 300,
    "GOOGL": 2800,
    "AMZN": 3400,
    "TSLA": 700,
    "FB": 350,
    "BRK-B": 280,
    "JNJ": 170,
    "V": 230,
    "WMT": 140
}

# Define a list of other common stocks (excluding the top 10)
COMMON_STOCKS = ["PG", "NVDA", "JPM", "UNH", "HD", "DIS", "MA", "PYPL", "INTC", "NFLX",
                 "PFE", "KO", "VZ", "ADBE", "CSCO", "NKE", "PEP", "MRK", "CRM", "ABBV",
                 "XOM", "MCD", "LLY", "BAC", "T", "ABT", "CMCSA", "TM", "TMO", "ORCL",
                 "ACN", "COST", "WFC", "DHR", "TXN", "BMY", "UNP", "LIN", "QCOM", "MDT"]

def simulate_stock_data(symbols):
    stock_data = {}
    for symbol in symbols:
        # Check if the symbol is in the top 10 stocks with constant prices
        if symbol in TOP_10_STOCKS:
            base_price = TOP_10_STOCKS[symbol]
            # Apply a 30% chance to change the price
            if random.random() < 0.3:
                # Apply a random change between -5% and +5%
                change_percentage = random.uniform(-5, 5)
                price_change = base_price * (change_percentage / 100)
                updated_price = base_price + price_change
            else:
                # No change
                updated_price = base_price
                price_change = 0
                change_percentage = 0

        # Check if the symbol is in other common stocks
        elif symbol in COMMON_STOCKS:
            # Generate a random base price between $100 and $1500
            base_price = random.uniform(100, 1500)
            updated_price = base_price
            price_change = 0
            change_percentage = 0

        else:
            # Generate a random price for non-common stocks between $10 and $200
            updated_price = random.uniform(10, 200)
            price_change = 0
            change_percentage = 0

        # Store the data in the dictionary
        stock_data[symbol] = {
            'price': round(updated_price, 2),
            'change': round(price_change, 2),
            'percentage_change': round(change_percentage, 2)
        }

    return stock_data

if __name__ == '__main__':
    symbols = sys.argv[1:]  # Get symbols from command-line arguments
    result = simulate_stock_data(symbols)
    print(json.dumps(result))  # Print the result to stdout
