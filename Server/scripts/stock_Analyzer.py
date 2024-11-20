import argparse
import numpy as np
import pandas as pd
import yfinance as yf
from sklearn.model_selection import TimeSeriesSplit, GridSearchCV
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import xgboost as xgb
import warnings
import json
import os
from datetime import datetime

warnings.filterwarnings('ignore')

CACHE_FILE = "stock_cache.json"

def fetch_stock_data(symbol):
    """
    Fetches historical stock data for a given symbol using yfinance.
    """
    end_date = datetime.now().strftime('%Y-%m-%d')
    stock_data = yf.download(symbol, start="2015-01-01", end=end_date)
    if stock_data.empty:
        raise ValueError("No data fetched. Check the stock symbol.")
    return stock_data

def feature_engineering(data):
    """
    Adds technical indicators to the dataset as features.
    """
    # Short-term trend (9-day EMA).
    data['EMA_9'] = data['Close'].ewm(span=9, adjust=False).mean()
    # Moving averages
    data['SMA_5'] = data['Close'].rolling(window=5).mean()
    data['SMA_15'] = data['Close'].rolling(window=15).mean()
    data['SMA_30'] = data['Close'].rolling(window=30).mean()
    # Overbuy or oversold
    data['RSI'] = compute_rsi(data['Close'])
    # Trend momentum (MACD).
    data['MACD'] = data['Close'].ewm(span=12, adjust=False).mean() - data['Close'].ewm(span=26, adjust=False).mean()
    data['MACD_SIGNAL'] = data['MACD'].ewm(span=9, adjust=False).mean()

    # Bollinger Bands
    window = 20  # Typical period for Bollinger Bands
    data['BB_MIDDLE'] = data['Close'].rolling(window=window).mean()  # Middle Band (SMA)
    data['BB_STD'] = data['Close'].rolling(window=window).std()  # Standard Deviation
    data['BB_UPPER'] = data['BB_MIDDLE'] + (2 * data['BB_STD'])  # Upper Band
    data['BB_LOWER'] = data['BB_MIDDLE'] - (2 * data['BB_STD'])  # Lower Band

    # Remove rows with NaN values
    data.dropna(inplace=True)
    data.reset_index(drop=True, inplace=True)

    if data.empty:
        raise ValueError("Data became empty after preprocessing. Check stock symbol or data validity.")
    return data

def compute_rsi(series, period=14):
    """
    Computes the Relative Strength Index (RSI).
    """
    delta = series.diff()
    gain = delta.clip(lower=0)
    loss = -delta.clip(upper=0)

    avg_gain = gain.rolling(window=period, min_periods=period).mean()
    avg_loss = loss.rolling(window=period, min_periods=period).mean()

    rs = avg_gain / avg_loss
    rsi = 100 - (100 / (1 + rs))

    rsi.fillna(0, inplace=True)
    return rsi

def train_model(data):
    """
    Trains an XGBoost model on the prepared data using TimeSeriesSplit.
    """
    X = data[['EMA_9', 'SMA_5', 'SMA_15', 'SMA_30', 'RSI', 'MACD', 'MACD_SIGNAL',
                  'BB_MIDDLE', 'BB_UPPER', 'BB_LOWER']]
    y = data['Close']
    # we split the data in 5 combinations
    tscv = TimeSeriesSplit(n_splits=5)
    # we are using the regressor class, which is the best for regression problems
    xgb_model = xgb.XGBRegressor(objective='reg:squarederror', random_state=42)
    # the grid is wokring on all the possible combination of the parameters
    param_grid = {
        'n_estimators': [100, 200],
        'max_depth': [3, 5],
        'learning_rate': [0.01, 0.05],
        'gamma': [0, 0.1], # the gamma parameter is used to decide if a new split is needed, in case of improving the performance
    }
    grid_search = GridSearchCV(estimator=xgb_model, param_grid=param_grid, cv=tscv, scoring='neg_mean_squared_error',
                               verbose=0)
    grid_search.fit(X, y)

    best_model = grid_search.best_estimator_
    return best_model

def predict_next_day(model, last_row):
    """
    Predicts the stock price for the next day based on the last row of features.
    """
    features = last_row[['EMA_9', 'SMA_5', 'SMA_15', 'SMA_30', 'RSI', 'MACD', 'MACD_SIGNAL',
                         'BB_MIDDLE', 'BB_UPPER', 'BB_LOWER']].values.reshape(1, -1)
    prediction = model.predict(features)
    return float(prediction[0])  # Ensure the output is a Python-native float

def get_recommendation(predicted_price, last_close_price):
    """
    Provides a recommendation based on the predicted and last close price.
    """
    change_percent = ((predicted_price - last_close_price) / last_close_price) * 100
    if change_percent > 5:
        return "Strong Buy"
    elif 2 < change_percent <= 5:
        return "Buy"
    elif -2 <= change_percent <= 2:
        return "Hold"
    elif -5 <= change_percent < -2:
        return "Sell"
    else:
        return "Strong Sell"

def read_cache(symbol):
    """
    Reads the cache file and retrieves data if available and up-to-date.
    """
    if not os.path.exists(CACHE_FILE):
        return None

    with open(CACHE_FILE, 'r') as file:
        cache = json.load(file)

    today = datetime.now().strftime("%Y-%m-%d")
    if symbol in cache and cache[symbol]['date'] == today:
        return cache[symbol]
    return None

def write_cache(symbol, data):
    """
    Writes the data to the cache file.
    """
    if os.path.exists(CACHE_FILE):
        with open(CACHE_FILE, 'r') as file:
            cache = json.load(file)
    else:
        cache = {}

    cache[symbol] = data

    with open(CACHE_FILE, 'w') as file:
        json.dump(cache, file, indent=4)

def main():
    import sys

    stock_symbol = sys.argv[1] if len(sys.argv) > 1 else "AAPL"

    # Check cache
    cached_result = read_cache(stock_symbol)
    if cached_result:
        print(json.dumps(cached_result, indent=4))
        return

    # Process stock data and make predictions
    data = fetch_stock_data(stock_symbol)
    data = feature_engineering(data)
    model = train_model(data)
    last_row = data.iloc[-1]
    predicted_price = predict_next_day(model, last_row)
    change_pct = ((predicted_price - last_row['Close']) / last_row['Close']) * 100
    recommendation = get_recommendation(predicted_price, last_row['Close'])

    output = {
        "symbol": stock_symbol,
        "current_price": round(float(last_row['Close']), 2),
        "predicted_price": round(predicted_price, 2),
        "change_pct": round(change_pct, 2),
        "recommendation": recommendation,
        "date": datetime.now().strftime("%Y-%m-%d")
    }

    # Save to cache
    write_cache(stock_symbol, output)

    print(json.dumps(output, indent=4))  # JSON output

if __name__ == "__main__":
    main()
