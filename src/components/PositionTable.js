import { useContext, useEffect, useMemo, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Card, CardContent, Grid } from '@material-ui/core';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from '@material-ui/core/Typography';

import { TradeButton, TradeAction } from "./TradeAction";
import { ACTIONS, Context } from '../store/Store';

const useStyles = makeStyles((theme) => {
  return {
    root: {
      color: theme.palette.text.secondary,
    },
    tableRow: {
      "&$selected": {
        backgroundColor: theme.palette.action.selected,
      },
      "&$selected:hover": {
        backgroundColor: theme.palette.action.disabled,
      },
    },
    headerTableCell: {
      border: "none",
      width: "5px",
    },
    selected: {},
    tickColors: {
      uptick: theme.palette.success.main,
      downtick: theme.palette.error.main,
    }
  }
});

const getTimeToFunding = (timestamp) => {
  const timeDelta = timestamp - Date.now();

  const hours = `0${new Date(timeDelta).getUTCHours()}`.slice(-2);
  const minutes = `0${new Date(timeDelta).getUTCMinutes()}`.slice(-2);
  const seconds = `0${new Date(timeDelta).getUTCSeconds()}`.slice(-2);

  const formattedTime = `${hours}:${minutes}:${seconds}`;

  return formattedTime;
};

export default function PositionTable({ priceDecimals }) {

  const classes = useStyles();

  const [state, dispatch] = useContext(Context);

  useEffect(() => {
    const updatePrice = (row) => {
      row.markPrice = state.prices[row.symbol].markPrice;
      row.markTick = state.prices[row.symbol].markTick;
      row.spotPrice = state.prices[row.symbol].spotPrice;
      row.spotTick = state.prices[row.symbol].spotTick;
      row.fundingRate = state.prices[row.symbol].fundingRate;
      row.fundingTime = state.prices[row.symbol].fundingTime;
      row["unRealizedProfitTick"] =
        row.unRealizedProfit > 0
          ? classes.tickColors.uptick
          : classes.tickColors.uptick;
      return row;
    };
    const data = state.positionRows.map((row) => updatePrice(row))
    dispatch({ type: ACTIONS.SET_POSITION_ROWS, payload: data });
  }, [state.prices]);

  const notional = (row) => {
    return parseFloat(row.markPrice) * parseFloat(row.positionAmt);
  };

  const spotNotional = (row) => {
    return parseFloat(row.spotPrice) * parseFloat(row.marginPositionAmt);
  };

  const entryNotional = (row) => {
    return parseFloat(row.entryPrice) * parseFloat(row.positionAmt);
  };

  const unRealizedProfit = (row) => {
    return notional(row) - entryNotional(row);
  };

  const margin = (row) => {
    return -entryNotional(row) / row.leverage + unRealizedProfit(row);
  };

  const onTickerClick = (ticker) => {
    dispatch({ type: ACTIONS.SET_TICKER, payload: ticker });
  };

  const MemoizedPositionTable = useMemo(() => {

    return (
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h5" color="textSecondary">
              Open Positions
            </Typography>
            <TableContainer>
              <TradeAction />
              <Table size="small" aria-label="ticker table">
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.headerTableCell}></TableCell>
                    <TableCell className={classes.headerTableCell}></TableCell>
                    <TableCell align="center" colSpan={2} className={classes.root}>
                      Net
                    </TableCell>
                    <TableCell className={classes.headerTableCell}></TableCell>
                    <TableCell align="center" colSpan={9} className={classes.root}>
                      Futures
                    </TableCell>
                    <TableCell className={classes.headerTableCell}></TableCell>
                    <TableCell align="center" colSpan={5} className={classes.root}>
                      Margin
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={classes.root}></TableCell>
                    <TableCell className={classes.root}></TableCell>
                    <TableCell className={classes.root} align="right">
                      Unrealized
                      <br />
                      PnL
                    </TableCell>
                    <TableCell className={classes.root} align="right">
                      Current
                      <br />
                      Value
                    </TableCell>
                    <TableCell className={classes.root}></TableCell>
                    <TableCell align="right" className={classes.root}>
                      Position
                      <br />
                      Amount
                    </TableCell>
                    <TableCell align="right" className={classes.root}>
                      Entry
                      <br />
                      Price
                    </TableCell>
                    <TableCell align="right" className={classes.root}>
                      Liquidation
                      <br />
                      Price
                    </TableCell>
                    <TableCell align="right" className={classes.root}>
                      Mark
                      <br />
                      Price
                    </TableCell>
                    <TableCell align="right" className={classes.root}>
                      Funding
                      <br />
                      Rate
                    </TableCell>
                    <TableCell align="right" className={classes.root}>
                      Time To
                      <br />
                      Funding
                    </TableCell>
                    <TableCell align="right" className={classes.root}>
                      Notional
                    </TableCell>
                    <TableCell align="right" className={classes.root}>
                      Margin
                    </TableCell>
                    <TableCell align="right" className={classes.root}>
                      Unrealized
                      <br />
                      PnL
                    </TableCell>
                    <TableCell className={classes.headerTableCell}></TableCell>
                    <TableCell align="right" className={classes.root}>
                      Position
                      <br />
                      Amount
                    </TableCell>
                    <TableCell align="right" className={classes.root}>
                      Entry
                      <br />
                      Price
                    </TableCell>
                    <TableCell align="right" className={classes.root}>
                      Current
                      <br />
                      Price
                    </TableCell>
                    <TableCell align="right" className={classes.root}>
                      Current
                      <br />
                      Value
                    </TableCell>
                    <TableCell align="right" className={classes.root}>
                      Unrealized
                      <br />
                      PnL
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {state.positionRows.map((row) => (
                    <TableRow
                      key={row.symbol}
                      selected={row.symbol === state.ticker ? true : false}
                      className={classes.tableRow}
                      classes={{ selected: classes.selected }}
                      hover={true}
                      onClick={() => onTickerClick(row.symbol)}
                    >
                      <TableCell component="th" scope="row">
                        {row.symbol}
                      </TableCell>
                      <TableCell>
                        <TradeButton row={row} />
                      </TableCell>
                      <TableCell align="right">0.0</TableCell>
                      <TableCell align="right">{(margin(row) + spotNotional(row)).toFixed(priceDecimals)}</TableCell>
                      <TableCell></TableCell>
                      <TableCell align="right">
                        {parseFloat(row.positionAmt).toFixed(4)}
                      </TableCell>
                      <TableCell align="right">
                        {parseFloat(row.entryPrice).toFixed(priceDecimals)}
                      </TableCell>
                      <TableCell align="right">
                        {parseFloat(row.liquidationPrice).toFixed(priceDecimals)}
                      </TableCell>
                      <TableCell style={{ color: row.markTick }} align="right">
                        {parseFloat(row.markPrice).toFixed(priceDecimals)}
                      </TableCell>
                      <TableCell align="right">
                        {parseFloat(row.fundingRate).toFixed(4)}
                      </TableCell>
                      <TableCell align="right">{getTimeToFunding(row.fundingTime)}</TableCell>
                      <TableCell align="right">
                        {notional(row).toFixed(priceDecimals)}
                      </TableCell>
                      <TableCell align="right">
                        {margin(row).toFixed(priceDecimals)}
                      </TableCell>
                      <TableCell style={{ color: row.unRealizedProfitTick }} align="right">
                        {unRealizedProfit(row).toFixed(priceDecimals)}
                      </TableCell>
                      <TableCell></TableCell>
                      <TableCell align="right">
                        {parseFloat(row.marginPositionAmt).toFixed(4)}
                      </TableCell>
                      <TableCell align="right">Two</TableCell>
                      <TableCell style={{ color: row.spotTick }} align="right">{parseFloat(row.spotPrice).toFixed(priceDecimals)}</TableCell>
                      <TableCell align="right">{spotNotional(row).toFixed(priceDecimals)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    );
  }, [state.positionRows])

  return MemoizedPositionTable

}