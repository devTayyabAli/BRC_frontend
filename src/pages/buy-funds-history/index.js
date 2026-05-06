// ** React Imports
import { useState, useEffect } from "react";

// ** MUI Components
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import { DataGrid } from "@mui/x-data-grid";

// ** Third Party Imports
import { useDispatch, useSelector } from "react-redux";
import { buyFundsHistory, fundsTransferHistory } from "src/store/apps/transaction/transactionSlice";
import useGetUSDCTokens from "src/hooks/useGetUSDCTokens";
import { kgcToUSDC } from "src/constants/common";

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
    minWidth: 150,
    field: "amount",
    headerName: "AMOUNT (BRC)",
    renderCell: ({ row }) => (
      <>
        <Typography sx={{ color: "text.secondary" }}>{row?.amount}</Typography>
      </>
    ),
  },
  {
    flex: 0.1,
    minWidth: 150,
    field: "transaction",
    headerName: "AMOUNT ($)",
    renderCell: ({ row }) => (
      <>
        <Typography sx={{ color: "text.secondary" }}>{row?.transaction}</Typography>
      </>
    ),
  },
];

const BuyFundsHistory = () => {
  // ** State
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.login?.user);
  const buyFundsTransferHistoryData = useSelector(
    (transaction) => transaction?.fundsTransfer?.buyFunds
  );
  const { tokenBlnc: oneUSDC } = useGetUSDCTokens(1);
  const [value, setValue] = useState("");
  const [userId, setUserId] = useState(null);
  const [buyFundTransferHistory, setBuyFundTransferHistory] = useState(null);
  const [paginationModel, setPaginationModel] = useState({
    page: 1,
    pageSize: 10,
  });
  const handlePageChange = (newPage) => {
    setPaginationModel((prev) => ({ ...prev, page: newPage?.page + 1 }));
  };

  const formattedData = buyFundTransferHistory
    ? buyFundTransferHistory?.data?.map((historyItem, index) => ({
        id: index + 1 + buyFundTransferHistory?.paginate?.offset,
        serialno: index + 1 + buyFundTransferHistory?.paginate?.offset,
        date: new Date(historyItem?.createdAt)?.toLocaleDateString(),
        amount: historyItem?.amount || 0,
        transaction: historyItem?.transaction?.fiatAmount || 0,
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
        buyFundsHistory({
          userId,
          page: paginationModel?.page,
          limit: paginationModel?.pageSize,
        })
      );
    }
  }, [dispatch, userId, paginationModel]);

  useEffect(() => {
    if (buyFundsTransferHistoryData && buyFundsTransferHistoryData?.data) {
      setBuyFundTransferHistory(buyFundsTransferHistoryData);
    }
  }, [buyFundsTransferHistoryData]);

  const handleFilter = (val) => {
    setValue(val);
  };
  return (
    <Card>
      <CardHeader
        title={`TOTAL FUNDS BOUGHT : $${buyFundTransferHistory?.sum || 0}`}
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
        rowCount={buyFundTransferHistory?.paginate?.totalItems || 0}
      />
    </Card>
  );
};

export default BuyFundsHistory;