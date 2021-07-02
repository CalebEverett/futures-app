import React, { useContext, useMemo } from "react";
import { Card, CardContent, Grid } from '@material-ui/core';
import {
    DataGrid, GridToolbarContainer,
    GridToolbarExport,
} from '@material-ui/data-grid';
import Typography from '@material-ui/core/Typography';
import { Context } from '../store/Store';

export default function TradeTable() {

    const [state, dispatch] = useContext(Context);

    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <GridToolbarExport />
            </GridToolbarContainer>
        );
    }


    const columns = [
        { field: "id", sortable: false, width: 50, disableColumnMenu: true, hide: true },
        { field: "symbol", flex: 1, sortable: false, disableColumnMenu: false },
        {
            field: "time",
            disableColumnMenu: true,
            width: 175,
            align: "right",
            headerAlign: "right",
            valueFormatter: (params) => new Date(params.value).toISOString().substr(0, 19).replace("T", " ")
        },
        {
            field: "orderIdFuture",
            width: 125,
            align: "right",
            headerAlign: "right",
            sortable: false,
            hide: true
        },
        {
            field: "sideFuture",
            flex: 1,
            sortable: false
        },
        {
            field: "qtyFuture",
            flex: 1,
            type: "number",
            valueFormatter: params => params.value.toFixed(3),
            disableColumnMenu: true,
            sortable: false,
        },
        {
            field: "priceFuture",
            flex: 1,
            type: "number",
            valueFormatter: params => params.value.toFixed(2),
            sortable: false,
            disableColumnMenu: true
        },
        {
            field: "quoteQtyFuture",
            flex: 1,
            type: "number",
            valueFormatter: params => params.value.toFixed(2),
            sortable: false,
            disableColumnMenu: true
        },
        {
            field: "commissionFuture",
            flex: 1,
            valueFormatter: params => params.value.toFixed(2),
            type: "number",
            sortable: false,
            disableColumnMenu: true
        },
        {
            field: "realizedPnlFuture",
            flex: 1,
            type: "number",
            valueFormatter: params => params.value.toFixed(2),
            sortComparator: (v1, v2) => parseFloat(v1) - parseFloat(v2),
            disableColumnMenu: true
        },
        {
            field: "orderIdMargin",
            width: 125,
            align: "right",
            headerAlign: "right",
            sortable: false,
            hide: true
        },
        {
            field: "sideMargin",
            flex: 1,
            sortable: false
        },
        {
            field: "qtyMargin",
            flex: 1,
            type: "number",
            valueFormatter: params => params.value.toFixed(3),
            disableColumnMenu: true,
            sortable: false,
        },
        {
            field: "priceMargin",
            flex: 1,
            type: "number",
            valueFormatter: params => params.value.toFixed(2),
            sortable: false,
            disableColumnMenu: true
        },
        {
            field: "quoteQtyMargin",
            flex: 1,
            type: "number",
            valueFormatter: params => params.value.toFixed(2),
            sortable: false,
            disableColumnMenu: true
        },
        {
            field: "commissionMargin",
            flex: 1,
            type: "number",
            valueFormatter: params => params.value.toFixed(2),
            sortable: false,
            disableColumnMenu: true
        },
        {
            field: "realizedPnlMargin",
            flex: 1,
            type: "number",
            valueFormatter: params => params.value.toFixed(2),
            sortComparator: (v1, v2) => parseFloat(v1) - parseFloat(v2),
            disableColumnMenu: true
        },
        {
            field: "commissionTotal",
            flex: 1,
            type: "number",
            valueFormatter: params => params.value.toFixed(2),
            sortable: false,
            disableColumnMenu: true
        },
        {
            field: "realizedPnlTotal",
            flex: 1,
            type: "number",
            valueGetter: params => params.value.toFixed(2),
            sortComparator: (v1, v2) => parseFloat(v1) - parseFloat(v2),
            disableColumnMenu: true
        }
    ]

    const MemoizedTradeTable = useMemo(() => {

        return (
            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <Typography variant="h5" color="textSecondary">
                            Trades
                        </Typography>
                        <div style={{ height: 500, width: '100%' }}>
                            <DataGrid
                                density="compact"
                                components={{
                                    Toolbar: CustomToolbar,
                                }}
                                rows={state.tradeRows}
                                columns={columns}
                            />
                        </div>
                    </CardContent>
                </Card>
            </Grid>
        );
    }, [state.tradeRows])

    return MemoizedTradeTable

};