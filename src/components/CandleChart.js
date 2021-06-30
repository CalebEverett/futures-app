import { Card, CardContent, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { useTheme } from '@material-ui/core/styles'
import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import PropTypes from 'prop-types';

const HEIGHT = 300;

const useStyles = makeStyles({
    root: {
        width: "100%",
    }
});

const CandleChart = ({ endPoint, title, decimals }) => {
    // https://github.com/tradingview/lightweight-charts/blob/master/docs/customization.md

    const classes = useStyles();
    const elRef = useRef();
    const chartRef = useRef()
    const candlestickSeriesRef = useRef()
    const volumeSeriesRef = useRef()
    const [initCandles, setInitCandles] = useState([])
    const [initVolumes, setInitVolumes] = useState([])
    const [lastCandle, setLastCandle] = useState({})
    const theme = useTheme();

    useEffect(() => {
        const apiUrl = `http://localhost:8000/${endPoint}`

        async function getInitCandles() {
            const response = await fetch(apiUrl);
            const data = await response.json();
            setInitCandles(data);
            setInitVolumes(data.map(c => ({ time: c.time, value: c.volume })));
        };

        getInitCandles();
    }
        , [endPoint]);

    useEffect(() => {
        let ws = new WebSocket(`ws://localhost:8000/${endPoint}`)
        ws.onmessage = (event) => {
            setLastCandle(JSON.parse(event.data))
        };
        return () => ws.close()
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

        candlestickSeriesRef.current = chartRef.current.addCandlestickSeries({
            priceScaleId: 'right',
            upColor: theme.palette.success.main,
            downColor: theme.palette.error.main,
            borderVisible: false,
            wickVisible: true,
            wickUpColor: theme.palette.success.main,
            wickDownColor: theme.palette.error.main,
            priceFormat: {
                type: 'custom',
                minMove: '0.00000001',
                formatter: (price) => {
                    return parseFloat(price).toFixed(decimals);
                }
            },
        });

        candlestickSeriesRef.current.setData(initCandles);

        volumeSeriesRef.current = chartRef.current.addHistogramSeries({
            color: theme.palette.action.disabledBackground,
            borderVisible: false,
            priceFormat: {
                type: 'volume',
            },
            priceScaleId: '',
            scaleMargins: {
                top: 0.9,
                bottom: 0.0,
            },
        });

        volumeSeriesRef.current.setData(initVolumes);

        return () => chartRef.current.remove()

    }, [initCandles, initVolumes]);

    useEffect(() => {
        if (!(lastCandle && Object.keys(lastCandle).length === 0 && lastCandle.constructor === Object)) {
            candlestickSeriesRef.current.update(lastCandle);
            volumeSeriesRef.current.update({ time: lastCandle.time, value: lastCandle.volume });
        }

    }, [lastCandle]);

    useEffect(() => {
        const handler = () => {
            chartRef.current.resize(elRef.current.offsetWidth, HEIGHT);
        };
        window.addEventListener('resize', handler);
        return () => {
            window.removeEventListener('resize', handler);
        };
    }, []);

    return (
        <Grid item xs={12} lg={6}>
            <Card className={classes.root}>
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

CandleChart.propTypes = {
    endPoint: PropTypes.string,
    title: PropTypes.string,
    decimals: PropTypes.number,
};

export default CandleChart;