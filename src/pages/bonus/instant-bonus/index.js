// ** React Imports
import { useState, useEffect } from "react";
// ** MUI Components
import { Card, Typography, CardHeader, Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
// ** Third Party Imports
import { useDispatch, useSelector } from "react-redux";
import { getInstantBonus } from "src/store/apps/bonus/bonusSlice";
import format from "date-fns/format";
import { kgcToUSDC } from "src/constants/common";
import useGetUSDCTokens from "src/hooks/useGetUSDCTokens";

const InstantBonus = () => {
    // ** State
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 5,
    });
    const dispatch = useDispatch();
    const { instantBonus, status } = useSelector((state) => state.bonus);
    const { tokenBlnc: oneUSDC } = useGetUSDCTokens(1);

    useEffect(() => {
        dispatch(
            getInstantBonus({
                page: paginationModel.page + 1,
                limit: paginationModel.pageSize,
            }),
        );
    }, [dispatch, paginationModel]);

    const columns = [
        {
            flex: 0.1,
            minWidth: 105,
            field: "date",
            headerName: "DATE",
            renderCell: ({ row }) => {
                const date = new Date(row?.date);
                return (
                    <Typography sx={{ color: "text.secondary" }}>
                        {format(date, "dd-MMM-yyyy")}
                    </Typography>
                );
            },
        },
        {
            flex: 0.1,
            minWidth: 105,
            field: "package",
            headerName: "PACKAGE",
            renderCell: ({ row }) => (
                <Typography sx={{ color: "text.secondary" }}>
                    {row?.package ? `$${kgcToUSDC(row?.package, oneUSDC)}` : `$${0}`}
                </Typography>
            ),
        },
        {
            flex: 0.1,
            minWidth: 105,
            field: "percent",
            headerName: "PERCENT (%)",
            renderCell: ({ row }) => (
                <Typography sx={{ color: "text.secondary" }}>
                    {row?.percent ?? "0"}
                </Typography>
            ),
        },
        {
            flex: 0.1,
            minWidth: 105,
            field: "totalStakeBonus",
            headerName: "TOTAL INSTANT BONUS",
            renderCell: ({ row }) => (
                <Typography sx={{ color: "text.secondary" }}>
                    {row?.totalStakeBonus ? `$${kgcToUSDC(row?.totalStakeBonus, oneUSDC)}` : `$${0}`}
                </Typography>
            ),
        },
    ];

    return status === "loading" ? (
        "Loading . . ."
    ) : (
        <Card>
            <CardHeader
                title={`INSTANT BONUS : $${instantBonus?.data?.totalAmount ? kgcToUSDC(instantBonus?.data?.totalAmount, oneUSDC)  : 0}`}
                titleTypographyProps={{ sx: { mb: [2, 0] } }}
                sx={{
                    py: 4,
                    flexDirection: ["column", "row"],
                    alignItems: ["flex-start", "center"],
                }}
            />
            <DataGrid
                getRowId={(row) => row?.date}
                autoHeight
                pagination
                paginationMode="server"
                rowCount={instantBonus?.paginate?.totalItems ?? 0}
                rows={instantBonus?.data?.levelBonusData ?? []}
                rowHeight={62}
                columns={columns}
                pageSizeOptions={[]}
                disableRowSelectionOnClick
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
            />
        </Card>
    );
};
export default InstantBonus;