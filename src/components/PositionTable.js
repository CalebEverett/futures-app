import { useContext, useEffect, useMemo } from "react";
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
      width: "10px",
      paddingRight: "0px",
      paddingLeft: "0px",
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
                      Unreal.
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
                      Liquid.
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
                      Unreal.
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
                      Unreal.
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
                      <TableCell style={{ color: row.totalUnRealizedProfitTick }} align="right">{
                        parseFloat(row.totalUnRealizedProfit).toFixed(priceDecimals)
                      }</TableCell>
                      <TableCell align="right">{(row.margin + row.marginNotional).toFixed(priceDecimals)}</TableCell>
                      <TableCell></TableCell>
                      <TableCell align="right">
                        {parseFloat(row.positionAmt).toFixed(3)}
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
                        {row.notional.toFixed(priceDecimals)}
                      </TableCell>
                      <TableCell align="right">
                        {row.margin.toFixed(priceDecimals)}
                      </TableCell>
                      <TableCell style={{ color: row.unRealizedProfitTick }} align="right">
                        {parseFloat(row.unRealizedProfit).toFixed(priceDecimals)}
                      </TableCell>
                      <TableCell></TableCell>
                      <TableCell align="right">
                        {parseFloat(row.marginPositionAmt).toFixed(3)}
                      </TableCell>
                      <TableCell align="right">{parseFloat(row.marginEntryPrice).toFixed(priceDecimals)}</TableCell>
                      <TableCell style={{ color: row.spotTick }} align="right">{parseFloat(row.spotPrice).toFixed(priceDecimals)}</TableCell>
                      <TableCell align="right">{row.marginNotional.toFixed(priceDecimals)}</TableCell>
                      <TableCell style={{ color: row.marginUnRealizedProfitTick }} align="right">
                        {parseFloat(row.marginUnRealizedProfit).toFixed(priceDecimals)}
                      </TableCell>
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