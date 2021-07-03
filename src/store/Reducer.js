import { ACTIONS } from './Store'


const Reducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.SET_CLOSE_OPEN:
            return {
                ...state,
                openClose: action.payload
            };
        case ACTIONS.SET_OPEN_OPEN:
            return {
                ...state,
                openOpen: action.payload
            };
        case ACTIONS.SET_TICKER:
            return {
                ...state,
                ticker: action.payload
            };
        case ACTIONS.SET_TICKER_ROWS:
            return {
                ...state,
                tickerRows: action.payload
            };
        case ACTIONS.SET_POSITION_ROWS:
            return {
                ...state,
                positionRows: action.payload
            };
        case ACTIONS.SET_PRICES:
            return {
                ...state,
                prices: action.payload
            };
        case ACTIONS.SET_WALLET_ROWS:
            return {
                ...state,
                walletRows: action.payload
            };
        case ACTIONS.SET_TRADE_ROWS:
            return {
                ...state,
                tradeRows: action.payload
            };
        case ACTIONS.SET_PNL_ROWS:
            return {
                ...state,
                pnLRows: action.payload
            };
        case ACTIONS.SET_OPEN_AMOUNTS:
            return {
                ...state,
                openAmounts: action.payload
            };
        case ACTIONS.SET_CANDLE_INTERVAL:
            return {
                ...state,
                candleInterval: action.payload
            };
        case ACTIONS.SET_TIME_RANGE:
            return {
                ...state,
                timeRange: action.payload
            };

        default:
            return state;
    }
};

export default Reducer;