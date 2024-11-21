import yfinance as yf
import json
import sys

def clean_symbol(symbol):
    return symbol.replace('$', '')

def fetch_stock_data(symbols):
    stock_data = {}

    for symbol in symbols:
        try:
            clean_sym = clean_symbol(symbol)
            stock = yf.Ticker(clean_sym)

            try:
                stock_info = stock.history(period="5d")

                if not stock_info.empty and len(stock_info) >= 2:
                    current_close = float(stock_info['Close'].iloc[-1])
                    previous_close = float(stock_info['Close'].iloc[-2])

                    price_change = current_close - previous_close
                    percentage_change = (price_change / previous_close) * 100

                    stock_data[symbol] = {
                        'price': round(current_close, 2),
                        'change': round(price_change, 2),
                        'percentage_change': round(percentage_change, 2)
                    }
                else:
                    print(f"Warning: Insufficient data for {symbol}", file=sys.stderr)
                    stock_data[symbol] = {
                        'price': 'N/A',
                        'change': 'N/A',
                        'percentage_change': 'N/A'
                    }

            except Exception as e:
                print(f"Error fetching data for {symbol}: {str(e)}", file=sys.stderr)
                stock_data[symbol] = {
                    'price': 'N/A',
                    'change': 'N/A',
                    'percentage_change': 'N/A'
                }

        except Exception as e:
            print(f"Error processing {symbol}: {str(e)}", file=sys.stderr)
            stock_data[symbol] = {
                'price': 'N/A',
                'change': 'N/A',
                'percentage_change': 'N/A'
            }

    return stock_data

if __name__ == '__main__':
    try:
        symbols = sys.argv[1:]
        if not symbols:
            print("No symbols provided", file=sys.stderr)
            sys.exit(1)

        result = fetch_stock_data(symbols)
        print(json.dumps(result))

    except Exception as e:
        print(f"Fatal error: {str(e)}", file=sys.stderr)
        sys.exit(1)