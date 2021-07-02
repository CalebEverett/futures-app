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
    tradeRows: [],
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
    SET_TRADE_ROWS: 'SET_TRADE_ROWS',
    SET_PRICES: 'SET_PRICES',
    SET_WALLET_ROWS: 'SET_WALLET_ROWS',
    SET_CAPITAL: 'SET_CAPITAL',
    SET_OPEN_AMOUNTS: 'SET_OPEN_AMOUNTS',
}

const Store = ({ children }) => {
    const [state, dispatch] = useReducer(Reducer, initialState);
    const theme = useTheme()

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


    // Initial data for position table
    async function getPositionRows() {
        const response = await fetch("http://localhost:8000/account");
        const data = await response.json();

        const responseDos = await fetch("http://localhost:8000/trades?form=last");
        const dataDos = await responseDos.json();
        const entryPrices = {}
        dataDos.forEach(openPos => entryPrices[openPos.symbol] = openPos.priceMargin)

        data.forEach(row => {
            if (row.positionAmt != 0) {
                row.marginEntryPrice = entryPrices[row.symbol]
            }
        })

        dispatch({ type: ACTIONS.SET_POSITION_ROWS, payload: data })
    }

    // Initial data for wallet table
    async function getWalletRows() {
        const response = await fetch("http://localhost:8000/wallet");
        const data = await response.json();
        dispatch({ type: ACTIONS.SET_WALLET_ROWS, payload: data });
    }

    // Initial data for trades table
    async function getTradeRows() {
        const response = await fetch("http://localhost:8000/trades");
        const data = await response.json();
        dispatch({ type: ACTIONS.SET_TRADE_ROWS, payload: data });
    }

    useEffect(() => {
        getPositionRows();
        // updateMarginEntryPrice();
        getWalletRows();
        getTradeRows();
    }, [state.openOpen, state.openClose]);

    // Price stream for position table
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
            const update = JSON.parse(event.data)
            if (["ACCOUNT_UPDATE", "outboundAccountPosition"].indexOf(update.e) != -1) {
                getPositionRows();
                getWalletRows();
                getTradeRows();
                console.log("Positions, wallet and trades updated.")
            }
        }
        return () => ws.close()
    };

    useEffect(() => {
        streamPrices();
        streamAccountUpdates()
    }, []);

    // Update position rows with price changes
    useEffect(() => {
        const updatePrice = (row) => {
            const notional = (price, positionAmt) => {
                return parseFloat(price) * parseFloat(positionAmt);
            };

            const unRealizedProfit = (price, entryPrice, positionAmt) => {
                return notional(price, positionAmt) - notional(entryPrice, positionAmt);
            };

            const margin = (price, entryPrice, positionAmt, leverage) => {
                return -notional(entryPrice, positionAmt) / leverage + unRealizedProfit(price, entryPrice, positionAmt);
            };

            row.markPrice = state.prices[row.symbol].markPrice;
            row.markTick = state.prices[row.symbol].markTick;
            row.spotPrice = state.prices[row.symbol].spotPrice;
            row.spotTick = state.prices[row.symbol].spotTick;
            row.fundingRate = state.prices[row.symbol].fundingRate;
            row.fundingTime = state.prices[row.symbol].fundingTime;

            row.notional = notional(row.markPrice, row.positionAmt)
            row.marginNotional = notional(row.spotPrice, row.marginPositionAmt)
            row.margin = margin(row.markPrice, row.entryPrice, row.positionAmt, row.leverage)
            row.unRealizedProfit = unRealizedProfit(row.markPrice, row.entryPrice, row.positionAmt)
            row.unRealizedProfitTick = add_tick(row.unRealizedProfit, 0)
            row.marginUnRealizedProfit = unRealizedProfit(row.spotPrice, row.marginEntryPrice, row.marginPositionAmt)
            row.marginUnRealizedProfitTick = add_tick(row.marginUnRealizedProfit, 0)
            row.totalUnRealizedProfit = parseFloat(row.unRealizedProfit) + parseFloat(row.marginUnRealizedProfit)
            row.totalUnRealizedProfitTick = add_tick(row.totalUnRealizedProfit, 0)

            return row;
        };
        const data = state.positionRows.map((row) => updatePrice(row))
        dispatch({ type: ACTIONS.SET_POSITION_ROWS, payload: data });
    }, [state.prices]);

    return (
        <Context.Provider value={[state, dispatch]}>
            {children}
        </Context.Provider>
    )
};

export const Context = createContext(initialState);
export default Store;