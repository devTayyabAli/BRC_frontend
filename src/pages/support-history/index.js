// ** React Imports
import React, { useState, useEffect } from "react";

// ** MUI Components
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import { DataGrid } from "@mui/x-data-grid";

// ** Third Party Imports
import { useDispatch, useSelector } from "react-redux";
import { fundsTransferHistory } from "src/store/apps/transaction/transactionSlice";
import useGetUSDCTokens from "src/hooks/useGetUSDCTokens";
import { kgcToUSDC } from "src/constants/common";
import CustomChip from 'src/@core/components/mui/chip'
import { Box, Button, IconButton, Menu, MenuItem } from "@mui/material";
import Icon from 'src/@core/components/icon'
import { useRouter } from "next/router";
import { deleteSupportTicketsById, getSupportTicketsByUserId } from "src/store/apps/support/supportTicketsSlice";
import { color } from "@mui/system";
import Customizer from "src/@core/components/customizer";
import EditTicket from "../support/EditTicket";
import toast from "react-hot-toast";
import ViewTicket from "../support/ViewTicket";



const statusColors = {
    ToDo: {
        bgColor: "#007bff", // Bootstrap Primary Blue
        textColor: "#ffffff" // White
    },
    Pending: {
        bgColor: "#fff9c4", // Bootstrap Warning Yellow
        textColor: "#f57f17" // Black
    },
    Completed: {
        bgColor: "#28a745", // Bootstrap Success Green
        textColor: "#ffffff" // White
    },
    Failed: {
        bgColor: "#dc3545", // Bootstrap Danger Red
        textColor: "#ffffff" // White
    }
};

const priorityColors = {
    Low: {
        bgColor: "#e0f7fa", // Light cyan
        textColor: "#00796b" // Teal
    },
    Medium: {
        bgColor: "#fff9c4", // Light yellow
        textColor: "#f57f17" // Orange
    },
    Urgent: {
        bgColor: "#ffe0b2", // Light orange
        textColor: "#e65100" // Dark orange
    },
    "Critical Error": {
        bgColor: "#ffccbc", // Light red
        textColor: "#c62828" // Dark red
    }
};



const PriorityLabel = ({ priority }) => {
    const { bgColor, textColor } = priorityColors[priority] || {
        bgColor: "#ffffff", // Default color
        textColor: "#000000" // Default text color
    };
    return (
        <CustomChip
            // skin='light'
            color='success'
            sx={{
                fontWeight: 500, borderRadius: 1, width: "7rem",
                backgroundColor: (bgColor),
                color: textColor, fontSize: theme => theme.typography.body2.fontSize
            }}
            label={
                <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 1 } }}>
                    <span>{priority}</span>
                </Box>
            }
        />
    );
};
const StatusLabel = ({ status }) => {
    const { bgColor, textColor } = statusColors[status] || {
        bgColor: "#ffffff", // Default color
        textColor: "#000000" // Default text color
    };

    return (
        <CustomChip
            skin='light'
            color='success'
            sx={{ fontWeight: 500, borderRadius: 1, color: textColor, backgroundColor: bgColor, fontSize: theme => theme.typography.body2.fontSize }}
            label={
                <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 1 } }}>
                    {/* <Icon icon='tabler:arrow-up' fontSize='1rem' /> */}
                    <span>{status == "ToDo" ? "Waiting" : status}</span>
                </Box>
            }
        />
    );
};
const options = [
    'View Ticket',
    // 'Edit Ticket',
    "Delete Ticket"
]








const SupportHistory = () => {
    // ** State
    const dispatch = useDispatch();
    const router = useRouter()
    const user = useSelector((state) => state?.login?.user);
    const { getSupportTicketsByUserIdValue, editSupportTicketValue, deleteSupportTicketsByIdValue, loading } = useSelector((state) => state?.support);
    const [anchorEl, setAnchorEl] = useState(null)
    const [open, setOpen] = useState(false)
    const [selectedTicket, setselectedTicket] = useState({})

    const [openView, setOpenView] = useState(false)

    const handleClick = event => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const [paginationModel, setPaginationModel] = useState({
        page: 1,
        pageSize: 10,
    });

    const columns = [
        // {
        //     flex: 0,
        //     minWidth: 50,
        //     field: "id",
        //     headerName: "#",
        //     renderCell: ({ row }) => (
        //         <Typography sx={{ color: "text.secondary" }}>{row?.id}</Typography>
        //     ),
        // },
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
            minWidth: 50,
            field: "userName",
            headerName: "USER NAME",
            renderCell: ({ row }) => (
                <Typography sx={{ color: "text.secondary" }}>
                    {row?.userName}
                </Typography>
            ),
        },
        {
            flex: 0.15,
            minWidth: 205,
            field: "subject",
            headerName: "SUBJECT",
            renderCell: ({ row }) => (
                <Typography sx={{ color: "text.secondary" }}>{row?.subject}</Typography>
            ),
        },

        {
            flex: 0.12,
            minWidth: 50,
            field: "priority",
            headerName: "PRIORTY",
            renderCell: ({ row }) => (

                <PriorityLabel priority={row?.priority} />

            )

        },
        {
            flex: 0.07,
            minWidth: 50,
            field: "status",
            headerName: "STATUS",
            renderCell: ({ row }) => (
                <StatusLabel status={row?.status} />
            ),
        },
        {
            flex: 0.05,
            minWidth: 50,
            field: "action",
            headerName: "",
            renderCell: ({ row }) => (
                <>
                    <IconButton onClick={(e) => { handleClick(e); setselectedTicket(row) }}>
                        <Icon icon='tabler:dots-vertical' />
                    </IconButton>

                    <Menu
                        keepMounted
                        id='long-menu'
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        open={Boolean(anchorEl)}
                    // PaperProps={{
                    //     style: {
                    //         maxHeight:  4.5
                    //     }
                    // }}
                    >
                        {options.map(option => (
                            <MenuItem key={option} selected={option === 'Pyxis'} onClick={() => {
                                if (option == "Edit Ticket") {
                                    setAnchorEl(false)
                                    setOpen(true);
                                } else if (option == "Delete Ticket") {
                                    setAnchorEl(false)
                                    handleDelete(row?.id)
                                } else if (option == "View Ticket") {
                                    setAnchorEl(false)
                                    setOpenView(true)

                                }
                            }}>
                                {option}
                            </MenuItem>
                        ))}
                    </Menu>


                </>
            ),
        },
    ];

    const handleDelete = async (id) => {
        try {
            let res = await dispatch(deleteSupportTicketsById(selectedTicket?.id))
            if (res.payload.success) {
                toast.success(res.payload.message)
                dispatch(getSupportTicketsByUserId(user?.data?._id))
            }

        } catch (error) {
            console.log("Error", error)
        }
    }


    useEffect(() => {
        dispatch(getSupportTicketsByUserId(user?.data?._id))
    }, [dispatch, deleteSupportTicketsByIdValue, editSupportTicketValue])


    const [tickets, setTickets] = useState([]);

    useEffect(() => {

        const formattedTickets = getSupportTicketsByUserIdValue.map((ticket, index) => ({
            id: ticket?._id,
            userId: ticket.userId._id,
            userName: ticket.userId.userName,
            subject: ticket.subject,
            description: ticket.description,
            priority: ticket.priority,
            status: ticket.status,
            media: ticket.picturesOrVideos.map(media => ({
                type: media.type,
                url: media.url,
                name: media.name,
                size: media.size
            })),
            date: new Date(ticket.createdAt).toLocaleDateString(),
            updatedAt: new Date(ticket.updatedAt).toLocaleDateString(),
        }));

        // Set the formatted tickets into state
        setTickets(formattedTickets);

    }, [getSupportTicketsByUserIdValue, deleteSupportTicketsByIdValue]);



    return (
        <React.Fragment>
            <Card>
                <CardHeader
                    title={<>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: "center" }}>
                            <Typography sx={{ fontSize: "1.2rem", fontWeight: "700" }}>My Tickets</Typography>
                            <Button type="submit" sx={{ mr: 2 }} variant="contained"
                                onClick={() => router?.push("/support")}
                                disabled={
                                    getSupportTicketsByUserIdValue?.filter(
                                      (ticket) => ticket.status === "ToDo" || ticket.status === "Pending"
                                    ).length >= 2
                                  }
                            >
                                Create New Ticket
                            </Button>


                        </Box>

                    </>}
                    titleTypographyProps={{ sx: { mb: [2, 0] } }}
                    sx={{
                        py: 4,
                        flexDirection: ["column", "row"],
                        "& .MuiCardHeader-action": { m: 0 },
                        alignItems: ["flex-start", "center"],
                    }}
                />

                <DataGrid

                    autoHeight
                    pagination={false}
                    rows={tickets || []}
                    rowHeight={62}
                    pageSizeOptions={[]}
                    columns={columns}
                    disableRowSelectionOnClick
                    paginationMode="server"
                    // onPaginationModelChange={(newPage) => handlePageChange(newPage)}
                    rowCount={0}

                />
            </Card>
            <EditTicket setOpen={setOpen} open={open} selectedTicket={selectedTicket} />

            <ViewTicket setOpen={setOpenView} open={openView} selectedTicket={selectedTicket} />
        </React.Fragment>
    );
};

export default SupportHistory;
