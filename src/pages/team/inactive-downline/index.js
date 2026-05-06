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
import { teamDownlinePendingReferral } from "src/store/apps/team/teamSlice";
import { capitalizeFirstLetter, findHighestRankTillSeven, formatNumber, kgcToUSDC, renderStars, toFixedDecimal } from "src/constants/common";
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
  {
    flex: 0.1,
    minWidth: 80,
    field: "status",
    headerName: "STATUS",
    renderCell: ({ row }) => (
      <Typography sx={{ color: "text.secondary" }}>
        {capitalizeFirstLetter(row?.status)}
      </Typography>
    ),
  },
];

const InActiveDownLineReferral = () => {
  const dispatch = useDispatch();
  const inActiveDownlineReferralData = useSelector(
    (state) => state?.team?.teamDownlinePendingReferral
  );
  const { tokenBlnc: oneUSDC } = useGetUSDCTokens(1);
  const [inActiveDownlineReferral, setInActiveDownlineReferral] =
    useState(null);
  const [paginationModel, setPaginationModel] = useState({
    page: 1,
    pageSize: 10,
  });
  const handlePageChange = (newPage) => {
    setPaginationModel((prev) => ({ ...prev, page: newPage?.page + 1 }));
  };
  const formattedData = inActiveDownlineReferral
    ? inActiveDownlineReferral?.data?.map((item, index) => ({
      id: index + 1 + inActiveDownlineReferral?.paginate?.offset,
      serialno: index + 1 + inActiveDownlineReferral?.paginate?.offset,
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
      status: item?.user?.status,
      }))
    : [];

  useEffect(() => {
    dispatch(
      teamDownlinePendingReferral({
        page: paginationModel?.page,
        limit: paginationModel?.pageSize,
      })
    );
  }, [dispatch, paginationModel]);

  useEffect(() => {
    if (
      inActiveDownlineReferralData &&
      inActiveDownlineReferralData?.data &&
      inActiveDownlineReferralData?.data?.length > 0
    ) {
      setInActiveDownlineReferral(inActiveDownlineReferralData);
    }
  }, [inActiveDownlineReferralData]);

  return (
    <Card>
      <CardHeader
         title={`IN ACTIVE DOWNLINE : $${oneUSDC && inActiveDownlineReferral?.totalBussiness ? kgcToUSDC(inActiveDownlineReferral?.totalBussiness, oneUSDC) : 0}`}
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
        rowCount={inActiveDownlineReferral?.paginate?.totalItems || 0}
      />
    </Card>
  );
};

export default InActiveDownLineReferral;
