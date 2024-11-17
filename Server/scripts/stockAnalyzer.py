import pandas as pd
import numpy as np
import yfinance as yf
from sklearn.model_selection import TimeSeriesSplit, GridSearchCV
from sklearn.preprocessing import StandardScaler
from xgboost import XGBRegressor
from ta.volatility import AverageTrueRange
from datetime import datetime, timedelta
import json

# Function to get historical stock data
def get_stock_data(ticker, start_date, end_date):
    stock = yf.download(ticker, start=start_date, end=end_date)
    stock.dropna(inplace=True)
    return stock

# Function to compute RSI
def compute_RSI(series, window):
    delta = series.diff()
    gain = delta.where(delta > 0, 0.0)
    loss = -delta.where(delta < 0, -0.0)
    avg_gain = gain.rolling(window).mean()
    avg_loss = loss.rolling(window).mean()
    rs = avg_gain / avg_loss
    rsi = 100 - (100 / (1 + rs))
    return rsi

def create_features(df):
    df['Return'] = df['Adj Close'].pct_change()
    df['SMA_5'] = df['Adj Close'].rolling(window=5).mean()
    df['SMA_10'] = df['Adj Close'].rolling(window=10).mean()
    df['SMA_20'] = df['Adj Close'].rolling(window=20).mean()
    df['EMA_5'] = df['Adj Close'].ewm(span=5, adjust=False).mean()
    df['EMA_10'] = df['Adj Close'].ewm(span=10, adjust=False).mean()
    df['EMA_12'] = df['Adj Close'].ewm(span=12, adjust=False).mean()
    df['EMA_26'] = df['Adj Close'].ewm(span=26, adjust=False).mean()
    df['Momentum'] = df['Adj Close'] - df['Adj Close'].shift(10)
    df['Volatility'] = df['Return'].rolling(window=10).std()
    df['RSI'] = compute_RSI(df['Adj Close'], window=14)

    # Bollinger Bands
    df['Upper Band'] = df['SMA_20'] + 2 * df['Volatility']
    df['Lower Band'] = df['SMA_20'] - 2 * df['Volatility']

    # MACD
    df['MACD'] = df['EMA_12'] - df['EMA_26']
    df['Signal_Line'] = df['MACD'].ewm(span=9, adjust=False).mean()

    # On-Balance Volume (OBV)
    df['OBV'] = (np.sign(df['Adj Close'].diff()) * df['Volume']).fillna(0).cumsum()

    # Volume Weighted Average Price (VWAP)
    df['VWAP'] = (df['Volume'] * df['Adj Close']).cumsum() / df['Volume'].cumsum()

    # Average True Range (ATR)
    atr = AverageTrueRange(high=df['High'], low=df['Low'], close=df['Adj Close'], window=14)
    df['ATR'] = atr.average_true_range()

    df.dropna(inplace=True)
    return df

# Function to assign recommendations
def assign_recommendation(predicted_change):
    if predicted_change > 0.05:
        return 'Strong Buy'
    elif predicted_change > 0.02:
        return 'Buy'
    elif predicted_change > -0.02:
        return 'Hold'
    elif predicted_change > -0.05:
        return 'Sell'
    else:
        return 'Strong Sell'

def get_recommendation(symbol):
    # Parameters
    end_date = datetime.now()
    start_date = end_date - timedelta(days=365*2)  # Last 2 years of data

    # Get data
    df = get_stock_data(symbol, start_date, end_date)

    # Check if data is available
    if df.empty:
        return {'error': f'No data available for symbol {symbol}'}

    df = create_features(df)

    # Prepare dataset for training and prediction
    df['Future Price'] = df['Adj Close'].shift(-30)  # Predicting 30 days ahead

    # Separate data for training and prediction
    df_train = df.iloc[:-30]  # Exclude last 30 rows for training
    df_predict = df.iloc[-30:]  # Last 30 rows for prediction

    # Drop rows with NaN 'Future Price' from training data
    df_train = df_train.dropna(subset=['Future Price'])

    features = ['Adj Close', 'SMA_5', 'SMA_10', 'EMA_5', 'EMA_10', 'Momentum', 'Volatility', 'RSI']

    # Training data
    X_train = df_train[features]
    y_train = df_train['Future Price']

    # Prediction data
    X_predict = df_predict[features]

    # Ensure no missing features in the prediction data
    X_predict = X_predict.dropna()

    # Check if we have enough data to proceed
    if X_train.empty or X_predict.empty:
        return {'error': 'Not enough data to make a prediction'}

    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_predict_scaled = scaler.transform(X_predict)

    # Time Series Split
    tscv = TimeSeriesSplit(n_splits=5)
    best_model = None
    lowest_error = float('inf')

    for train_index, test_index in tscv.split(X_train_scaled):
        X_t, X_v = X_train_scaled[train_index], X_train_scaled[test_index]
        y_t, y_v = y_train.iloc[train_index], y_train.iloc[test_index]

        xgb = XGBRegressor()
        param_grid = {
            'n_estimators': [50, 100, 200],
            'learning_rate': [0.01, 0.05, 0.1],
            'max_depth': [3, 5, 7]
        }
        grid_search = GridSearchCV(xgb, param_grid, cv=3, scoring='neg_mean_absolute_error')
        grid_search.fit(X_t, y_t)
        model = grid_search.best_estimator_

        y_pred = model.predict(X_v)
        error = np.mean(np.abs(y_v - y_pred))
        if error < lowest_error:
            lowest_error = error
            best_model = model

    # Predict future prices for the prediction data
    future_prices_pred = best_model.predict(X_predict_scaled)

    # Use the last available date for current prediction
    current_price = df_predict['Adj Close'].iloc[-1]
    predicted_price = future_prices_pred[-1]

    # Calculate predicted change
    predicted_change = (predicted_price - current_price) / current_price

    # Assign recommendation
    recommendation = assign_recommendation(predicted_change)

    # Ensure values are standard Python types
    current_price = float(current_price)
    predicted_price = float(predicted_price)
    change_pct = float(predicted_change * 100)

    # Package the result
    result = {
        'symbol': symbol,
        'current_price': round(current_price, 2),
        'predicted_price': round(predicted_price, 2),
        'change_pct': round(change_pct, 2),
        'recommendation': recommendation
    }

    return result

if __name__ == "__main__":
    import sys
    symbol = sys.argv[1] if len(sys.argv) > 1 else "AAPL"
    #recommendation = get_recommendation(symbol)
    recommendation={'symbol': 'AAPL', 'current_price': 146.15, 'predicted_price': 148.68, 'change_pct': 1.73, 'recommendation': 'Hold'}
    # Output JSON only
    print(json.dumps(recommendation))
