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
import BarChartIcon from '@material-ui/icons/BarChart';
import { Context } from './store/Store'


export default function App() {

  const [state, dispatch] = useContext(Context);

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
          <Grid item >
            <Box mt={2}></Box>
          </Grid>
          <Grid item container>
            <Grid item>
              <WalletTable priceDecimals={2} />
            </Grid>
          </Grid>
          <Grid item container >
            <Grid item xs={12}>
              <PositionTable
                priceDecimals={2}
              />
            </Grid>
          </Grid>
          <Grid item container spacing={3}>
            <CandleChart
              endPoint={`klines/futures/${state.ticker}`}
              title={`${state.ticker} futures`}
              decimals={4}
            />
            <CandleChart
              endPoint={`klines/spot/${state.ticker}`}
              title={`${state.ticker} spot`}
              decimals={4}
            />
            <CandleChart
              endPoint={`spread/${state.ticker}`}
              title={`${state.ticker} spread`}
              decimals={5}
            />
            <LineChart
              endPoint={`funding/${state.ticker}`}
              title={`${state.ticker} funding rate`}
              decimals={5}
            />
          </Grid>
        </Grid>
      </Container>
    </Fragment >
  );
}