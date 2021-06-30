import React, { createContext, useReducer, useEffect, useMemo } from "react";
import Reducer from './Reducer'
import { useTheme } from '@material-ui/core/styles';

export const initialState = {
    openClose: false,
    openOpen: false,
    ticker: "BTCUSDT",
    tickerRows: [],
    positionRows: [],
    prices: {},
    walletRows: [],
    openAmounts: {
        leverage: 5,
        price: 0,
        capital: { amount: 0, usdt: 0 },
        notional: { amount: 0, usdt: 0 },
        margin: { amount: 0, usdt: 0 }
    },
};

export const ACTIONS = {
    SET_CLOSE_OPEN: 'SET_CLOSE_OPEN',
    SET_OPEN_OPEN: 'SET_OPEN_OPEN',
    SET_TICKER: 'SET_TICKER',
    SET_TICKER_ROWS: 'SET_TICKER_ROWS',
    SET_POSITION_ROWS: 'SET_POSITION_ROWS',
    SET_PRICES: 'SET_PRICES',
    SET_WALLET_ROWS: 'SET_WALLET_ROWS',
    SET_CAPITAL: 'SET_CAPITAL',
    SET_OPEN_AMOUNTS: 'SET_OPEN_AMOUNTS',
}

const Store = ({ children }) => {
    const [state, dispatch] = useReducer(Reducer, initialState);
    const theme = useTheme()


    // Initial data for position table
    async function getPositionRows() {
        const response = await fetch("http://localhost:8000/account");
        const data = await response.json();
        dispatch({ type: ACTIONS.SET_POSITION_ROWS, payload: data })
    }

    async function getWalletRows() {
        const response = await fetch("http://localhost:8000/wallet");
        const data = await response.json();
        dispatch({ type: ACTIONS.SET_WALLET_ROWS, payload: data });
    }

    useEffect(() => {
        getPositionRows();
        getWalletRows();
    }, [state.openOpen, state.openClose]);

    // Price stream for position table
    const add_tick = (current, prior) => {

        let tick

        if (current > prior) {
            tick = theme.palette.success.main;
        }

        if (current < prior) {
            tick = theme.palette.error.main;
        }

        return tick;
    };


    async function streamPrices() {
        let ws = new WebSocket("ws://localhost:8000/market-stream");
        let oldPrices = {}
        ws.onmessage = (event) => {

            let filteredTickers = JSON.parse(event.data);

            const newPrices = {};
            filteredTickers.forEach((element) => {
                newPrices[element.s] = {
                    markPrice: element.p,
                    spotPrice: element.spotPrice,
                    fundingRate: element.r,
                    fundingTime: element.T,
                };


                if (Object.keys(oldPrices).length > 0) {
                    newPrices[element.s].markTick = add_tick(element.p, oldPrices[element.s].markPrice);
                    newPrices[element.s].spotTick = add_tick(element.spotPrice, oldPrices[element.s].spotPrice);
                }

            });
            dispatch({ type: ACTIONS.SET_PRICES, payload: newPrices })
            oldPrices = newPrices

        }
        return () => ws.close()
    }

    async function streamAccountUpdates() {
        let ws = new WebSocket("ws://localhost:8000/user-stream");
        ws.onmessage = (event) => {
            console.log(event.data)
        }
        return () => ws.close()
    };

    useEffect(() => {
        streamPrices();
        streamAccountUpdates()
    }, []);

    return (
        <Context.Provider value={[state, dispatch]}>
            {children}
        </Context.Provider>
    )
};

export const Context = createContext(initialState);
export default Store;