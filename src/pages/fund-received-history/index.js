// ** React Imports
import { useState, useEffect } from "react";

// ** MUI Components
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import { DataGrid } from "@mui/x-data-grid";

// ** Third Party Imports
import { useDispatch, useSelector } from "react-redux";
import { fundsReceiveHistory } from "src/store/apps/transaction/transactionSlice";
import { kgcToUSDC } from "src/constants/common";
import useGetUSDCTokens from "src/hooks/useGetUSDCTokens";

const columns = [
  {
    flex: 0.1,
    minWidth: 105,
    field: "serialno",
    headerName: "#",
    renderCell: ({ row }) => (
      <Typography sx={{ color: "text.secondary" }}>{row?.serialno}</Typography>
    ),
  },
  {
    flex: 0.1,
    minWidth: 105,
    field: "date",
    headerName: "DATE",
    renderCell: ({ row }) => (
      <Typography sx={{ color: "text.secondary" }}>{row?.date}</Typography>
    ),
  },
  {
    flex: 0.1,
    minWidth: 105,
    field: "fromuserid",
    headerName: "From USER ID",
    renderCell: ({ row }) => (
      <Typography sx={{ color: "text.secondary" }}>
        {row?.fromuserid}
      </Typography>
    ),
  },
  {
    flex: 0.1,
    minWidth: 105,
    field: "fromusername",
    headerName: "FROM USER NAME",
    renderCell: ({ row }) => (
      <Typography sx={{ color: "text.secondary" }}>
        {row?.fromusername}
      </Typography>
    ),
  },

  {
    flex: 0.1,
    minWidth: 150,
    field: "amount",
    headerName: "AMOUNT",
    renderCell: ({ row }) => (
      <>
        <Typography sx={{ color: "text.secondary" }}>${row?.amount}</Typography>
      </>
    ),
  },
];

const FundsReceiveHistory = () => {
  // ** State
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.login?.user);
  const fundsReceiveHistoryData = useSelector(
    (transaction) => transaction?.fundsTransfer?.fundsReceiveHistory
  );
  const { tokenBlnc: oneUSDC } = useGetUSDCTokens(1);
  const [value, setValue] = useState("");
  const [userId, setUserId] = useState(null);
  const [fundReceiveHistory, setFundReceiveHistory] = useState(null);
  const [paginationModel, setPaginationModel] = useState({
    page: 1,
    pageSize: 10,
  });

  const handlePageChange = (newPage) => {
    setPaginationModel((prev) => ({ ...prev, page: newPage?.page + 1 }));
  };

  const formattedData = fundReceiveHistory
    ? fundReceiveHistory?.data?.map((historyItem, index) => ({
        id: index + 1 + fundReceiveHistory?.paginate?.offset,
        serialno: index + 1 + fundReceiveHistory?.paginate?.offset,
        date: new Date(historyItem?.createdAt)?.toLocaleDateString(),
        fromuserid:
        historyItem?.fromUserId?._id?.slice(0, 10) +
        "..." +
        historyItem?.fromUserId?._id?.slice(-10),
        fromusername: historyItem?.fromUserId?.userName,
        amount: historyItem?.transactionId?.fiatAmount || 0,
      }))
    : [];

  useEffect(() => {
    if (user) {
      setUserId(user?.data?._id);
    }
  }, [user]);

  useEffect(() => {
    if (userId) {
      dispatch(
        fundsReceiveHistory({
          userId,
          page: paginationModel?.page,
          limit: paginationModel?.pageSize,
        })
      );
    }
  }, [dispatch, userId, paginationModel]);

  useEffect(() => {
    if (fundsReceiveHistoryData && fundsReceiveHistoryData?.data) {
      setFundReceiveHistory(fundsReceiveHistoryData?.data);
    }
  }, [fundsReceiveHistoryData]);

  return (
    <Card>
      <CardHeader
        title={`FUND RECEIVE : $${fundReceiveHistory?.totalAmount || 0}`}
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
        rowCount={fundReceiveHistory?.paginate?.totalItems || 0}
      />
    </Card>
  );
};

export default FundsReceiveHistory;
