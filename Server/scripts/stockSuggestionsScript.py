import yfinance as yf
import pandas as pd
import sys
import json
from typing import List, Dict

class StockSymbolSearch:
    def __init__(self):
        try:
            # Download NASDAQ symbols list
            self.symbols_df = pd.read_csv('https://www.nasdaqtrader.com/dynamic/SymDir/nasdaqtraded.txt',
                                        sep='|',
                                        dtype={'Symbol': str, 'Security Name': str})

            # Clean and prepare the data
            self.symbols_df = self.symbols_df[self.symbols_df['Test Issue'] == 'N']  # Remove test issues
            self.symbols_df = self.symbols_df[['Symbol', 'Security Name']]
            self.symbols_df.columns = ['symbol', 'name']

            # Remove any rows with NaN values
            self.symbols_df = self.symbols_df.dropna()

            # Ensure symbols are strings and uppercase
            self.symbols_df['symbol'] = self.symbols_df['symbol'].str.strip().str.upper()

            # Remove any empty symbols
            self.symbols_df = self.symbols_df[self.symbols_df['symbol'].str.len() > 0]

        except Exception as e:
            print(f"Error initializing symbol database: {str(e)}")
            # Create empty DataFrame as fallback
            self.symbols_df = pd.DataFrame(columns=['symbol', 'name'])

    def search_symbols(self, prefix: str, limit: int = 10) -> List[Dict[str, str]]:
        try:
            prefix = prefix.strip().upper()
            if not prefix:
                return []

            # Filter symbols that start with the prefix
            mask = self.symbols_df['symbol'].str.startswith(prefix, na=False)
            matches = self.symbols_df[mask].head(limit)

            # Convert to list of dictionaries
            return matches.to_dict('records')

        except Exception as e:
            print(f"Error searching symbols: {str(e)}")
            return []

# Main function for CLI access
if __name__ == "__main__":
    prefix = sys.argv[1] if len(sys.argv) > 1 else ''
    limit = int(sys.argv[2]) if len(sys.argv) > 2 else 5

    search_engine = StockSymbolSearch()
    results = search_engine.search_symbols(prefix, limit)

    # Output the result as JSON
    print(json.dumps(results))
