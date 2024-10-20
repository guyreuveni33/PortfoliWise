import yfinance as yf
import json
import sys

def fetch_stock_data(symbols):
    stock_data = {}
    for symbol in symbols:
        stock = yf.Ticker(symbol)
        stock_info = stock.history(period="1d")
        if not stock_info.empty:
            stock_data[symbol] = {
                'price': stock_info['Close'].iloc[0],
                'change': stock_info['Close'].iloc[0] - stock_info['Open'].iloc[0],
                'percentage_change': ((stock_info['Close'].iloc[0] - stock_info['Open'].iloc[0]) / stock_info['Open'].iloc[0]) * 100
            }
        else:
            stock_data[symbol] = {'price': 'N/A', 'change': 'N/A', 'percentage_change': 'N/A'}
    return stock_data

if __name__ == '__main__':
    symbols = sys.argv[1:]  # Get symbols from command-line arguments
    result = fetch_stock_data(symbols)
    print(json.dumps(result))  # Print the result to stdout
