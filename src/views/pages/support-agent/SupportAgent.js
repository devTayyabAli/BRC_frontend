import { Box, Card, CardContent, CardHeader, Slider, Typography } from '@mui/material'
import React, { useState } from 'react'
import { AgentArray } from 'src/constants/common';

export default function SupportAgent() {

    const currentDay = new Date().toLocaleString('en-US', { weekday: 'long' });
    return (
        <div>
            <Card sx={{ border: 1 }} >
                <CardHeader
                    sx={{
                        textAlign: "center", py: 8, fontSize: 24,

                    }}
                    title={`Support agent`}
                    subheader="Online"
                    subheaderTypographyProps={{ style: { color: '#C9A84C', fontSize: "16px" } }}
                    titleTypographyProps={{
                        style: {
                            fontSize: '20px',
                            fontWeight: "700"
                        }
                    }}
                />
                <CardContent>
                    {
                        AgentArray?.map((items, index) => {
                            return (
                                <>
                                    <Card sx={{ border: 1, p: 2, mt: 2 }} >
                                        <CardHeader
                                            sx={{
                                                textAlign: "center", py: 1, fontSize: 14,

                                            }}
                                            title={items?.title}
                                            titleTypographyProps={{
                                                style: {
                                                    fontSize: '16px',

                                                }
                                            }}
                                        />
                                        <Slider
                                            disableSwap
                                            value={[10, 90]}
                                            marks={[{
                                                value: 10,
                                                label: '10:00 AM'
                                            },

                                            {
                                                value: 90,
                                                label: '8:00 PM'
                                            }]}
                                        />
                                        {items.title === currentDay && (
                                            <Box sx={{ textAlign: 'center', marginTop: "-2rem", display: 'flex', justifyContent: 'center' }}>
                                                <Box sx={{ backgroundColor: "#EA5455", width: "5rem", padding: "5px 10px", borderRadius: "5px", color: "#fff" }}>
                                                    Toady
                                                </Box>
                                            </Box>
                                        )
                                        }
                                    </Card>
                                </>
                            )
                        })
                    }

                    <Card sx={{ border: 1, p: 2, mt: 2, borderColor: "#EA5455" }} >
                        <Box sx={{ color: "#EA5455" }}>
                            You can reach our technical team during hours aligned with the Pakistan Standard Time (PST, GMT+5).
                        </Box>
                    </Card>
                    <Box>
                        <h3>Tell us!</h3>
                        <Typography sx={{ marginTop: "-1rem" }}>Add as much detail as possible, including site and page name.</Typography>
                    </Box>
                    <Box>
                        <h3>Show us!</h3>
                        <Typography sx={{ marginTop: "-1rem" }}>Add a screenshot or a link to a video.</Typography>
                    </Box>
                    <Box>
                        <h3>Caution</h3>
                        <Typography sx={{ marginTop: "-1rem" }}>Ticket response time can be up to 2 business days</Typography>
                    </Box>
                    <Box>
                        <h3>Response Time</h3>
                        <Typography sx={{ marginTop: "-1rem" }}>Our support team operates five days a week, from 10:00 AM to 8:00 PM in Pakistan Standard Time (PST, GMT+5), and strives to handle each ticket in a timely manner. However, our response time may be delayed by one or two business days during every weekend or government holiday.</Typography>
                    </Box>
                    <Box>
                        <h3 style={{ color: "#C9A84C" }}>Important Notice</h3>
                        <Typography sx={{ marginTop: "-1rem" }}>If a ticket remains unresponsive for more than one or two business days or is unrelated to our support items, it will be locked. Additionally, duplicate ticket issues may also result in ticket locking. Thank you for your cooperation.</Typography>
                    </Box>


                </CardContent>


            </Card>
        </div>
    )
}
