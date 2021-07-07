import { Fragment, useContext, useMemo } from "react";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { useTheme } from '@material-ui/core/styles';
import { ACTIONS, Context, initialState } from '../store/Store';
import { isEmpty } from "lodash";


export const TradeButton = ({ row }) => {
    const theme = useTheme();

    const [, dispatch] = useContext(Context);

    const openPosition = (Math.abs(parseFloat(row.positionAmt)) + Math.abs(parseFloat(row.marginPositionAmt))) > 0.00001

    const action = openPosition ? ACTIONS.SET_CLOSE_OPEN : ACTIONS.SET_OPEN_OPEN

    const label = openPosition ? "Close" : "Open"

    const color = openPosition ? "error" : "success"

    const handleClickOpen = () => {
        dispatch({ type: action, payload: true });
    };

    return (
        <Button size="small" onClick={handleClickOpen} style={{ lineHeight: 1, color: theme.palette[color].light }}>
            {label}
        </Button>
    )
}


export const TradeAction = () => {
    const [state, dispatch] = useContext(Context);

    async function postTrade(positions, endPoint = 'close-positions') {
        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(positions)
        }
        const url = `http://localhost:8000/${endPoint}`
        const response = await fetch(url, config)
        console.log(await response.json())
    }

    const CloseTradeAction = useMemo(() => {

        const closeHandleOK = () => {
            dispatch({ type: ACTIONS.SET_CLOSE_OPEN, payload: false });

            const row = state.positionRows.filter(row => row.symbol === state.ticker)[0];

            const positions = {
                symbol: row.symbol,
                futuresQty: row.positionAmt,
                marginQty: row.marginPositionAmt,
                leverage: 1
            }
            postTrade(positions)
            dispatch({ type: ACTIONS.SET_CLOSE_OPEN, payload: false });
        };

        const handleCloseCancel = () => {
            dispatch({ type: ACTIONS.SET_CLOSE_OPEN, payload: false });
        };

        return (
            <Dialog
                open={state.openClose}
                onClose={handleCloseCancel}
                aria-labelledby="alert-dialog-title"
            >
                <DialogTitle id="alert-dialog-title">{`Close positions for ${state.ticker}?`}</DialogTitle>
                <DialogActions>
                    <Button onClick={() => closeHandleOK()} >
                        OK
                    </Button>
                    <Button onClick={handleCloseCancel} >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }, [state.ticker, state.openClose]);

    const restoreOpenDefaults = () => {
        dispatch({ type: ACTIONS.SET_OPEN_OPEN, payload: false });
        dispatch({ type: ACTIONS.SET_OPEN_AMOUNTS, payload: initialState.openAmounts });
    }


    const OpenTradeAction = useMemo(() => {

        const openHandleOK = () => {
            const positions = {
                symbol: state.ticker,
                futuresQty: -state.openAmounts.notional.amount,
                marginQty: +state.openAmounts.notional.amount,
                leverage: state.openAmounts.leverage
            }
            postTrade(positions, "open-positions")
            restoreOpenDefaults()
        };

        const handleOpenCancel = () => restoreOpenDefaults();

        const valueText = (value) => {
            return `${value}x`;
        }

        const marks = [
            {
                value: 1,
                label: '1x',
            },
            {
                value: 5,
                label: '5x',
            },
            {
                value: 10,
                label: '10x',
            },
            {
                value: 15,
                label: '15x',
            },
            {
                value: 20,
                label: '20x',
            },
        ];

        const setOpenAmounts = (capital, leverage) => {
            const positionDecimals = 3
            const newOpenAmounts = { capital: {}, notional: {}, margin: {} }
            const price = isEmpty(state.prices) ? 0 : parseFloat(state.prices[state.ticker].spotPrice)
            const notional = (capital * leverage / (1 + leverage))

            newOpenAmounts["price"] = isEmpty(state.prices) ? 0 : state.prices[state.ticker].spotPrice
            newOpenAmounts["capital"]["amount"] = capital
            newOpenAmounts["capital"]["usdt"] = (capital * price).toFixed(2)
            newOpenAmounts["leverage"] = leverage
            newOpenAmounts["notional"]["amount"] = notional.toFixed(positionDecimals)
            newOpenAmounts["notional"]["usdt"] = (notional * price).toFixed(2)
            newOpenAmounts["margin"]["amount"] = (notional / leverage).toFixed(positionDecimals * 2)
            newOpenAmounts["margin"]["usdt"] = (notional / leverage * price).toFixed(2)
            dispatch({ type: ACTIONS.SET_OPEN_AMOUNTS, payload: newOpenAmounts });
        }

        const handleLeverageChange = (event, leverage) => {
            setOpenAmounts(state.openAmounts.capital.amount, leverage)
        };

        const handleCapitalChange = (event) => {
            const capital = event.target.value === '' ? '' : Number(event.target.value)
            setOpenAmounts(capital, state.openAmounts.leverage)
        };

        return (
            <Dialog
                open={state.openOpen}
                onClose={handleOpenCancel}
                aria-labelledby="alert-dialog-title"
            >
                <DialogTitle id="alert-dialog-title">{`Open positions for ${state.ticker}?`}</DialogTitle>
                <DialogContent >
                    <Typography gutterBottom variant="h6" align="center">
                        Capital
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item>
                            <TextField
                                autoFocus
                                required
                                margin="dense"
                                id="notional-token"
                                onChange={handleCapitalChange}
                                label={state.ticker.replace("USDT", "")}
                                defaultValue={state.openAmounts.capital.amount}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                disabled
                                margin="dense"
                                id="notional-usdt"
                                label="USDT"
                                value={state.openAmounts.capital.usdt}
                                variant="outlined"
                            />
                        </Grid>
                    </Grid>
                    <Typography gutterBottom variant="h6" mb={"100px"} style={{ marginTop: "20px" }} align="center">
                        Futures
                    </Typography>
                    <Typography id="leverage-slider" style={{ marginTop: "20px" }}>
                        Leverage
                    </Typography>
                    <Slider
                        mt={10}
                        getAriaValueText={valueText}
                        aria-labelledby="leverage-slider"
                        valueLabelDisplay="auto"
                        onChange={handleLeverageChange}
                        step={1}
                        marks={marks}
                        min={1}
                        max={20}
                        value={state.openAmounts.leverage}
                    />
                    <Typography gutterBottom>
                        Notional
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item>
                            <TextField
                                disabled
                                margin="dense"
                                label={state.ticker.replace("USDT", "")}
                                value={state.openAmounts.notional.amount}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                disabled
                                margin="dense"
                                label="USDT"
                                value={state.openAmounts.notional.usdt}
                                variant="outlined"
                            />
                        </Grid>
                    </Grid>
                    <Typography gutterBottom>
                        Margin
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item>
                            <TextField
                                disabled
                                margin="dense"
                                label={state.ticker.replace("USDT", "")}
                                value={state.openAmounts.margin.amount}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                disabled
                                margin="dense"
                                label="USDT"
                                value={state.openAmounts.margin.usdt}
                                variant="outlined"
                            />
                        </Grid>
                    </Grid>
                    <Typography gutterBottom variant="h6" style={{ marginTop: "20px" }} align="center">
                        Margin
                    </Typography>
                    <Typography gutterBottom>
                        Notional / Margin
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item>
                            <TextField
                                disabled
                                margin="dense"
                                label={state.ticker.replace("USDT", "")}
                                value={state.openAmounts.notional.amount}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                disabled
                                margin="dense"
                                label="USDT"
                                value={state.openAmounts.notional.usdt}
                                variant="outlined"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => openHandleOK()} >
                        OK
                    </Button>
                    <Button onClick={handleOpenCancel} >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog >
        )
    }, [state.openOpen, state.openAmounts]);

    return (
        <Fragment>
            {OpenTradeAction}
            {CloseTradeAction}
        </Fragment>
    )
}

