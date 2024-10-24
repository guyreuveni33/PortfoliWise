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
