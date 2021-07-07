import { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { useTheme } from "@material-ui/core/styles";
import { ACTIONS, Context } from '../store/Store';

export default function TickerTable({
  priceDecimals,
  rateDecimals
}) {
  const theme = useTheme();
  const useStyles = makeStyles({
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
    selected: {},
  });
  const classes = useStyles();

  const [state] = useContext(Context);

  const onTickerClick = (ticker) => {
    dispatch({ type: ACTIONS.SET_TICKER, payload: ticker });
  };

  const getTimeToFunding = (timestamp) => {
    const timeDelta = timestamp - Date.now();

    const hours = `0${new Date(timeDelta).getUTCHours()}`.slice(-2);
    const minutes = `0${new Date(timeDelta).getUTCMinutes()}`.slice(-2);
    const seconds = `0${new Date(timeDelta).getUTCSeconds()}`.slice(-2);

    const formattedTime = `${hours}:${minutes}:${seconds}`;

    return formattedTime;
  };

  return (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="ticker table">
        <TableHead>
          <TableRow>
            <TableCell className={classes.root}></TableCell>
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
          </TableRow>
        </TableHead>
        <TableBody>
          {state.tickerRows.map((row) => (
            <TableRow
              key={row.s}
              onClick={() => onTickerClick(row.s)}
              selected={row.s === state.ticker ? true : false}
              className={classes.tableRow}
              classes={{ selected: classes.selected }}
              hover={true}
            >
              <TableCell component="th" scope="row">
                {row.s}
              </TableCell>
              <TableCell align="right" style={{ color: row.markTick }}>
                {parseFloat(row.p).toFixed(priceDecimals)}
              </TableCell>
              <TableCell align="right">
                {parseFloat(row.r).toFixed(rateDecimals)}
              </TableCell>
              <TableCell align="right">{getTimeToFunding(row.T)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
