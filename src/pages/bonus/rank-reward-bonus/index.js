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
import axios from "axios";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      width: 250,
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    },
  },
};

const names = ["level1", "level2", "level3", "level4", "level5", "level6", "level7"];

const columns = [
  {
    flex: 0.1,
    minWidth: 105,
    field: "serialno",
    headerName: "#",
    renderCell: ({ row }) => <Typography sx={{ color: "text.secondary" }}></Typography>,
  },
  {
    flex: 0.1,
    minWidth: 105,
    field: "date",
    headerName: "DATE",
    renderCell: ({ row }) => <Typography sx={{ color: "text.secondary" }}></Typography>,
  },
  {
    flex: 0.1,
    minWidth: 105,
    field: "rankreward",
    headerName: "RANK REWARD BONUS ($)",
    renderCell: ({ row }) => <Typography sx={{ color: "text.secondary" }}></Typography>,
  },

  {
    flex: 0.1,
    minWidth: 105,
    field: "naration",
    headerName: "NARATION",
    renderCell: ({ row }) => <Typography sx={{ color: "text.secondary" }}></Typography>,
  },
];

const RankRewardBonus = () => {
  // ** State
  const [data, setData] = useState([]);
  const [value, setValue] = useState("");
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
  const [selectValue, setSelectValue] = useState([]);

  const handleChange = (event) => {
    setSelectValue(event.target.value);
  };

  //   useEffect(() => {
  //     axios.get("/pages/profile-table", { params: { q: value } }).then((response) => {
  //       setData(response.data);
  //     });
  //   }, [value]);

  const handleFilter = (val) => {
    setValue(val);
  };

  return data ? (
    <Card>
      <CardHeader
        title="RANK REWARD BONUS : $0.0000"
        titleTypographyProps={{ sx: { mb: [2, 0] } }}
        action={
          <CustomTextField
            value={value}
            placeholder="Search"
            onChange={(e) => handleFilter(e.target.value)}
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
        autoHeight
        pagination
        rows={data}
        rowHeight={62}
        columns={columns}
        pageSizeOptions={[5, 10]}
        disableRowSelectionOnClick
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />
    </Card>
  ) : (
    "No Data Available"
  );
};

export default RankRewardBonus;
