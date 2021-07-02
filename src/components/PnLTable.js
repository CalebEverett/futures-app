import React, { useContext, useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Card, CardContent, Grid } from '@material-ui/core';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from '@material-ui/core/Typography';
import { Context } from '../store/Store';


const useStyles = makeStyles((theme) => {
  return {
    root: {
      color: theme.palette.text.secondary,
    },
    tableCellPos: {
      color: theme.palette.success.main
    },
    tableCellNeg: {
      color: theme.palette.error.main
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

export default function PnLTable({ priceDecimals }) {

  const classes = useStyles();

  const [state, dispatch] = useContext(Context);

  const symbols = state.pnLRows.length > 0 ? Object.keys(state.pnLRows[0]).filter(k => k != 'component') : []

  const MemoizedPnLTable = useMemo(() => {
    return (
      <Grid item >
        <Card>
          <CardContent>
            <Typography variant="h5" color="textSecondary">
              RealizedPnL
            </Typography>
            <TableContainer >
              <Table size="small" aria-label="ticker table">
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.root}></TableCell>
                    {symbols.map(s => (
                      <TableCell align="right" className={classes.root}>
                        {s}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {state.pnLRows.map(row => (
                    <TableRow
                      key={row.component}
                      className={classes.tableRow}
                      hover={true}
                    >
                      <TableCell component="th" scope="row">
                        {row.component}
                      </TableCell>
                      {symbols.map(s => (
                        <TableCell align="right" className={parseFloat(row[s]) > 0 ? classes.tableCellPos : parseFloat(row[s]) < 0 ? classes.tableCellNeg : null}>
                          {parseFloat(row[s]).toFixed(priceDecimals)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    );
  }, [state.pnLRows])

  return MemoizedPnLTable
}
