import React, { useContext, useEffect, useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Card, CardContent, Grid } from '@material-ui/core';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from '@material-ui/core/Typography';
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
  }
});

export default function WalletTable({ priceDecimals }) {

  const classes = useStyles();

  const [state, dispatch] = useContext(Context);

  const MemoizedWalletTable = useMemo(() => {
    return (
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h5" color="textSecondary">
              Wallets
            </Typography>
            <TableContainer >
              <Table size="small" aria-label="ticker table">
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.root}></TableCell>
                    <TableCell align="right" className={classes.root}>
                      Futures
                    </TableCell>
                    <TableCell align="right" className={classes.root}>
                      Margin
                    </TableCell>
                    <TableCell align="right" className={classes.root}>
                      Total
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {state.walletRows.map((row) => (
                    <TableRow
                      key={row.asset}
                      className={classes.tableRow}
                      hover={true}
                    >
                      <TableCell component="th" scope="row">
                        {row.asset}
                      </TableCell>
                      <TableCell align="right">
                        {parseFloat(row.futuresPositionAmt).toFixed(priceDecimals)}
                      </TableCell>
                      <TableCell align="right">
                        {parseFloat(row.marginPositionAmt).toFixed(priceDecimals)}
                      </TableCell>
                      <TableCell align="right">
                        {parseFloat(row.totalPositionAmt).toFixed(priceDecimals)}
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
  }, [state.walletRows])

  return MemoizedWalletTable
}
