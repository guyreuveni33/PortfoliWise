import pandas as pd
import os
import sys
import json
from typing import List, Dict


class StockSymbolSearch:
    def __init__(self, symbols_file='symbols.csv'):
        self.symbols_file = symbols_file

        if os.path.exists(self.symbols_file):
            self.symbols_df = pd.read_csv(self.symbols_file)
        else:
            self.symbols_df = self._download_symbols()
            self.symbols_df.to_csv(self.symbols_file, index=False)

    def _download_symbols(self) -> pd.DataFrame:
        try:
            symbols_df = pd.read_csv(
                'https://www.nasdaqtrader.com/dynamic/SymDir/nasdaqtraded.txt',
                sep='|',
                dtype={'Symbol': str, 'Security Name': str}
            )

            # Clean the data
            symbols_df = symbols_df[symbols_df['Test Issue'] == 'N']  # Remove test issues
            symbols_df = symbols_df[['Symbol', 'Security Name']]
            symbols_df.columns = ['symbol', 'name']

            # Remove NaN rows
            symbols_df = symbols_df.dropna()

            return symbols_df

        except Exception as e:
            print(f"Error downloading symbols: {str(e)}")
            return pd.DataFrame(columns=['symbol', 'name'])

    def search_symbols(self, prefix: str, limit: int = 10) -> List[Dict[str, str]]:
        """Searches for symbols starting with the provided prefix."""
        try:
            prefix = prefix.strip().upper()
            if not prefix:
                return []

            mask = self.symbols_df['symbol'].str.startswith(prefix, na=False)
            matches = self.symbols_df[mask].head(limit)

            # Convert to list of dictionaries
            return matches.to_dict('records')

        except Exception as e:
            print(f"Error searching symbols: {str(e)}")
            return []


if __name__ == "__main__":
    prefix = sys.argv[1] if len(sys.argv) > 1 else ''
    limit = int(sys.argv[2]) if len(sys.argv) > 2 else 5

    search_engine = StockSymbolSearch()
    results = search_engine.search_symbols(prefix, limit)

    print(json.dumps(results))
