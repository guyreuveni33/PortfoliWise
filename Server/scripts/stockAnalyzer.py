import json  # Import json module for JSON serialization
import yfinance as yf
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
import tensorflow as tf

class StockPredictor:
    def __init__(self):
        self.model = None
        #this take the min and max price and normalize it to 0 and 1
        self.scaler = MinMaxScaler(feature_range=(0, 1))

    def prepare_data(self, data, look_back=30):
    #reshape the data to 2D array instead of 1D array for example [1,2,3,4,5] to [[1],[2],[3],[4],[5]]. -1 is a placeholder for the number of rows
    #and 1 is the number of columns
        scaled_data = self.scaler.fit_transform(data['Close'].values.reshape(-1, 1))
        X, y = [], []
        for i in range(look_back, len(scaled_data)):
            X.append(scaled_data[i - look_back:i, 0])
            y.append(scaled_data[i, 0])
        return np.array(X), np.array(y)

    def build_model(self, look_back):
        from tensorflow.keras.layers import Input

        model = Sequential([
            Input(shape=(look_back, 1)),  # Define input layer
            LSTM(32, return_sequences=False),
            Dense(1)
        ])
        model.compile(optimizer='adam', loss='mse')
        return model

    def get_recommendation(self, symbol):
        try:
            # Get only 6 months of data instead of 2 years
            stock_data = yf.download(symbol, period='6mo', progress=False)

            if len(stock_data) < 50:
                raise ValueError("Insufficient data")

            look_back = 30  # Reduced lookback period
            X, y = self.prepare_data(stock_data, look_back)
            X = np.reshape(X, (X.shape[0], X.shape[1], 1))

            # Build and train model with fewer epochs
            self.model = self.build_model(look_back)
            self.model.fit(X, y, epochs=20, batch_size=32, verbose=0)

            # Make prediction
            recent_data = stock_data['Close'].values[-30:]
            scaled_recent_data = self.scaler.transform(recent_data.reshape(-1, 1))
            X_recent = np.array([scaled_recent_data])
            X_recent = np.reshape(X_recent, (X_recent.shape[0], X_recent.shape[1], 1))

            predicted_scaled = self.model.predict(X_recent, verbose=0)
            predicted_price = float(self.scaler.inverse_transform(predicted_scaled)[0][0])  # Convert to float
            current_price = float(stock_data['Close'].iloc[-1])  # Convert to float

            # Quick calculation of basic trend indicator
            short_ma = float(stock_data['Close'].rolling(window=5).mean().iloc[-1])
            long_ma = float(stock_data['Close'].rolling(window=20).mean().iloc[-1])
            trend = "Upward" if short_ma > long_ma else "Downward"

            # Calculate recommendation
            price_change_pct = ((predicted_price - current_price) / current_price) * 100

            if price_change_pct >= 5:
                recommendation = "STRONG BUY"
            elif 2 <= price_change_pct < 5:
                recommendation = "BUY"
            elif -2 < price_change_pct < 2:
                recommendation = "HOLD"
            elif -5 < price_change_pct <= -2:
                recommendation = "SELL"
            else:
                recommendation = "STRONG SELL"

            return {
                'symbol': symbol,
                'current_price': round(current_price, 2),
                'predicted_price': round(predicted_price, 2),
                'change_pct': round(price_change_pct, 2),
                'recommendation': recommendation,
                'trend': trend
            }

        except Exception as e:
            return {"error": f"Error analyzing {symbol}: {str(e)}"}

def get_stock_recommendation(symbol):
    predictor = StockPredictor()
    return predictor.get_recommendation(symbol)

if __name__ == "__main__":
    import sys
    symbol = sys.argv[1] if len(sys.argv) > 1 else "AAPL"
    recommendation = get_stock_recommendation(symbol)

    # Output JSON only
    print(json.dumps(recommendation))
