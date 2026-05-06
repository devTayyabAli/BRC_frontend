// ** React Imports
import { useState, useEffect } from "react";

// ** MUI Components
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import { DataGrid } from "@mui/x-data-grid";

// ** Third Party Imports
import { useDispatch, useSelector } from "react-redux";
import { getLeadershipBonusData } from "src/store/apps/bonus/bonusSlice";
import useGetUSDCTokens from "src/hooks/useGetUSDCTokens";
import { findHighestRankTillSeven, kgcToUSDC, renderStars } from "src/constants/common";

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
    field: "rank",
    headerName: "RANK",
    renderCell: ({ row }) => (
      <Typography sx={{ color: "text.secondary" }}>{row?.rank}</Typography>
    ),
  },
  {
    flex: 0.1,
    minWidth: 105,
    field: "leadershipbonus",
    headerName: "LEADERSHIP BONUS",
    renderCell: ({ row }) => (
      <Typography sx={{ color: "text.secondary" }}>
        ${row?.leadershipbonus}
      </Typography>
    ),
  },
];

const LeadershipBonus = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state?.getCurrentUser?.user?.data);
  const leadershipBonusData = useSelector(
    (state) => state?.bonus?.leadershipBonusData
  );
  const { tokenBlnc: oneUSDC } = useGetUSDCTokens(1);
  const [userId, setUserId] = useState(null);
  const [leadershipBonus, setLeadershipBonus] = useState(null);
  const [paginationModel, setPaginationModel] = useState({
    page: 1,
    pageSize: 10,
  });

  const handlePageChange = (newPage) => {
    setPaginationModel((prev) => ({ ...prev, page: newPage?.page + 1 }));
  };

  const formattedData =
    leadershipBonus &&
    leadershipBonus?.data &&
    leadershipBonus?.data?.userOtherRewardData &&
    leadershipBonus?.data?.userOtherRewardData?.length > 0
      ? leadershipBonus?.data?.userOtherRewardData?.map((item, index) => ({
          id: index + 1 + leadershipBonus?.paginate?.offset,
          serialno: index + 1 + leadershipBonus?.paginate?.offset,
          date: item?.date && new Date(item?.date)?.toLocaleDateString(),
          rank: item?.rankTitle ? item?.rankTitle : 'N/A',
          leadershipbonus: oneUSDC && item?.totalBonus ? kgcToUSDC(item?.totalBonus, oneUSDC) : 0,
        }))
      : [];

  useEffect(() => {
    if (currentUser) {
      setUserId(currentUser?._id);
    }
  }, [currentUser]);

  useEffect(() => {
    dispatch(
      getLeadershipBonusData({
        page: paginationModel?.page,
        limit: paginationModel?.pageSize,
      })
    );
  }, [dispatch, paginationModel]);

  useEffect(() => {
    if (leadershipBonusData && leadershipBonusData?.data) {
      setLeadershipBonus(leadershipBonusData);
    }
  }, [leadershipBonusData]);

  return (
    <Card>
      <CardHeader
        title={`LEADERSHIP BONUS : $${oneUSDC && leadershipBonus?.data?.totalAmount ? kgcToUSDC(leadershipBonus?.data?.totalAmount, oneUSDC) : 0}`}
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
        rowCount={leadershipBonus?.paginate?.totalItems || 0}
      />
    </Card>
  );
};

export default LeadershipBonus;