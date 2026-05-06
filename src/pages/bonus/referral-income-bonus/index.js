// ** React Imports
import { useState, useEffect } from "react";

// ** MUI Components
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import { DataGrid } from "@mui/x-data-grid";

// ** Third Party Imports
import { useDispatch, useSelector } from "react-redux";
import { getReferralIncomeBonusData } from "src/store/apps/bonus/bonusSlice";
import { kgcToUSDC } from "src/constants/common";
import useGetUSDCTokens from "src/hooks/useGetUSDCTokens";

const columns = [
  {
    flex: 0.1,
    minWidth: 20,
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
    field: "fromUser",
    headerName: "FROM USER ID",
    renderCell: ({ row }) => (
      <Typography sx={{ color: "text.secondary" }}>{row?.fromUser}</Typography>
    ),
  },
  {
    flex: 0.1,
    minWidth: 105,
    field: "stakeBonus",
    headerName: "REFERRAL INCOME BONUS",
    renderCell: ({ row }) => (
      <Typography sx={{ color: "text.secondary" }}>
        ${row?.stakeBonus}
      </Typography>
    ),
  },
  {
    flex: 0.1,
    minWidth: 105,
    field: "percent",
    headerName: "PERCENT (%)",
    renderCell: ({ row }) => (
      <Typography sx={{ color: "text.secondary" }}>{row?.percent}</Typography>
    ),
  },
  {
    flex: 0.1,
    minWidth: 105,
    field: "totalStakeBonus",
    headerName: "TOTAL LEVEL BONUS",
    renderCell: ({ row }) => (
      <Typography sx={{ color: "text.secondary" }}>
        ${row?.totalStakeBonus}
      </Typography>
    ),
  },
];

const LevelBonus = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state?.getCurrentUser?.user?.data);
  const levelBonusData = useSelector(
    (state) => state?.bonus?.referralIncomeBonusData
  );
  const { tokenBlnc: oneUSDC } = useGetUSDCTokens(1);
  const [value, setValue] = useState("");
  const [userId, setUserId] = useState(null);
  const [levelBonus, setLevelBonus] = useState(null);
  const [paginationModel, setPaginationModel] = useState({
    page: 1,
    pageSize: 10,
  });

  const handlePageChange = (newPage) => {
    setPaginationModel((prev) => ({ ...prev, page: newPage?.page + 1 }));
  };

  const formattedData =
    levelBonus &&
    levelBonus?.data &&
    levelBonus?.data?.levelBonusData &&
    levelBonus?.data?.levelBonusData?.length > 0
      ? levelBonus?.data?.levelBonusData?.map((item, index) => ({
          id: index + 1 + levelBonus?.paginate?.offset,
          serialno: index + 1 + levelBonus?.paginate?.offset,
          date: item?.date && new Date(item?.date)?.toLocaleDateString(),
          fromUser: item?.fromUser,
          stakeBonus: oneUSDC && item?.stakeBonus ? kgcToUSDC(item?.stakeBonus, oneUSDC) : 0,
          percent: item?.percent,
          totalStakeBonus: oneUSDC && item?.totalStakeBonus ? kgcToUSDC(item?.totalStakeBonus, oneUSDC) : 0,
        }))
      : [];

  useEffect(() => {
    if (currentUser) {
      setUserId(currentUser?._id);
    }
  }, [currentUser]);

  useEffect(() => {
    dispatch(
      getReferralIncomeBonusData({
        page: paginationModel?.page,
        limit: paginationModel?.pageSize,
      })
    );
  }, [dispatch, paginationModel]);

  useEffect(() => {
    if (levelBonusData && levelBonusData?.data) {
      setLevelBonus(levelBonusData);
    }
  }, [levelBonusData]);

  return (
    <Card>
      <CardHeader
        title={`REFERRAL INCOME BONUS : $${oneUSDC && levelBonus?.data?.totalAmount ? kgcToUSDC(levelBonus?.data?.totalAmount, oneUSDC) : 0}`}
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
        rowCount={levelBonus?.paginate?.totalItems || 0}
      />
    </Card>
  );
};

export default LevelBonus;