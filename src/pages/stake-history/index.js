// ** React Imports
import { useState, useEffect } from "react";

// ** MUI Components
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import { DataGrid } from "@mui/x-data-grid";

// ** Third Party Imports
import { useDispatch, useSelector } from "react-redux";
import { getStakeKGCHistory } from "src/store/apps/stake/stakeSlice";
import { capitalizeFirstLetter, formatNumber, kgcToUSDC, toFixedDecimal } from "src/constants/common";
import useGetUSDCTokens from "src/hooks/useGetUSDCTokens";
import { useRouter } from "next/router";

const columns = [
  {
    flex: 0.1,
    minWidth: 45,
    field: "serialno",
    headerName: "#",
    renderCell: ({ row }) => (
      <Typography sx={{ color: "text.secondary" }}>{row?.serialno}</Typography>
    ),
  },
  {
    flex: 0.1,
    minWidth: 105,
    field: "datetime",
    headerName: "DATE",
    renderCell: ({ row }) => (
      <Typography sx={{ color: "text.secondary" }}>{row?.datetime}</Typography>
    ),
  },
  {
    flex: 0.1,
    minWidth: 105,
    field: "package",
    headerName: "PACKAGE (BRC)",
    renderCell: ({ row }) => (
      <Typography sx={{ color: "text.secondary" }}>{row?.package} BRC</Typography>
    ),
  },
  {
    flex: 0.1,
    minWidth: 85,
    field: "usdc",
    headerName: "PACKAGE ($)",
    renderCell: ({ row }) => (
      <Typography sx={{ color: "text.secondary" }}>${row?.usdc}</Typography>
    ),
  },
  {
    flex: 0.1,
    minWidth: 105,
    field: "closedate",
    headerName: "CLOSE DATE",
    renderCell: ({ row }) => (
      <Typography sx={{ color: "text.secondary" }}>{row?.closedate}</Typography>
    ),
  },
];

const StakeHistory = () => {
  // ** State
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.login?.user);
  const router = useRouter();
  const { admin } = router.query;
  const userStakeHistoryData = useSelector(
    (state) => state?.stake?.stakeHistory
  );
  const { tokenBlnc: oneUSDC } = useGetUSDCTokens(1);
  const [userId, setUserId] = useState(null);
  const [userStakeHistory, setUserStakeHistory] = useState(null);
  const [paginationModel, setPaginationModel] = useState({
    page: 1,
    pageSize: 10,
  });
  const handlePageChange = (newPage) => {
    setPaginationModel((prev) => ({ ...prev, page: newPage?.page + 1 }));
  };
  const formattedData = userStakeHistory
    ? userStakeHistory?.stakes?.map((historyItem, index) => ({
      id: index + 1 + userStakeHistory?.paginate?.offset,
      serialno: index + 1 + userStakeHistory?.paginate?.offset,
      datetime: new Date(historyItem?.createdAt)?.toLocaleDateString(),
      package: historyItem?.amount ? formatNumber(historyItem?.amount, toFixedDecimal) : 0,
      usdc: historyItem?.transactionId?.fiatAmount || 0,
      closedate: new Date(historyItem?.endDate)?.toLocaleDateString(),
    }))
    : [];

  useEffect(() => {
    if (user) {
      setUserId(user?.data?._id);
    }
  }, [user]);

  useEffect(() => {
    if (admin) {
      dispatch(
        getStakeKGCHistory({
          userId: admin,
          page: paginationModel?.page,
          limit: paginationModel?.pageSize,
        })
      );
    }
    else if (userId) {
      dispatch(
        getStakeKGCHistory({
          userId,
          page: paginationModel?.page,
          limit: paginationModel?.pageSize,
        })
      );
    }
  }, [dispatch, userId, paginationModel, admin]);

  useEffect(() => {
    if (userStakeHistoryData && userStakeHistoryData?.data) {
      setUserStakeHistory(userStakeHistoryData?.data);
    }
  }, [userStakeHistoryData]);

  return (
    <Card>
      <CardHeader
        title={`TOTAL STAKING : $${userStakeHistory?.totalStakeAmount || 0}`}
        titleTypographyProps={{ sx: { mb: [2, 0] } }}
        sx={{
          py: 4,
          flexDirection: ["column", "row"],
          "& .MuiCardHeader-action": { m: 0 },
          alignItems: ["flex-start", "center"],
        }}
      />

      <DataGrid
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10, page: 0 },
          },
        }}
        autoHeight
        pagination
        rows={formattedData}
        rowHeight={62}
        pageSizeOptions={[]}
        columns={columns}
        disableRowSelectionOnClick
        paginationMode="server"
        onPaginationModelChange={(newPage) => handlePageChange(newPage)}
        rowCount={userStakeHistory?.paginate?.totalItems || 0}
      />
    </Card>
  );
};

export default StakeHistory;
