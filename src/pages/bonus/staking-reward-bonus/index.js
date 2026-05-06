// ** React Imports
import { useState, useEffect } from "react";

// ** MUI Components
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import { DataGrid } from "@mui/x-data-grid";

// ** Third Party Imports
import { useDispatch, useSelector } from "react-redux";
import { getStakingRewardBonusData } from "src/store/apps/bonus/bonusSlice";
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
    renderCell: ({ row }) => <Typography sx={{ color: "text.secondary" }}>{row?.date}</Typography>,
  },
  {
    flex: 0.1,
    minWidth: 105,
    field: "package",
    headerName: "PACKAGE",
    renderCell: ({ row }) => <Typography sx={{ color: "text.secondary" }}>${row?.package}</Typography>,
  },
  {
    flex: 0.1,
    minWidth: 105,
    field: "percent",
    headerName: "PERCENT (%)",
    renderCell: ({ row }) => <Typography sx={{ color: "text.secondary" }}>{row?.percent}</Typography>,
  },
  {
    flex: 0.1,
    minWidth: 105,
    field: "totalbonus",
    headerName: "TOTAL STAKING BONUS",
    renderCell: ({ row }) => <Typography sx={{ color: "text.secondary" }}>${row?.totalbonus}</Typography>,
  },
];

const StakingRewardBonus = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state?.getCurrentUser?.user?.data);
  const stakingRewardBonusData = useSelector(
    (state) => state?.bonus?.stakingRewardBonusData
  );
  const { tokenBlnc: oneUSDC } = useGetUSDCTokens(1);
  const [value, setValue] = useState("");
  const [userId, setUserId] = useState(null);
  const [stakingRewardBonus, setStakingRewardBonus] = useState(null);
  const [paginationModel, setPaginationModel] = useState({
    page: 1,
    pageSize: 10,
  });
  const handlePageChange = (newPage) => {
    setPaginationModel((prev) => ({ ...prev, page: newPage?.page + 1 }));
  };
  const formattedData = stakingRewardBonus && stakingRewardBonus?.data && stakingRewardBonus?.data?.length > 0
    ? stakingRewardBonus?.data?.map((item, index) => ({
        id: index + 1 + stakingRewardBonus?.paginate?.offset,
        serialno: index + 1 + stakingRewardBonus?.paginate?.offset,
        date:
        item?.createdAt &&
        new Date(item?.createdAt)?.toLocaleDateString(),
        package: oneUSDC && item?.stakeAmount ? `${kgcToUSDC(item?.stakeAmount, oneUSDC)}` : 0,
        percent: item?.percent || 'N/A',
        totalbonus: oneUSDC && item?.totalRewardAmount ? `${kgcToUSDC(item?.totalRewardAmount, oneUSDC)}` : 0,
      }))
    : [];

  useEffect(() => {
    if (currentUser) {
      setUserId(currentUser?._id);
    }
  }, [currentUser]);

  useEffect(() => {
    dispatch(
      getStakingRewardBonusData({
        page: paginationModel?.page,
        limit: paginationModel?.pageSize,
      })
    );
  }, [dispatch, paginationModel]);

  useEffect(() => {
    if (
      stakingRewardBonusData &&
      stakingRewardBonusData?.data
    ) {
      setStakingRewardBonus(stakingRewardBonusData);
    }
  }, [stakingRewardBonusData]);

  const handleFilter = (val) => {
    setValue(val);
  };

  return (
    <Card>
      <CardHeader
         title={`STAKING REWARD BONUS : $${stakingRewardBonus?.totalRewardAmount && oneUSDC ? kgcToUSDC(stakingRewardBonus?.totalRewardAmount, oneUSDC) : 0}`}
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
        columns={columns}
        disableRowSelectionOnClick
        paginationMode="server"
        onPaginationModelChange={(newPage) => handlePageChange(newPage)}
        rowCount={stakingRewardBonus?.paginate?.totalItems || 0}
      />
    </Card>
  );
};

export default StakingRewardBonus;