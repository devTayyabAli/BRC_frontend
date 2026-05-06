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
import SupportAgent from 'src/views/pages/support-agent/SupportAgent'
import { Formik, Field, Form } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from 'react-redux'
import { convertToRaw, EditorState } from 'draft-js'

// ** Component Import
import ReactDraftWysiwyg from 'src/@core/components/react-draft-wysiwyg'
import { createSupportTicket, getAllSupportTickets, getSupportTicketsByUserId } from 'src/store/apps/support/supportTicketsSlice'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import ViewTicket from './ViewTicket'

const schema = yup.object().shape({
    // userId: yup.string().required("Login User ID is required"),
    // password: yup.string().required("Password is required"),
    // address: yup.string(),
});
function Support() {
    const dispatch = useDispatch();
    const router = useRouter()
    let gridProps = { md: 8, sm: 12, xs: 12 }
    let gridProps1 = { md: 4, sm: 12, xs: 12 }
    const [value, setValue] = useState(EditorState.createEmpty())
    const [files, setFiles] = useState([])
    const user = useSelector((state) => state?.login?.user);
    const { allTickets, getSupportTicketsByUserIdValue, loading } = useSelector((state) => state?.support);

    const [userId, setUserId] = useState(null);


    const initialValues = {
        userId: "", // This should typically be an ObjectId, but it can be an empty string for initial values
        name: user?.data?.name,
        userName: user?.data?.userName,
        subject: "",
        description: "",
        priority: "low", // Default priority
        status: "toDo", // Default status
        mediaFiles: [],
    };

    const onSubmit = async (values) => {
        const payload = {
            userId: userId,
            email: user?.data?.email,
            subject: values?.subject,
            description: values?.description, // You need to convert `value` to the appropriate format
            priority: values?.priority,
            status: "ToDo",
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
            const res = await dispatch(createSupportTicket(formData));
            if (res.payload.success) {
                toast.success(res.payload.message)
                router?.push("/support-history")

            }
        } catch (error) {
            console.error("Error submitting ticket:", error);
        }
    };

    useEffect(() => {
        dispatch(getAllSupportTickets())
        if (user) {
            setUserId(user?.data?._id);
        }
    }, [user]);


    useEffect(() => {
        dispatch(getSupportTicketsByUserId(user?.data?._id))
    }, [dispatch, user])

    return (
        <Card sx={{ p: 8 }}>
            <Grid container spacing={2}>
                <Grid item {...gridProps}>
                    <Formik initialValues={initialValues} validationSchema={schema} onSubmit={onSubmit}>
                        {({ values, handleSubmit, setFieldValue, handleChange }) => (

                            <Form>
                                <Card sx={{ border: 1 }} >

                                    <CardHeader
                                        sx={{ textAlign: "left", py: 8, fontSize: 24 }}
                                        title={`Create Ticket Here`}
                                        titleTypographyProps={{
                                            style: {
                                                fontSize: '25px',
                                                fontWeight: "700"
                                            }
                                        }}
                                    />
                                    <CardContent>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <Typography variant="body1" sx={{ fontWeight: 600, marginTop: "1rem" }}>
                                                    Enter Your Name*
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <CustomTextField
                                                    fullWidth
                                                    placeholder="Enter Name"
                                                    onChange={(e) => setFieldValue('name', e.target.value)}
                                                    value={values?.name}
                                                    disabled

                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography variant="body1" sx={{ fontWeight: 600, marginTop: "1rem" }}>
                                                    Enter Your UserName*
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <CustomTextField
                                                    fullWidth
                                                    label=""
                                                    placeholder="Enter UserName"
                                                    onChange={(e) => setFieldValue('userName', e.target.value)}
                                                    value={values?.userName}
                                                    disabled


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

                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography variant="body1" sx={{ fontWeight: 600, marginTop: "1rem" }}>
                                                    Description*
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <ViewTicket />

                                                <CustomTextField
                                                    fullWidth
                                                    label=""
                                                    placeholder="Enter Description"
                                                    onChange={(e) => setFieldValue('description', e.target.value)}
                                                    multiline
                                                    rows={6}

                                                />
                                                {/* <EditorWrapper>
                                                    <ReactDraftWysiwyg editorState={value} onEditorStateChange={data => setValue(data)} />
                                                </EditorWrapper> */}

                                            </Grid>

                                            <Grid item xs={12}>
                                                <Typography variant="body1" sx={{ fontWeight: 600, marginTop: "1rem" }}>
                                                    Priority*
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Select labelId='demo-simple-select-filled-label' id='demo-simple-select-filled' defaultValue='default' sx={{ width: "100%" }}
                                                    onChange={(e) => setFieldValue("priority", e.target.value)}

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

                                        <Button disabled={loading || getSupportTicketsByUserIdValue?.filter(
                                            (ticket) => ticket.status === "ToDo" || ticket.status === "Pending"
                                        ).length >= 2} fullWidth type="submit" sx={{ mr: 2 }} variant="contained">
                                            {
                                                loading ? 'Loading...' : "Create"
                                            }

                                        </Button>
                                    </CardActions>
                                </Card>
                            </Form>
                        )
                        }
                    </Formik>
                </Grid>

                <Grid item {...gridProps1}>
                    <SupportAgent />
                </Grid>

            </Grid>
        </Card>

    )
}

export default Support
