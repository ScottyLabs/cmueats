import { createContext, Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from 'react';
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
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DateTime } from 'luxon';

import { getTimeSlotsString } from '../util/time';
import TextProps from '../types/interfaces';
import { IReadOnlyLocation_Combined, LocationState } from '../types/locationTypes';
import './EateryCard.css';
import { highlightColors, textColors } from '../constants/colors';
import { DrawerContext } from '../pages/ListPage';
import EateryCardHeader from './EateryCardHeader';
import EateryCardContent from './EateryCardContent';

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
    const drawerContext = useContext(DrawerContext);

    const isDouble = drawerContext.isDrawerActive ? 2 : 1;
    return (
        <Grid item xs={12} md={4 * isDouble} lg={3 * isDouble} xl={2 * isDouble}>
            <div
                className={`card ${animate ? 'card-animated' : ''} ${partOfMainGrid ? 'card-in-main-grid' : ''}`}
                style={{ '--card-show-delay': `${index * 50}ms` }}
            >
                <EateryCardHeader location={location} />
                <EateryCardContent location={location} />
            </div>
        </Grid>
    );
}

export default EateryCard;
