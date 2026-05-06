import { Box, Drawer, IconButton } from '@mui/material'
import { Button, Card, CardActions, CardContent, CardHeader, Grid, MenuItem, Select, Slider, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CustomTextField from 'src/@core/components/mui/text-field'
import Editors from '../forms/form-elements/editor'
import CardSnippet from 'src/@core/components/card-snippet'
import EditorControlled from 'src/views/forms/form-elements/editor/EditorControlled'
import * as source from 'src/views/forms/form-elements/editor/EditorSourceCode'
import { EditorWrapper } from 'src/@core/styles/libs/react-draft-wysiwyg'
import { PriorityArray } from 'src/constants/common'
import DropzoneWrapper from 'src/@core/styles/libs/react-dropzone'
import FileUploaderMultiple from 'src/views/forms/form-elements/file-uploader/FileUploaderMultiple'
import { Formik, Field, Form } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from 'react-redux'
import { EditorState, convertFromRaw, ContentState } from 'draft-js'
import Icon from 'src/@core/components/icon'

// ** Component Import
import ReactDraftWysiwyg from 'src/@core/components/react-draft-wysiwyg'
import { createSupportTicket, editSupportTicket, getAllSupportTickets } from 'src/store/apps/support/supportTicketsSlice'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
const schema = yup.object().shape({
    // userId: yup.string().required("Login User ID is required"),
    // password: yup.string().required("Password is required"),
    // address: yup.string(),
});
export default function EditTicket({ open, setOpen, selectedTicket }) {
    const dispatch = useDispatch();
    const router = useRouter()
    let gridProps = { md: 8, sm: 12, xs: 12 }
    let gridProps1 = { md: 4, sm: 12, xs: 12 }

    const [files, setFiles] = useState(selectedTicket?.media || [])
    const user = useSelector((state) => state?.login?.user);
    const { allTickets,editSupportTicketValue, loading } = useSelector((state) => state?.support);

    const [userId, setUserId] = useState(null);


    const initialValues = {
        userId: "", // This should typically be an ObjectId, but it can be an empty string for initial values
        name: user?.data?.name,
        userName: user?.data?.userName,
        subject: selectedTicket?.subject || "",
        description: selectedTicket?.description || "",
        priority: selectedTicket?.priority || "low", // Default priority
        status: "toDo", // Default status
        mediaFiles: selectedTicket?.media || [],
    };

    const onSubmit = async (values) => {

        const payload = {
            id:selectedTicket?.id,
            userId: userId,
            subject: values?.subject,
            description: values?.description, // You need to convert `value` to the appropriate format
            priority: values?.priority,
            status: "ToDo",
            email:user?.data?.email,
            mediaFiles: files,
        };

        const formData = new FormData();
        formData.append("userId", payload.userId);
        formData.append("subject", payload.subject);
        formData.append("description", payload.description);
        formData.append("priority", payload.priority);
        formData.append("status", payload.status);
        formData.append("email", payload.email);


        // Append each file individually
        payload.mediaFiles.forEach((file, index) => {
            formData.append(`mediaFiles`, file);
        });


        try {
            const res = await dispatch(editSupportTicket({ id: payload.id, ticketData: formData }));

            if (res?.payload?.success) {
                toast.success(res?.payload?.message)
                setOpen(false)
            }else{
                toast.error(res.payload.message)
            }
        } catch (error) {
            console.error("Error submitting ticket:", error);
        }
    };

    useEffect(() => {
        if (user) {
            setUserId(user?.data?._id);
        }
    }, [user]);


    useEffect(() => {
        setFiles(selectedTicket?.media || [])
    }, [selectedTicket]);
    return (
        <div>
            <Drawer open={open} anchor='right' sx={{ width: "480px !important" }}>
                <Formik initialValues={initialValues} validationSchema={schema} onSubmit={onSubmit}>
                    {({ values, handleSubmit, setFieldValue, handleChange }) => (

                        <Form>
                            <Card  >

                                <CardHeader
                                    sx={{ textAlign: "left", py: 8, fontSize: 24 }}
                                    title={<>
                                        <Box sx={{ display: "flex", justifyContent: 'space-between', alignItems: "center" }}>
                                            <>Edit Ticket Here</>
                                            <IconButton onClick={() => setOpen(false)} >
                                                <Icon icon='tabler:close-ic' />
                                            </IconButton>

                                        </Box>

                                    </>}
                                    titleTypographyProps={{
                                        style: {
                                            fontSize: '25px',
                                            fontWeight: "700"
                                        }
                                    }}
                                />
                                <CardContent sx={{ width: "600px" }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} lg={6}>
                                            <Typography variant="body1" sx={{ fontWeight: 600, marginTop: "1rem" }}>
                                                Your Name*
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <CustomTextField
                                                fullWidth
                                                placeholder="Enter Name"
                                                onChange={(e) => setFieldValue('name', e.target.value)}
                                                value={values?.name}
                                                disabled={true}

                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="body1" sx={{ fontWeight: 600, marginTop: "1rem" }}>
                                                Your UserName*
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <CustomTextField
                                                fullWidth
                                                label=""
                                                placeholder="Enter UserName"
                                                onChange={(e) => setFieldValue('userName', e.target.value)}
                                                value={values?.userName}
                                                disabled={true}


                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="body1" sx={{ fontWeight: 600, marginTop: "1rem" }}>
                                                Subject*
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <CustomTextField
                                                fullWidth
                                                label=""
                                                placeholder="Enter Subject"
                                                onChange={(e) => setFieldValue('subject', e.target.value)}
                                                value={values?.subject}


                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="body1" sx={{ fontWeight: 600, marginTop: "1rem" }}>
                                                Description*
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <CustomTextField
                                                fullWidth
                                                label=""
                                                placeholder="Enter Description"
                                                onChange={(e) => setFieldValue('description', e.target.value)}
                                                multiline
                                                value={values?.description}
                                                rows={6}

                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Typography variant="body1" sx={{ fontWeight: 600, marginTop: "1rem" }}>
                                                Priority*
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Select labelId='demo-simple-select-filled-label' id='demo-simple-select-filled' defaultValue='default' sx={{ width: "100%" }}
                                                onChange={(e) => setFieldValue("priority", e.target.value)}
                                                value={values?.priority}

                                            >
                                                {
                                                    PriorityArray.map((item, index) => (
                                                        <MenuItem value={item?.value}>{item?.label}</MenuItem>
                                                    ))
                                                }

                                            </Select>

                                        </Grid>

                                        <Grid item xs={12}>
                                            <Typography variant="body1" sx={{ fontWeight: 600, marginTop: "1rem" }}>
                                                Attachment*
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <DropzoneWrapper>
                                                <FileUploaderMultiple files={files} setFiles={setFiles} />
                                            </DropzoneWrapper>

                                        </Grid>

                                        {/* <Sliders /> */}
                                    </Grid>

                                </CardContent>
                                <CardActions>
                                    <Button disabled={loading} fullWidth type="submit" onClick={handleSubmit} sx={{ mr: 2 }} variant="contained">
                                        {
                                            loading ? 'Loading...' : "Edit "
                                        }

                                    </Button>
                                </CardActions>
                            </Card>
                        </Form>
                    )
                    }
                </Formik>

            </Drawer>
        </div>
    )
}
