// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import * as source from 'src/views/components/swiper/SwiperSourceCode'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { Box, Grid } from '@mui/material'
import Swiper from '../components/swiper'
import SwiperControls from 'src/views/components/swiper/SwiperControls'
import CardSnippet from 'src/@core/components/card-snippet'
import KeenSliderWrapper from 'src/@core/styles/libs/keen-slider'
import CustomChip from 'src/@core/components/mui/chip'

import Badge from '@mui/material/Badge'
// ** Third Party Components
import clsx from 'clsx'
import { useKeenSlider } from 'keen-slider/react'

const CustomCloseButton = styled(IconButton)(({ theme }) => ({
    top: 0,
    right: 0,
    color: 'grey.500',
    position: 'absolute',
    boxShadow: theme.shadows[2],
    transform: 'translate(10px, -10px)',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: `${theme.palette.background.paper} !important`,
    transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
    '&:hover': {
        transform: 'translate(7px, -5px)'
    }
}))



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
                    <span>{status}</span>
                </Box>
            }
        />
    );
};

export default function ViewTicket({ setOpen, open, direction, selectedTicket }) {

    const handleClose = () => setOpen(false)
    const [loaded, setLoaded] = useState(false)
    const [currentSlide, setCurrentSlide] = useState(0)
    const [currentVideoSlide, setCurrentVideoSlide] = useState(0)



    // ** Hook
    const [sliderRef, instanceRef] = useKeenSlider({
        rtl: direction === 'rtl',
        slideChanged(slider) {
            setCurrentSlide(slider.track.details.rel)
        },
        created() {
            setLoaded(true)
        }
    })

    const [sliderVideoRef, instanceVieoRef] = useKeenSlider({
        rtl: direction === 'rtl',
        slideChanged(slider) {
            setCurrentVideoSlide(slider.track.details.rel)
        },
        created() {
            setLoaded(true)
        }
    })
    return (
        <div>

            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth={"md"}
                aria-labelledby='customized-dialog-title'
                sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
            >
                <DialogTitle id='customized-dialog-title' sx={{ p: 4 }}>
                    <Typography variant='h6' component='span'>
                        View Ticket
                    </Typography>
                    <CustomCloseButton aria-label='close' onClick={handleClose}>
                        <Icon icon='tabler:x' fontSize='1.25rem' />
                    </CustomCloseButton>
                </DialogTitle>
                <DialogContent dividers sx={{ p: theme => `${theme.spacing(4)} !important` }}>
                    <Grid container gap={5}>
                        {/* Left Panel: Swiper and Video */}
                        <Grid
                            item
                            xs={12}
                            md={6.2}
                            lg={7}

                        >
                            {
                                selectedTicket?.media?.filter(item => item?.type === "image")?.length > 0 &&
                                <Box>

                                    <KeenSliderWrapper>
                                        <Box className='navigation-wrapper'>
                                            <Box ref={sliderRef} className='keen-slider'>
                                                {
                                                    selectedTicket?.media?.filter(item => item?.type === "image")?.map((item, index) => (
                                                        <Box key={index} className='keen-slider__slide' sx={{ width: "500px !important" }}>
                                                            <img src={item?.url} alt='swiper 1' style={{ height: "500px !important", width: "500px !important" }} />
                                                        </Box>

                                                    ))}

                                            </Box>
                                            {loaded && instanceRef.current && (
                                                <>
                                                    <Icon
                                                        icon='tabler:chevron-left'
                                                        className={clsx('arrow arrow-left', {
                                                            'arrow-disabled': currentSlide === 0
                                                        })}
                                                        onClick={e => e.stopPropagation() || instanceRef?.current?.prev()}
                                                    />

                                                    <Icon
                                                        icon='tabler:chevron-right'
                                                        className={clsx('arrow arrow-right', {
                                                            'arrow-disabled': currentSlide === instanceRef?.current?.track?.details?.slides?.length - 1
                                                        })}
                                                        onClick={e => e.stopPropagation() || instanceRef?.current?.next()}
                                                    />
                                                </>
                                            )}
                                        </Box>
                                        {loaded && instanceRef.current && (
                                            <Box className='swiper-dots'>
                                                {[...Array(instanceRef?.current?.track?.details?.slides?.length).keys()]?.map(idx => {
                                                    return (
                                                        <Badge
                                                            key={idx}
                                                            variant='dot'
                                                            component='div'
                                                            className={clsx({
                                                                active: currentSlide === idx
                                                            })}
                                                            onClick={() => {
                                                                instanceRef.current?.moveToIdx(idx)
                                                            }}
                                                        ></Badge>
                                                    )
                                                })}
                                            </Box>
                                        )}
                                    </KeenSliderWrapper>
                                </Box>
                            }
                            {
                                selectedTicket?.media?.filter(item => item?.type === "video")?.length > 0 &&
                                <Box sx={{ mt: "2rem" }}>
                                    <KeenSliderWrapper>
                                        <Box className='navigation-wrapper'>
                                            <Box ref={sliderVideoRef} className='keen-slider'>
                                                {selectedTicket?.media?.filter(item => item?.type === "video")?.map((item, index) => (
                                                    <Box key={index} className='keen-slider__slide' sx={{ width: "500px !important" }}>
                                                        <video
                                                            controls
                                                            src={item?.url}
                                                            muted
                                                            loop
                                                            // poster="http://localhost:8000/uploads/media/media-1729757235424-62040682.jpg"
                                                            style={{ width: "100%", height: "100%" }}
                                                        />
                                                    </Box>
                                                ))
                                                }


                                            </Box>
                                            {loaded && instanceVieoRef.current && (
                                                <>
                                                    <Icon
                                                        icon='tabler:chevron-left'
                                                        className={clsx('arrow arrow-left', {
                                                            'arrow-disabled': currentVideoSlide === 0
                                                        })}
                                                        onClick={e => e.stopPropagation() || instanceVieoRef.current?.prev()}
                                                    />

                                                    <Icon
                                                        icon='tabler:chevron-right'
                                                        className={clsx('arrow arrow-right', {
                                                            'arrow-disabled': currentVideoSlide === instanceVieoRef.current?.track?.details?.slides?.length - 1
                                                        })}
                                                        onClick={e => e.stopPropagation() || instanceVieoRef?.current?.next()}
                                                    />
                                                </>
                                            )}
                                        </Box>
                                        {loaded && instanceVieoRef.current && (
                                            <Box className='swiper-dots'>
                                                {[...Array(instanceVieoRef.current?.track?.details?.slides?.length).keys()]?.map(idx => {
                                                    return (
                                                        <Badge
                                                            key={idx}
                                                            variant='dot'
                                                            component='div'
                                                            className={clsx({
                                                                active: currentSlide === idx
                                                            })}
                                                            onClick={() => {
                                                                instanceVieoRef.current?.moveToIdx(idx)
                                                            }}
                                                        ></Badge>
                                                    )
                                                })}
                                            </Box>
                                        )}
                                    </KeenSliderWrapper>

                                    {/* <ReactPlayer
                                    url={selectedProduct?.videoUrl}
                                    width="100%"
                                    height="300px"
                                    style={{ borderRadius: "10px" }}
                                    controls={true}
                                /> */}
                                </Box>
                            }

                        </Grid>

                        {/* Right Panel: Details */}
                        <Grid
                            item
                            xs={12}
                            md={4}
                            lg={4}
                        >
                            <Box>
                                <Typography
                                    variant="h3"
                                    sx={{ fontWeight: 700, color: "#141414" }}
                                >
                                    Ticket Details
                                </Typography>

                                <Box>
                                    {/* <Box sx={{ display: "flex", gap: "10px", marginTop: "1rem" }}>

                                        <Typography
                                            variant="h6"
                                            sx={{ fontWeight: 700, color: "#141414" }}
                                        >
                                            User Id :
                                        </Typography>
                                        {selectedTicket?.userId}
                                    </Box> */}

                                    <Box sx={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
                                        <Typography
                                            variant="h6"
                                            sx={{ fontWeight: 700, color: "#141414" }}
                                        >
                                            UserName:
                                        </Typography>
                                        {selectedTicket?.userName}

                                    </Box>


                                    <Typography
                                        variant="h6"
                                        sx={{ fontWeight: 700, color: "#141414", marginTop: "1rem" }}
                                    >
                                        Subject  :
                                    </Typography>
                                    <p>{selectedTicket?.subject}</p>

                                    <Typography
                                        variant="h6"
                                        sx={{ fontWeight: 700, color: "#141414" }}
                                    >
                                        Description  :
                                    </Typography>
                                    <p>{selectedTicket?.description}</p>

                                    <Box >
                                        <Box sx={{ display: "flex", gap: "10px" }}>
                                            <Typography
                                                variant="h6"
                                                sx={{ fontWeight: 700, color: "#141414" }}
                                            >
                                                Priority  :
                                            </Typography>
                                            <PriorityLabel priority={selectedTicket?.priority} />
                                        </Box>
                                        <Box sx={{ display: "flex", gap: "10px", marginTop: "2rem" }}>
                                            <Typography
                                                variant="h6"
                                                sx={{ fontWeight: 700, color: "#141414" }}
                                            >
                                                Status  :
                                            </Typography>
                                            <StatusLabel status={selectedTicket?.status} />
                                        </Box>
                                    </Box>




                                </Box>



                            </Box>
                        </Grid>
                    </Grid>

                </DialogContent>
                <DialogActions sx={{ p: theme => `${theme.spacing(3)} !important` }}>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
