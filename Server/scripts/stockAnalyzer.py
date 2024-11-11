import json
import pandas as pd
import numpy as np
import yfinance as yf
from sklearn.model_selection import TimeSeriesSplit, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error
from datetime import datetime, timedelta

# Function to get historical stock data
def get_stock_data(ticker, start_date, end_date):
    stock = yf.download(ticker, start=start_date, end=end_date)
    stock.dropna(inplace=True)
    return stock

# Function to create features
def create_features(df):
    df['Return'] = df['Adj Close'].pct_change()
    df['SMA_5'] = df['Adj Close'].rolling(window=5).mean()
    df['SMA_10'] = df['Adj Close'].rolling(window=10).mean()
    df['EMA_5'] = df['Adj Close'].ewm(span=5, adjust=False).mean()
    df['EMA_10'] = df['Adj Close'].ewm(span=10, adjust=False).mean()
    df['Momentum'] = df['Adj Close'] - df['Adj Close'].shift(10)
    df['Volatility'] = df['Return'].rolling(window=10).std()
    df['RSI'] = compute_RSI(df['Adj Close'], window=14)
    df.dropna(inplace=True)
    return df

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

# Function to assign recommendations
def assign_recommendation(predicted_change):
    if predicted_change > 0.05:
        return 'STRONG BUY'
    elif predicted_change > 0.02:
        return 'BUY'
    elif predicted_change > -0.02:
        return 'HOLD'
    elif predicted_change > -0.05:
        return 'SELL'
    else:
        return 'STRONG SELL'

# Recommendation function matching the structure of the original script
def get_recommendation(symbol):
    try:
        # Define the date range (last 2 years)
        end_date = datetime.now()
        start_date = end_date - timedelta(days=365*2)

        # Get data and create features
        df = get_stock_data(symbol, start_date, end_date)
        df = create_features(df)

        # Prepare dataset for prediction (30 days ahead)
        df['Future Price'] = df['Adj Close'].shift(-30)
        df.dropna(inplace=True)
        features = ['Adj Close', 'SMA_5', 'SMA_10', 'EMA_5', 'EMA_10', 'Momentum', 'Volatility', 'RSI']
        X = df[features]
        y = df['Future Price']

        # Scale features
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)

        # Time Series Split and model training
        tscv = TimeSeriesSplit(n_splits=5)
        best_model = None
        lowest_error = float('inf')

        for train_index, test_index in tscv.split(X_scaled):
            X_train, X_test = X_scaled[train_index], X_scaled[test_index]
            y_train, y_test = y.iloc[train_index], y.iloc[test_index]

            # Hyperparameter tuning
            param_grid = {
                'n_estimators': [100, 200, 300],
                'max_depth': [5, 10, 15],
                'min_samples_split': [2, 5, 10]
            }
            rf = RandomForestRegressor()
            grid_search = GridSearchCV(rf, param_grid, cv=3)
            grid_search.fit(X_train, y_train)
            model = grid_search.best_estimator_

            # Calculate error
            y_pred = model.predict(X_test)
            error = mean_absolute_error(y_test, y_pred)
            if error < lowest_error:
                lowest_error = error
                best_model = model

        # Final prediction on entire data
        y_pred = best_model.predict(X_scaled)
        y_pred_series = pd.Series(y_pred, index=df.index)
        y_pred_change = (y_pred_series - df['Adj Close']) / df['Adj Close']
        recommendation = assign_recommendation(y_pred_change.iloc[-1])

        # Return data in JSON format
        current_price = float(df['Adj Close'].iloc[-1])
        predicted_price = float(y_pred_series.iloc[-1])
        change_pct = (predicted_price - current_price) / current_price * 100

        result = {
            'symbol': symbol,
            'current_price': round(current_price, 2),
            'predicted_price': round(predicted_price, 2),
            'change_pct': round(change_pct, 2),
            'recommendation': recommendation
        }
        return result

    except Exception as e:
        return {"error": f"Error analyzing {symbol}: {str(e)}"}

if __name__ == "__main__":
    import sys
    symbol = sys.argv[1] if len(sys.argv) > 1 else "AAPL"
    recommendation = get_recommendation(symbol)

    # Output JSON only
    print(json.dumps(recommendation))
