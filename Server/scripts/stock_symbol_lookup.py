import yfinance as yf
import pandas as pd
import os
import sys
import json
from typing import List, Dict

class StockSymbolSearch:
    def __init__(self, symbols_file='symbols.csv'):
        self.symbols_file = symbols_file

        if os.path.exists(self.symbols_file):
            # Load symbols from file if it exists
            self.symbols_df = pd.read_csv(self.symbols_file)
        else:
            # Download symbols from the NASDAQ site
            self.symbols_df = self._download_symbols()
            # Save the downloaded symbols to a file for future use
            self.symbols_df.to_csv(self.symbols_file, index=False)

    def _download_symbols(self) -> pd.DataFrame:
        """Fetches symbols from NASDAQ and prepares the DataFrame."""
        try:
            # Download NASDAQ symbols list
            symbols_df = pd.read_csv(
                'https://www.nasdaqtrader.com/dynamic/SymDir/nasdaqtraded.txt',
                sep='|',
                dtype={'Symbol': str, 'Security Name': str}
            )

            # Clean and prepare the data
            symbols_df = symbols_df[symbols_df['Test Issue'] == 'N']  # Remove test issues
            symbols_df = symbols_df[['Symbol', 'Security Name']]
            symbols_df.columns = ['symbol', 'name']

            # Remove any rows with NaN values
            symbols_df = symbols_df.dropna()

            # Ensure symbols are strings and uppercase
            symbols_df['symbol'] = symbols_df['symbol'].str.strip().str.upper()

            # Remove any empty symbols
            symbols_df = symbols_df[symbols_df['symbol'].str.len() > 0]

            return symbols_df

        except Exception as e:
            print(f"Error downloading symbols: {str(e)}")
            # Return an empty DataFrame as a fallback
            return pd.DataFrame(columns=['symbol', 'name'])

    def search_symbols(self, prefix: str, limit: int = 10) -> List[Dict[str, str]]:
        """Searches for symbols starting with the provided prefix."""
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
