// ** React Imports
import { useState, useEffect } from "react";

// ** MUI Components
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CardHeader from "@mui/material/CardHeader";
import Button from "@mui/material/Button";
import { DataGrid } from "@mui/x-data-grid";
import LinearProgress from "@mui/material/LinearProgress";

// ** Third Party Imports
import { getLevelBonus } from "src/store/apps/levelBonus/levelBonusSlice";
import { useDispatch, useSelector } from "react-redux";
import { kgcToUSDC } from "src/constants/common";
import useGetUSDCTokens from "src/hooks/useGetUSDCTokens";

const columns = [
  {
    flex: 0.1,
    minWidth: 105,
    field: "serialno",
    headerName: "SR. NO",
    renderCell: ({ row }) => (
      <Typography sx={{ color: "text.secondary",fontSize:"20px" }}>{row?.id}</Typography>
    ),
  },
  {
    flex: 0.1,
    minWidth: 105,
    field: "level",
    headerName: "LEVEL",
    renderCell: ({ row }) => (
      <Typography sx={{ color: "text.secondary",fontSize:"20px" }}>{row?.level}</Typography>
    ),
  },

  {
    flex: 0.2,
    minWidth: 105,
    field: "referral",
    headerName: "REQUIRED ACTIVE REFERRAL TEAM",
    renderCell: ({ row }) => (
      <Typography sx={{ color: "text.secondary",fontSize:"20px",textAlign:'center' }}>{row?.referral}</Typography>
    ),
  },

  {
    flex: 0.2,
    minWidth: 150,
    field: "percent",
    headerName: "STAKING REWARD (%)",
    renderCell: ({ row }) => (
      <>
        <LinearProgress
          color="primary"
          value={row?.percent}
          variant="determinate"
          sx={{
            mr: 3,
            height: 8,
            width: "100%",
            borderRadius: 8,
            backgroundColor: "background.default",
            "& .MuiLinearProgress-bar": {
              borderRadius: 8,
            },
          }}
        />
        <Typography
          sx={{ color: "text.secondary",fontSize:"20px" }}
        >{`${row?.percent}%`}</Typography>
      </>
    ),
  },
  {
    flex: 0.1,
    minWidth: 100,
    sortable: false,
    field: "status",
    headerName: "STATUS",
    renderCell: ({ row }) => (
      <Button
        variant="info"
        sx={{
          background: `${row?.status === true ? "#90EE90" : "#FF7F7F"}`,
          color: "#fff",
          fontSize:"20px",
          "&:hover": {
            background: `${row?.status === true ? "#90EE90" : "#FF7F7F"}`,
            color: "#fff",
          },
        }}
      >
        {row?.status === true ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M7 7a5 5 0 0 1 9.843-1.25a1 1 0 0 1-1.937.5A3 3 0 0 0 9 7v3h8.4c.88 0 1.6.72 1.6 1.6v7c0 1.32-1.08 2.4-2.4 2.4H7.4C6.08 21 5 19.92 5 18.6v-7c0-.88.72-1.6 1.6-1.6H7zm5 5.25a1.75 1.75 0 0 0-.75 3.332V18a.75.75 0 0 0 1.5 0v-2.418A1.75 1.75 0 0 0 12 12.25" clip-rule="evenodd"/></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M7.5 9V6.5a4.5 4.5 0 0 1 9 0V9H19a1 1 0 0 1 1 .999V21a.997.997 0 0 1-1 1H5a1 1 0 0 1-1-.999V10a.997.997 0 0 1 1-1zM9 9h6V6.5a3 3 0 0 0-6 0zm2.4 6.875V18h1.2v-2.125a1.5 1.5 0 1 0-1.2 0"/></svg>}
      </Button>
    ),
  },
];

const AnalyticsProject = () => {
  const dispatch = useDispatch();
  const levelBonusData = useSelector((state) => state?.levelBonus?.levelBonus);
  const currentUser = useSelector((state) => state?.getCurrentUser?.user?.data);
  const [levelBonus, setLevelBonus] = useState(null);
  const [nextUnlockLevel, setNextUnlockLevel] = useState('');
  const [formattedData, setFormattedData] = useState([]);
  const [formattedDirectBusinessIn30Day, setFormattedDirectBusinessIn30Day] = useState(null);
  const { tokenBlnc: oneUSDC } = useGetUSDCTokens(1);

  useEffect(() => {
    if (levelBonusData &&
      levelBonusData?.incomeLevelBonus &&
      levelBonusData?.incomeLevelBonus?.length > 0
    ) {
      let nextUnlockLevelCondition = '';
      setFormattedData(levelBonusData?.incomeLevelBonus?.map((item, index) => {
        const response = {
          id: index + 1,
          serialno: index + 1,
          level: item?.title,
          referral: item?.minimumRequiredReferrals,
          percent: (levelBonusData?.unLock?.isUnlock === true && item?.title === 'L2') ? item?.maximumRewardPercentage : item?.minimumRewardPercentage,
          status: (levelBonusData?.unLock?.isUnlock === true && item?.title === 'L2') ? true : item?.unlocked,
        }

        if (nextUnlockLevelCondition == '' && (
          (!levelBonusData?.unLock?.isUnlock && item?.title === 'L2') || (item?.title !== 'L2' && !response?.status)
        )) {
          nextUnlockLevelCondition = item?.title
        }

        return response;
      }));

      setNextUnlockLevel(nextUnlockLevelCondition);
      setLevelBonus(levelBonusData);
    }
  }, [levelBonusData]);

  useEffect(() => {
    if (levelBonus && levelBonus?.unLock?.directBusinessIn30Days) {
      const [obtainValue, totalValue] = levelBonus?.unLock?.directBusinessIn30Days?.split('/');
      const obtainedUSDCValue = kgcToUSDC(obtainValue, oneUSDC);
      const totalUSDCValue = kgcToUSDC(totalValue, oneUSDC);
      const formattedDirectBusinessIn30Days = `$${obtainedUSDCValue}/$${totalUSDCValue}`;
      formattedDirectBusinessIn30Days && setFormattedDirectBusinessIn30Day(formattedDirectBusinessIn30Days);
    }
  }, [levelBonus]);


  useEffect(() => {
    dispatch(getLevelBonus());
  }, []);

  return (
    <Card>
      <CardHeader
        title="Level Bonus Un-Lock Condition"
        titleTypographyProps={{ sx: { mb: [2, 0] } }}
        sx={{
          py: 4,
          flexDirection: ["column", "row"],
          "& .MuiCardHeader-action": { m: 0 },
          alignItems: ["flex-start", "center"],
        }}
      />

      <Box sx={{ px: 6, display: "flex", flexDirection: "column", mb: 6 }}>
        <Typography variant="p">User ID : {currentUser?._id}</Typography>
        <Typography variant="p">User Name : {currentUser?.userName}</Typography>

        {nextUnlockLevel === 'L2' && !levelBonus?.unLock?.isUnlock && (
          <>
            <Typography variant="p">
              Activation Date:{" "}
              {levelBonus?.unLock?.activationDate
                ? new Date(levelBonus?.unLock?.activationDate)?.toLocaleDateString()
                : "N/A"}
            </Typography>
            <Typography variant="p">
              Direct Active Referrals:{" "}
              {levelBonus?.unLock?.directActiveReferrals}
            </Typography>
            <Typography variant="p">
              All Active Referrals:{" "}
              {levelBonus?.unLock?.allActiveReferrals}
            </Typography>
            <Typography variant="p">
              Direct Business in 30 days:{" "}
              {formattedDirectBusinessIn30Day}
            </Typography>
          </>
        )}
      </Box>

      <DataGrid
        autoHeight
        rows={formattedData}
        rowHeight={62}
        columns={columns}
        pageSizeOptions={[5, 10]}
        disableRowSelectionOnClick
        rowCount={levelBonus?.incomeLevelBonus?.length || 0}
      />
    </Card>
  );
};

export default AnalyticsProject;
