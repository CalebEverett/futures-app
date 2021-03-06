import { Fragment, useContext } from "react";
import {
  makeStyles,
} from "@material-ui/core/styles";
import {
  AppBar,
  Container,
  Box,
  CssBaseline,
  Grid,
  Toolbar,
  Typography,
} from "@material-ui/core";
import CandleChart from "./components/CandleChart";
import LineChart from "./components/LineChart";
import PositionTable from "./components/PositionTable";
import WalletTable from "./components/WalletTable";
import TradeTable from "./components/TradeTable";
import PnLTable from "./components/PnLTable";
import BarChartIcon from '@material-ui/icons/BarChart';
import { Context } from './store/Store'


export default function App() {

  const [state] = useContext(Context);

  const useStyles = makeStyles((theme) => {
    return {
      root: {
        backgroundColor: theme.palette.action.disabledBackground,
      },
      icon: {
        color: theme.palette.text.secondary
      }
    }
  });

  const classes = useStyles();

  const candleChartSpecs = [
    { data: "futures", decimals: 4 },
    { data: "spot", decimals: 4 },
    { data: "spread", decimals: 5 },
  ]

  return (
    <Fragment>
      <CssBaseline />
      <AppBar className={classes.root} position="static">
        <Toolbar>
          <BarChartIcon className={classes.icon} />
          <Typography variant="h6" noWrap color="textSecondary">
            Perpetual Futures Strategy
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box mt={2}></Box>
          </Grid>
          <WalletTable priceDecimals={2} />
          <PnLTable priceDecimals={2} />
          <PositionTable priceDecimals={2} />
          {candleChartSpecs.map(spec => (
            <CandleChart
              data={spec.data}
              decimals={spec.decimals}
            />
          ))}
          <LineChart
            endPoint={`funding/${state.ticker}`}
            title={`${state.ticker} funding rate`}
            decimals={5}
          />
          <TradeTable />
        </Grid>
      </Container>
    </Fragment >
  );
}
