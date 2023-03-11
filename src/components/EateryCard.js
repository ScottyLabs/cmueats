import React, { useState, useEffect } from "react";
import {
    Card,
    CardHeader,
    Typography,
    styled,
    Grid,
    Button,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    CardContent,
    CardActions,
    Avatar,
    Dialog,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DateTime } from "luxon";

const StyledCard = styled(Card)({
    backgroundColor: "#23272A",
    border: "2px solid rgba(0, 0, 0, 0.2)",
    textAlign: "left",
    borderRadius: 7,
    height: "100%",
    justifyContent: "flex-start"
});

const StyledCardHeader = styled(CardHeader)({
    fontWeight: 500,
    backgroundColor: "#1D1F21",
});

const NameText = styled(Typography)({
    color: "white",
    padding: 0,
    fontFamily:
        '"Zilla Slab", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    textTransform: "capitalize",
});

const LocationText = styled(Typography)({
    color: "#8D979F",
    marginBottom: "10px",
    fontWeight: 500,
    fontSize: 14
});

const DescriptionText = styled(Typography)({
    color: "white",
});

const OpenText = styled(Typography)({
    color: "#19b875",
    fontSize: 14,
    fontWeight: 500,
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif'
});

const ClosedText = styled(Typography)({
    color: "#dd3c18",
    fontSize: 14,
    fontWeight: 500,
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif'
});

const ActionButton = styled(Button)({
    fontWeight: 600,
    fontFamily:
        '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    color: "white",
    backgroundColor: "#1D1F21",
    elevation: 30,
});

const GreenDot = styled(Card)({
    opacity: 1,
    background: "#19b875",
    width: "100%",
    height: "100%",
    foregroundColor: "#19b875"
});

const BlinkingGreenDot = styled(Card)({
    "@keyframes blinking": {
        "0%": {
            opacity: 0,
        },

        "50%": {
            opacity: 1,
        },

        "75%": {
            opacity: 1,
        },

        "100%": {
            opacity: 0,
        },
    },
    background: "#19b875",
    width: "100%",
    height: "100%",
    foregroundColor: "#19b875",
    animationName: "blinking",
    animationDuration: "1s",
    animationIterationCount: "infinite",
});

const RedDot = styled(Card)({
    "@keyframes blinking": {
        "0%": {
            opacity: 0,
        },

        "50%": {
            opacity: 1,
        },

        "75%": {
            opacity: 1,
        },

        "100%": {
            opacity: 0,
        },
    },
    background: "#dd3c18",
    width: "100%",
    height: "100%",
    foregroundColor: "#dd3c18",
});

const SpecialsContent = styled(Accordion)({
    backgroundColor: "#23272A",
});

export default function EateryCard({ location }) {
    const {
        name,
        location: locationText,
        shortDescription,
        menu,
        todaysSpecials = [],
        isOpen,
        statusMsg,
        todaysSoups = [],
    } = location;

    const [modalOpen, setModalOpen] = useState(false);
    const [isBlinking, setIsBlinking] = useState(false);

    const now = DateTime.now().setZone('America/New_York');

    function toMinutes(days, hours, minutes) {
        return days * 24 * 60 + hours * 60 + minutes;
    };

    useEffect(() => {
        function isOpenNow(start, end) {
            const weekday = now.weekday === 7 ? 0 : now.weekday;
            const nowMinutes = toMinutes(weekday, now.hour, now.minute);
            return start <= nowMinutes && nowMinutes <= end;
        }

        // Async function to update state of whether green dot should blink
        async function queryLocation() {
            let isBlinking = false;
            const modifiedTimes = location.times = location.times.map(({ start, end }) => ({
                // Add minutes since start of the week for isOpen computation
                start: {
                    ...start,
                    rawMinutes: toMinutes(start.day, start.hour, start.minute),
                },
                end: {
                    ...end,
                    rawMinutes: toMinutes(end.day, end.hour, end.minute),
                },
            }));
            const timeSlotTmp = modifiedTimes.find(({ start, end }) => {
                return isOpenNow(start.rawMinutes, end.rawMinutes);
            });

            if (timeSlotTmp != null) {
                // Location is open (add else logic if you need location is closed)
                const { end } = timeSlotTmp;
                const timeDiff = end.rawMinutes - toMinutes(now.weekday, now.hour, now.minute);
                isBlinking = timeDiff <= 60;
            }
            setIsBlinking(isBlinking);
        }
        queryLocation();
    }, [now.hour, now.minute, now.weekday, location]);


    return (
        <>
            <Grid item xs={12} md={4} lg={3} xl={3}>
                <StyledCard>
                    <StyledCardHeader
                        title={
                            isOpen ? (
                                <OpenText variant="subtitle1">{statusMsg}</OpenText>
                            ) : (
                                <ClosedText variant="subtitle1">{statusMsg}</ClosedText>
                            )
                        }
                        avatar={
                            <Avatar
                                sx={{ width: 12, height: 12, backgroundColor: "#1D1F21" }}
                            >
                                {isOpen ? (isBlinking ? <BlinkingGreenDot /> : <GreenDot />) : <RedDot />}
                            </Avatar>
                        }
                    ></StyledCardHeader>
                    <CardContent>
                        <NameText variant="h6">{name}</NameText>
                        <LocationText variant="subtitle2">{locationText}</LocationText>
                        <DescriptionText>{shortDescription}</DescriptionText>
                    </CardContent>
                    <CardActions sx={{ marginTop: "auto" }}>
                        {menu && (
                            <ActionButton
                                onClick={(e) => {
                                    window.open(menu, "_blank");
                                }}
                            >
                                Menu
                            </ActionButton>
                        )}
                        {(todaysSpecials.length !== 0 || todaysSoups.length !== 0) && (
                            <ActionButton
                                onClick={(e) => {
                                    setModalOpen(true);
                                }}
                            >
                                Specials
                            </ActionButton>
                        )}
                    </CardActions>
                </StyledCard>
            </Grid>

            <Dialog
                open={modalOpen}
                onClose={(e) => {
                    setModalOpen(false);
                }}
                PaperProps={{
                    style: {
                        backgroundColor: "#23272A",
                    },
                }}
            >
                <StyledCard>
                    <StyledCardHeader
                        title={
                            isOpen ? (
                                <OpenText variant="subtitle1">{statusMsg}</OpenText>
                            ) : (
                                <ClosedText variant="subtitle1">{statusMsg}</ClosedText>
                            )
                        }
                        avatar={
                            <Avatar
                                sx={{ width: 12, height: 12, backgroundColor: "#1D1F21" }}
                            >
                                <GreenDot />
                            </Avatar>
                        }
                    ></StyledCardHeader>
                    <CardContent>
                        <NameText variant="h6">{name}</NameText>
                        <LocationText variant="subtitle2">{locationText}</LocationText>
                    </CardContent>
                    {todaysSpecials.concat(todaysSoups).map((special, idx) => {
                        return (
                            <SpecialsContent style={{}} key={idx}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon style={{ color: "white" }} />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <DescriptionText>{special.title}</DescriptionText>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <LocationText>{special.description}</LocationText>
                                </AccordionDetails>
                            </SpecialsContent>
                        );
                    })}
                </StyledCard>
            </Dialog>
        </>
    );
}