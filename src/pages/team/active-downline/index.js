// ** React Imports
import { useState, useEffect } from "react";

// ** MUI Components
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import { DataGrid } from "@mui/x-data-grid";

// ** Custom Component Import
import CustomTextField from "src/@core/components/mui/text-field";

// ** Third Party Imports
import { useDispatch, useSelector } from "react-redux";
import { teamDownlineActiveReferral } from "src/store/apps/team/teamSlice";
import { capitalizeFirstLetter, findHighestRankTillSeven, formatNumber, kgcToUSDC, renderStars, toFixedDecimal } from "src/constants/common";
import useGetUSDCTokens from "src/hooks/useGetUSDCTokens";
import { TextField } from "@mui/material";

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
    minWidth: 170,
    field: "userid",
    headerName: "USER ID",
    renderCell: ({ row }) => (
      <Typography sx={{ color: "text.secondary" }}>{row?.userid}</Typography>
    ),
  },
  {
    flex: 0.1,
    minWidth: 120,
    field: "username",
    headerName: "USER NAME",
    renderCell: ({ row }) => (
      <Typography sx={{ color: "text.secondary" }}>{row?.username}</Typography>
    ),
  },
  {
    flex: 0.1,
    minWidth: 160,
    field: "userrank",
    headerName: "USER RANK",
    renderCell: ({ row }) => (
      <Typography sx={{ color: "text.secondary" }}> {renderStars(row?.userrank , 7)}</Typography>
    ),
  },
  {
    flex: 0.1,
    minWidth: 160,
    field: "referrallevel",
    headerName: "REFERRAL LEVEL",
    renderCell: ({ row }) => (
      <Typography sx={{ color: "text.secondary" }}> {row?.referrallevel}</Typography>
    ),
  },
  {
    flex: 0.1,
    minWidth: 180,
    field: "regdate",
    headerName: "REGISTRATION DATE",
    renderCell: ({ row }) => (
      <>
        <Typography sx={{ color: "text.secondary" }}>{row?.regdate}</Typography>
      </>
    ),
  },
  {
    flex: 0.1,
    minWidth: 180,
    field: "activedate",
    headerName: "ACTIVATION DATE",
    renderCell: ({ row }) => (
      <Typography sx={{ color: "text.secondary" }}>
        {row?.activedate}
      </Typography>
    ),
  },
  {
    flex: 0.1,
    minWidth: 120,
    field: "package",
    headerName: "STAKING AMOUNT",
    renderCell: ({ row }) => (
      <Typography sx={{ color: "text.secondary" }}>${row?.package}</Typography>
    ),
  },
];

const ActiveDownLineReferral = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state?.getCurrentUser?.user?.data);
  const activeDownlineReferralData = useSelector(
    (state) => state?.team?.teamDownlineActiveReferral
  );
  const { tokenBlnc: oneUSDC } = useGetUSDCTokens(1);
  const [value, setValue] = useState("");
  const [userId, setUserId] = useState(null);
  const [activeDownlineReferral, setActiveDownlineReferral] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
  const [paginationModel, setPaginationModel] = useState({
    page: 1,
    pageSize: 10,
  });
  const handlePageChange = (newPage) => {
    setPaginationModel((prev) => ({ ...prev, page: newPage?.page + 1 }));
  };
  const formattedData = activeDownlineReferral
    ? activeDownlineReferral?.data?.map((item, index) => ({
      id: index + 1 + activeDownlineReferral?.paginate?.offset,
      serialno: index + 1 + activeDownlineReferral?.paginate?.offset,
      userid:
        item?.user?._id?.slice(0, 6) + "..." + item?.user?._id?.slice(-6),
      username: item?.user?.userName,
      userrank: item?.userRankStars ? item?.userRankStars : 0 ,
      referrallevel: item?.level ? item?.level : 'N/A',
      regdate:
        item?.latestStakeDate ?
        new Date(item?.latestStakeDate)?.toLocaleDateString() : 'N/A',
      activedate: new Date(item?.user?.createdAt)?.toLocaleDateString(),
      package: oneUSDC && item?.totalStakeAmount ? kgcToUSDC(item?.totalStakeAmount, oneUSDC) : 0,
      }))
    : [];

  useEffect(() => {
    if (currentUser) {
      setUserId(currentUser?._id);
    }
  }, [currentUser]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
    if (paginationModel?.page != null && paginationModel?.pageSize != null) {
    dispatch(
      teamDownlineActiveReferral({
        page: paginationModel?.page,
        limit: paginationModel?.pageSize,
        userName:searchQuery
      })
    );
     }
  }, 500); // 500ms debounce delay

  return () => clearTimeout(delayDebounce); // cleanup timeout on each keystroke
  }, [dispatch, paginationModel,searchQuery]);

  useEffect(() => {
    if (
    activeDownlineReferralData
    ) {
      setActiveDownlineReferral(activeDownlineReferralData);
    }
  }, [activeDownlineReferralData]);

  return (
    <Card>
      <CardHeader
      title={`DOWNLINE : $${oneUSDC && activeDownlineReferral?.totalBussiness ? kgcToUSDC(activeDownlineReferral?.totalBussiness, oneUSDC) : 0}`}
        titleTypographyProps={{ sx: { mb: [2, 0] } }}
        action={
            <TextField
              size="small"
              placeholder="Search username"
              variant="outlined"
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ minWidth: 200 }}
            />
          }
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
        rowCount={activeDownlineReferral?.paginate?.totalItems || 0}
      />
    </Card>
  );
};

export default ActiveDownLineReferral;
