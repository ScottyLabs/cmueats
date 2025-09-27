import { useEffect, useRef, useState } from 'react';
import {
    CardHeader,
    Typography,
    Link,
    styled,
    Grid,
    Button,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    CardContent,
    Dialog,
    Tooltip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DateTime } from 'luxon';

import { getTimeSlotsString } from '../util/time';
import TextProps from '../types/interfaces';
import { IReadOnlyLocation_Combined, LocationState } from '../types/locationTypes';
import './EateryCard.css';
import { highlightColors, textColors } from '../constants/colors';

const StyledCardHeader = styled(CardHeader)<{ state: LocationState }>(({ state }) => ({
    fontWeight: 500,
    alignItems: 'flex-start',
    padding: '13px 16px',
    borderBottom: '2px solid',
    borderBottomColor: highlightColors[state],
}));

const CustomLink = styled(Link)({
    color: 'var(--card-text-title)',
    textDecoration: 'underline',
    textUnderlineOffset: '2px',
});

const NameText = styled(Typography)({
    padding: 0,
    marginBottom: 5,
    fontFamily: 'var(--text-primary-font)',
    textTransform: 'capitalize',
    lineHeight: 1.2,
});

const LocationText = styled(Typography)({
    color: 'var(--card-text-muted)',
    marginBottom: 16,
    fontWeight: 500,
    fontSize: 14,
});

const DescriptionText = styled(Typography)({
    color: 'var(--card-text-description)',
});

const LongDescriptionText = styled(Typography)({
    color: 'var(--text-muted)',
    marginBottom: '5px',
});
const StyledAccordion = styled(Accordion)({});
const StyledAccordionSummary = styled(AccordionSummary)({
    backgroundColor: 'hsl(206 9% 12%)',
    color: 'var(--card-text-description)',
    // fontWeight: 'bold',
    '&:hover': {
        backgroundColor: 'hsl(206 9% 9%)',
        '&:active': {
            backgroundColor: 'hsl(206 9% 8%)',
        },
    },
    '&.Mui-expanded': {
        backgroundColor: 'hsl(206 9% 8%)',
    },
});
const StyledAccordionDetails = styled(AccordionDetails)({
    backgroundColor: 'hsl(206 9% 11% / 1)',
    color: 'hsl(206 9% 75% / 1)',
    fontSize: 16,
    paddingTop: 20,
});
const StatusText = styled(Typography, {
    shouldForwardProp: (prop) => prop !== 'state',
})<TextProps>(({ state }) => ({
    color: textColors[state],
    fontSize: '1rem',
    fontWeight: 500,
    fontFamily: 'var(--text-secondary-font)',
}));

const ActionButton = styled(Button)({
    fontFamily: 'var(--text-secondary-font)',
    color: 'var(--button-text)',
    backgroundColor: 'var(--button-bg)',
    padding: '5px 10px',

    letterSpacing: -0.2,
    '&:hover': {
        backgroundColor: 'var(--button-bg--hover)',
    },
});

const ExitButton = styled(Button)({
    fontFamily: 'var(--text-secondary-font)',
    color: 'var(--button-text)',
    backgroundColor: 'hsl(0 45.1% 30.2%)',
    padding: '15px 4px',

    letterSpacing: -0.2,
    elevation: 30,
    '&:hover': {
        backgroundColor: 'hsl(0 65.1% 30.2%)',
    },
});

function PinIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="20" viewBox="0 0 16 22" fill="none">
            <path
                d="M10.9189 6.30859C10.9189 6.30391 10.9189 6.29914 10.9189 6.2943C10.9189 6.20275 10.9189 6.08496 10.9326 5.96484C10.9442 5.86398 10.9635 5.76395 10.9902 5.66602C11.0237 5.54336 11.0708 5.42944 11.1055 5.34277L12.1133 2.82324C12.2674 2.43793 12.3564 2.21086 12.4063 2.04395C12.4088 2.0354 12.41 2.02706 12.4121 2.01953C12.4045 2.01873 12.3963 2.01739 12.3877 2.0166C12.2142 2.00087 11.9706 2 11.5557 2H4.28223C3.86767 2 3.62457 2.00088 3.45117 2.0166C3.44258 2.01738 3.43433 2.01873 3.42676 2.01953C3.42888 2.02706 3.43007 2.0354 3.43262 2.04395C3.48243 2.21086 3.57146 2.43793 3.72559 2.82324L4.7334 5.34277C4.76807 5.42944 4.81516 5.54337 4.84863 5.66602C4.86199 5.71498 4.87322 5.76465 4.88281 5.81445L4.90625 5.96484L4.91797 6.14844C4.91942 6.20695 4.91895 6.26177 4.91895 6.30859V8.43848C4.91895 8.60644 4.92446 8.82981 4.87891 9.05176C4.84267 9.22816 4.78212 9.39921 4.7002 9.55957C4.5972 9.76101 4.45444 9.93147 4.34961 10.0625L2.78027 12.0254C2.43502 12.457 2.21942 12.7268 2.08399 12.9316C2.07529 12.9448 2.0688 12.9582 2.06152 12.9697C2.07515 12.9712 2.0896 12.9751 2.10547 12.9766C2.34998 12.9988 2.69545 13 3.24805 13H12.5908C13.1434 13 13.4889 12.9988 13.7334 12.9766C13.7489 12.9752 13.763 12.9712 13.7764 12.9697C13.7692 12.9584 13.7635 12.9447 13.7549 12.9316C13.6195 12.7268 13.4039 12.457 13.0586 12.0254L11.4893 10.0625C11.3844 9.93148 11.2417 9.76102 11.1387 9.55957C11.0567 9.39921 10.9962 9.22815 10.96 9.05176C10.9144 8.82981 10.9189 8.60644 10.9189 8.43848V6.30859ZM12.9189 8.43848C12.9189 8.54986 12.9193 8.60537 12.9209 8.64551V8.64844C12.9215 8.64927 12.9222 8.65046 12.9229 8.65137C12.9467 8.68368 12.9813 8.72666 13.0508 8.81348L14.6211 10.7754C14.9415 11.1759 15.2253 11.5303 15.4229 11.8291C15.6102 12.1124 15.8383 12.5136 15.8389 12.998C15.8395 13.607 15.5628 14.1835 15.0869 14.5635C14.7083 14.8657 14.2523 14.938 13.9141 14.9688C13.5575 15.0011 13.1035 15 12.5908 15H8.91895V21C8.91895 21.5523 8.47123 22 7.91895 22C7.36686 21.9998 6.91895 21.5521 6.91895 21V15H3.24805C2.73529 15 2.28144 15.0011 1.92481 14.9688C1.58654 14.938 1.13063 14.8658 0.751954 14.5635C0.275996 14.1835 -0.000594057 13.607 9.58057e-07 12.998C0.000524105 12.5135 0.228695 12.1124 0.416017 11.8291C0.613552 11.5303 0.897364 11.1759 1.21777 10.7754L2.78809 8.81348C2.85755 8.72665 2.8922 8.68368 2.91602 8.65137L2.91797 8.64551C2.91955 8.60537 2.91895 8.54986 2.91895 8.43848V6.19434L2.91797 6.19336V6.19141C2.91027 6.17082 2.89894 6.14236 2.87598 6.08496L1.86817 3.56543C1.7283 3.21577 1.59748 2.89052 1.51563 2.61621C1.43298 2.33922 1.35753 1.9823 1.43848 1.59277C1.54576 1.07698 1.85195 0.624158 2.29102 0.333008C2.62267 0.113157 2.98261 0.0515199 3.27051 0.0253912C3.55553 -0.000454126 3.90579 -9.41141e-08 4.28223 5.95178e-07H11.5557C11.9323 5.95178e-07 12.2832 -0.000474133 12.5684 0.0253912C12.8563 0.0515198 13.2162 0.113157 13.5479 0.333008C13.9869 0.624164 14.2931 1.07701 14.4004 1.59277C14.4813 1.98228 14.4059 2.33923 14.3232 2.61621C14.2414 2.8906 14.1096 3.21566 13.9697 3.56543L12.9619 6.08496C12.939 6.14232 12.9286 6.17083 12.9209 6.19141L12.9199 6.19336C12.9194 6.21533 12.9189 6.24678 12.9189 6.30859V8.43848Z"
                fill="#f6cc5d"
            />
            <path
                d="M10.9189 6.30859L10.9189 6.2943C10.9189 6.20275 10.9189 6.08496 10.9326 5.96484C10.9442 5.86398 10.9635 5.76395 10.9902 5.66602C11.0237 5.54336 11.0708 5.42944 11.1055 5.34277L12.1133 2.82324C12.2674 2.43793 12.3564 2.21086 12.4063 2.04395C12.4088 2.0354 12.41 2.02706 12.4121 2.01953C12.4045 2.01873 12.3963 2.01739 12.3877 2.0166C12.2142 2.00087 11.9706 2 11.5557 2H4.28223C3.86767 2 3.62457 2.00088 3.45117 2.0166C3.44258 2.01738 3.43433 2.01873 3.42676 2.01953C3.42888 2.02706 3.43007 2.0354 3.43262 2.04395C3.48243 2.21086 3.57146 2.43793 3.72559 2.82324L4.7334 5.34277C4.76807 5.42944 4.81516 5.54337 4.84863 5.66602C4.86199 5.71498 4.87322 5.76465 4.88281 5.81445L4.90625 5.96484L4.91797 6.14844C4.91942 6.20695 4.91895 6.26177 4.91895 6.30859V8.43848C4.91895 8.60644 4.92446 8.82981 4.87891 9.05176C4.84267 9.22816 4.78212 9.39921 4.7002 9.55957C4.5972 9.76101 4.45444 9.93147 4.34961 10.0625L2.78027 12.0254C2.43502 12.457 2.21942 12.7268 2.08399 12.9316C2.07529 12.9448 2.0688 12.9582 2.06152 12.9697C2.07515 12.9712 2.0896 12.9751 2.10547 12.9766C2.34998 12.9988 2.69545 13 3.24805 13H12.5908C13.1434 13 13.4889 12.9988 13.7334 12.9766C13.7489 12.9752 13.763 12.9712 13.7764 12.9697C13.7692 12.9584 13.7635 12.9447 13.7549 12.9316C13.6195 12.7268 13.4039 12.457 13.0586 12.0254L11.4893 10.0625C11.3844 9.93148 11.2417 9.76102 11.1387 9.55957C11.0567 9.39921 10.9962 9.22815 10.96 9.05176C10.9144 8.82981 10.9189 8.60644 10.9189 8.43848V6.30859Z"
                fill="#f6cc5d"
            />
        </svg>
    );
}

function UnpinIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
                d="M15 7.30859C15 7.21519 14.9992 7.09131 15.0137 6.96484C15.0252 6.86398 15.0446 6.76395 15.0713 6.66602C15.1048 6.54336 15.1519 6.42944 15.1865 6.34277L16.1943 3.82324C16.3485 3.43793 16.4375 3.21086 16.4873 3.04395C16.4899 3.0354 16.491 3.02706 16.4932 3.01953C16.4856 3.01873 16.4774 3.01739 16.4688 3.0166C16.2953 3.00087 16.0516 3 15.6367 3H8.36328C7.94872 3 7.70563 3.00088 7.53223 3.0166C7.52364 3.01738 7.51538 3.01873 7.50781 3.01953C7.50994 3.02706 7.51113 3.0354 7.51367 3.04395C7.56348 3.21086 7.65252 3.43793 7.80664 3.82324L8.81445 6.34277C8.84912 6.42944 8.89621 6.54337 8.92969 6.66602C8.94305 6.71498 8.95428 6.76465 8.96387 6.81445L8.98731 6.96484L8.99902 7.14844C9.00048 7.20695 9 7.26177 9 7.30859V9.43848C9 9.60644 9.00551 9.82981 8.95996 10.0518C8.92373 10.2282 8.86318 10.3992 8.78125 10.5596C8.67826 10.761 8.5355 10.9315 8.43067 11.0625L6.86133 13.0254C6.51608 13.457 6.30047 13.7268 6.16504 13.9316C6.15634 13.9448 6.14986 13.9582 6.14258 13.9697C6.15621 13.9712 6.17066 13.9751 6.18652 13.9766C6.43103 13.9988 6.7765 14 7.3291 14H16.6719C17.2244 14 17.57 13.9988 17.8145 13.9766C17.8299 13.9752 17.8441 13.9712 17.8574 13.9697C17.8502 13.9584 17.8445 13.9447 17.8359 13.9316C17.7005 13.7268 17.4849 13.457 17.1396 13.0254L15.5703 11.0625C15.4655 10.9315 15.3227 10.761 15.2197 10.5596C15.1378 10.3992 15.0773 10.2281 15.041 10.0518C14.9955 9.82981 15 9.60644 15 9.43848V7.30859ZM17 9.43848C17 9.54986 17.0004 9.60537 17.002 9.64551V9.64844C17.0026 9.64927 17.0032 9.65046 17.0039 9.65137C17.0277 9.68368 17.0624 9.72666 17.1318 9.81348L18.7021 11.7754C19.0226 12.1759 19.3064 12.5303 19.5039 12.8291C19.6912 13.1124 19.9194 13.5136 19.9199 13.998C19.9205 14.607 19.6439 15.1835 19.168 15.5635C18.7893 15.8657 18.3334 15.938 17.9951 15.9688C17.6385 16.0011 17.1846 16 16.6719 16H13V22C13 22.5523 12.5523 23 12 23C11.4479 22.9998 11 22.5521 11 22V16H7.3291C6.81634 16 6.36249 16.0011 6.00586 15.9688C5.66759 15.938 5.21169 15.8658 4.83301 15.5635C4.35705 15.1835 4.08046 14.607 4.08106 13.998C4.08158 13.5135 4.30975 13.1124 4.49707 12.8291C4.69461 12.5303 4.97842 12.1759 5.29883 11.7754L6.86914 9.81348C6.9386 9.72665 6.97325 9.68368 6.99707 9.65137L6.99902 9.64551C7.00061 9.60537 7 9.54986 7 9.43848V7.19434L6.99902 7.19336V7.19141C6.99133 7.17082 6.97999 7.14236 6.95703 7.08496L5.94922 4.56543C5.80936 4.21577 5.67854 3.89052 5.59668 3.61621C5.51403 3.33922 5.43859 2.9823 5.51953 2.59277C5.62681 2.07698 5.933 1.62416 6.37207 1.33301C6.70372 1.11316 7.06367 1.05152 7.35156 1.02539C7.63659 0.999546 7.98685 1 8.36328 1H15.6367C16.0134 1 16.3643 0.999526 16.6494 1.02539C16.9373 1.05152 17.2973 1.11316 17.6289 1.33301C18.0679 1.62416 18.3742 2.07701 18.4814 2.59277C18.5624 2.98228 18.4869 3.33923 18.4043 3.61621C18.3224 3.8906 18.1907 4.21566 18.0508 4.56543L17.043 7.08496C17.02 7.14232 17.0097 7.17083 17.002 7.19141L17.001 7.19336C17.0005 7.21533 17 7.24678 17 7.30859V9.43848Z"
                fill="white"
            />
        </svg>
    );
}

function EateryCard({
    location,
    index = 0,
    partOfMainGrid = false,
    animate = false,
    isPinned,
    onTogglePin,
    showPinButton = true,
}: {
    location: IReadOnlyLocation_Combined;
    index?: number;
    partOfMainGrid?: boolean;
    animate?: boolean;
    isPinned: boolean;
    onTogglePin: () => void;
    showPinButton?: boolean;
}) {
    const {
        name,
        location: physicalLocation,
        url,
        shortDescription,
        menu,
        todaysSpecials = [],
        todaysSoups = [],
    } = location;

    const [openedModal, setOpenedModal] = useState<'none' | 'specials' | 'description'>('none');

    return (
        <Grid item xs={12} md={4} lg={3} xl={3}>
            <div
                className={`card ${animate ? 'card--animated' : ''} ${partOfMainGrid ? 'card--in-main-grid' : ''}`}
                style={{ '--card-show-delay': `${index * 50}ms` }}
            >
                <EateryCardHeader location={location} />
                <CardContent className="card__content">
                    <NameText variant="h6">
                        <CustomLink href={url} target="_blank">
                            {name}
                        </CustomLink>
                    </NameText>
                    <LocationText variant="subtitle2">{physicalLocation}</LocationText>
                    <DescriptionText>{shortDescription}</DescriptionText>
                </CardContent>
                <div className="card__actions">
                    {menu && (
                        <ActionButton
                            onClick={() => {
                                window.open(menu, '_blank');
                            }}
                        >
                            Menu
                        </ActionButton>
                    )}
                    {(todaysSpecials.length !== 0 || todaysSoups.length !== 0) && (
                        <ActionButton
                            onClick={() => {
                                setOpenedModal('specials');
                            }}
                        >
                            Specials
                        </ActionButton>
                    )}
                    <ActionButton
                        onClick={() => {
                            setOpenedModal('description');
                        }}
                    >
                        Details
                    </ActionButton>
                    <div className="card__pin-container">
                        {showPinButton && (
                            <Tooltip title={isPinned ? 'Unpin' : 'Pin'}>
                                <Button
                                    aria-label={isPinned ? 'Unpin Card' : 'Pin Card'}
                                    onClick={onTogglePin}
                                    className={`card__pin-button ${isPinned ? 'card__pin-button--pinned' : ''}`}
                                    size="small"
                                >
                                    {isPinned ? <PinIcon /> : <UnpinIcon />}
                                </Button>
                            </Tooltip>
                        )}
                    </div>
                </div>
                <EateryCardDialog
                    open={openedModal === 'specials'}
                    onClose={() => setOpenedModal('none')}
                    location={location}
                    type="specials"
                />
                <EateryCardDialog
                    open={openedModal === 'description'}
                    onClose={() => setOpenedModal('none')}
                    location={location}
                    type="description"
                />
            </div>
        </Grid>
    );
}
function EateryCardHeader({ location }: { location: IReadOnlyLocation_Combined }) {
    const dotRef = useRef<HTMLDivElement | null>(null);
    const statusChangesSoon = !location.closedLongTerm && location.changesSoon;
    useEffect(() => {
        const dotAnimation = dotRef.current?.getAnimations()[0];
        if (!statusChangesSoon) {
            dotAnimation?.cancel(); // delete any dot blinking animation (if it exists)
        } else {
            // eslint-disable-next-line no-lonely-if
            if (dotAnimation !== undefined) {
                dotAnimation.startTime = 0;
                dotAnimation.play();
            }
        }
    }, [statusChangesSoon]);
    return (
        <StyledCardHeader
            title={
                <StatusText variant="subtitle1" state={location.locationState} className="card__header__text">
                    {location.statusMsg}
                </StatusText>
            }
            state={location.locationState}
            avatar={
                <div
                    className={`card__header__dot ${statusChangesSoon ? 'card__header__dot--blinking' : ''}`}
                    style={{
                        backgroundColor: highlightColors[location.locationState],
                    }}
                    ref={dotRef}
                />
            }
            className="card__header"
        />
    );
}
function EateryCardDialog({
    open,
    type,
    onClose,
    location,
}: {
    open: boolean;
    type: 'specials' | 'description';
    onClose: () => void;
    location: IReadOnlyLocation_Combined;
}) {
    const { location: physicalLocation, name, url, todaysSoups = [], todaysSpecials = [], description } = location;
    const timeSlots = getTimeSlotsString(location.times);
    const dayOffsetFromSunday = DateTime.now().weekday % 7; // literally will be refreshed every second because location status is. This is fine
    const daysStartingFromSunday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                style: {
                    backgroundColor: 'transparent',
                    margin: 15,
                },
            }}
        >
            <div className="card card--dialog">
                <EateryCardHeader location={location} />
                <CardContent className="card__content" sx={{ overflowY: 'auto' }}>
                    <NameText variant="h6">
                        <CustomLink href={url} target="_blank">
                            {name}
                        </CustomLink>
                    </NameText>
                    <LocationText variant="subtitle2">{physicalLocation}</LocationText>
                    {type === 'specials' &&
                        todaysSpecials.concat(todaysSoups).map((special) => (
                            <StyledAccordion key={special.title}>
                                <StyledAccordionSummary
                                    expandIcon={
                                        <ExpandMoreIcon
                                            style={{
                                                color: 'var(--card-text-description)',
                                            }}
                                        />
                                    }
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <DescriptionText>{special.title}</DescriptionText>
                                </StyledAccordionSummary>
                                <StyledAccordionDetails>
                                    <LocationText>{special.description}</LocationText>
                                </StyledAccordionDetails>
                            </StyledAccordion>
                        ))}
                    {type === 'description' && (
                        <>
                            <LongDescriptionText variant="subtitle1">{description}</LongDescriptionText>
                            <StyledAccordion disableGutters style={{ marginTop: 24 }}>
                                <StyledAccordionSummary
                                    className="accordion__summary"
                                    expandIcon={
                                        <ExpandMoreIcon
                                            style={{
                                                color: 'var(--card-text-description)',
                                            }}
                                        />
                                    }
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    Show weekly hours
                                </StyledAccordionSummary>

                                <StyledAccordionDetails>
                                    {Array(7)
                                        .fill(true)
                                        .map((_, i) => {
                                            const realI = (i + dayOffsetFromSunday) % 7;
                                            return (
                                                <div
                                                    style={{
                                                        marginBottom: '10px',
                                                        fontWeight: realI === dayOffsetFromSunday ? 'bold' : 'normal',
                                                        color: realI === dayOffsetFromSunday ? 'white' : '',
                                                    }}
                                                    key={daysStartingFromSunday[realI]}
                                                >
                                                    <span style={{ color: 'white' }}>
                                                        {daysStartingFromSunday[realI]}
                                                    </span>
                                                    : {timeSlots[realI]}
                                                </div>
                                            );
                                        })}
                                </StyledAccordionDetails>
                            </StyledAccordion>
                        </>
                    )}
                </CardContent>
                <ExitButton onClick={onClose}>Close</ExitButton>
            </div>
        </Dialog>
    );
}

export default EateryCard;
