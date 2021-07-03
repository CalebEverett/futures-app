import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { useTheme } from '@material-ui/core/styles'
import React, { useEffect, useRef, useState, useContext } from 'react';
import { createChart } from 'lightweight-charts';
import PropTypes from 'prop-types';
import { fade } from '@material-ui/core/styles/colorManipulator';
import isEmpty from 'lodash/isEmpty'
import { ACTIONS, Context } from '../store/Store'

const HEIGHT = 300;

const useStyles = makeStyles({
    root: {
        width: "100%",
    }
});

const LineChart = ({ endPoint, title, decimals }) => {
    // https://github.com/tradingview/lightweight-charts/blob/master/docs/customization.md


    const [state, dispatch] = useContext(Context);

    const classes = useStyles();
    const elRef = useRef();
    const chartRef = useRef()
    const lineSeriesRef = useRef()
    const [lines, setLines] = useState([])
    const theme = useTheme();

    useEffect(() => {
        const apiUrl = `http://localhost:8000/${endPoint}`

        async function getLines() {
            const response = await fetch(apiUrl);
            const data = await response.json();

            setLines(data);
        };

        getLines();
    }
        , [endPoint]);

    useEffect(() => {
        chartRef.current = createChart(elRef.current, {
            width: elRef.current.offsetWidth,
            height: HEIGHT,
            alignLabels: true,
            timeScale: {
                rightOffset: 0,
                barSpacing: 15,
                fixLeftEdge: false,
                lockVisibleTimeRangeOnResize: true,
                rightBarStaysOnScroll: true,
                borderVisible: false,
                visible: true,
                timeVisible: true,
                secondsVisible: true
            },
            rightPriceScale: {
                scaleMargins: {
                    top: 0.3,
                    bottom: 0.25,
                },
                borderVisible: false,
            },
            priceScale: {
                autoScale: true,
            },
            grid: {
                vertLines: {
                    color: theme.palette.action.secondary,
                    style: 4

                },
                horzLines: {
                    color: theme.palette.action.secondary,
                    style: 4
                },
            },

            layout: {
                fontFamily: theme.typography.fontFamily,
                backgroundColor: theme.palette.background.paper,
                textColor: theme.palette.text.secondary
            }
        });

        lineSeriesRef.current = chartRef.current.addAreaSeries({
            priceScaleId: 'right',
            borderVisible: false,
            topColor: fade(theme.palette.success.main, 0.2),
            bottomColor: fade(theme.palette.success.main, 0.0),
            lineColor: theme.palette.success.main,
            lineWidth: 1,
            priceFormat: {
                type: 'custom',
                minMove: '0.00000001',
                formatter: (price) => {
                    return parseFloat(price).toFixed(decimals);
                }
            },
        });

        lineSeriesRef.current.setData(lines);

        function onVisibleTimeRangeChanged(newVisibleTimeRange) {
            dispatch({ type: ACTIONS.SET_TIME_RANGE, payload: newVisibleTimeRange })
        }

        chartRef.current.timeScale().subscribeVisibleTimeRangeChange(onVisibleTimeRangeChanged);

        return () => chartRef.current.remove()

    }, [lines]);

    useEffect(() => {
        const handler = () => {
            chartRef.current.resize(elRef.current.offsetWidth, HEIGHT);
        };
        window.addEventListener('resize', handler);
        return () => {
            window.removeEventListener('resize', handler);
        };
    }, []);

    useEffect(
        () => {
            const handler = setTimeout(() => {
                if (!isEmpty(state.timeRange)) {
                    chartRef.current.timeScale().setVisibleRange(state.timeRange)
                };
            }, 200);
            return () => {
                clearTimeout(handler);
            };
        },
        [state.timeRange]
    );

    return (
        <Grid item xs={12} lg={6}>
            <Card className={classes.root} style={{ height: "100%" }}>
                <CardContent>
                    <Typography variant="h5" color="textSecondary">
                        {title}
                    </Typography>
                    <div ref={elRef} style={{ 'position': 'relative', 'width': '100%' }}></div>
                </CardContent>
            </Card>
        </Grid>
    );
};

LineChart.propTypes = {
    endPoint: PropTypes.string,
    title: PropTypes.string,
    decimals: PropTypes.number,
};

export default LineChart;