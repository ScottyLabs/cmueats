import { LocationState } from '../types/locationTypes';

export const textColors: Record<LocationState, string> = {
    [LocationState.OPEN]: 'var(--location-open-text-color)',
    [LocationState.CLOSED]: 'var(--location-closed-text-color)',
    [LocationState.CLOSED_LONG_TERM]: 'var(--location-closed-long-term-text-color)',
    [LocationState.OPENS_SOON]: 'var(--location-opens-soon-text-color)',
    [LocationState.CLOSES_SOON]: 'var(--location-closes-soon-text-color)',
};

// highlight is for both the underline and dot color
export const highlightColors: Record<LocationState, string> = {
    [LocationState.OPEN]: 'var(--location-open-highlight)',
    [LocationState.CLOSED]: 'var(--location-closed-highlight)',
    [LocationState.CLOSED_LONG_TERM]: 'var(--location-closed-long-term-highlight)',
    [LocationState.OPENS_SOON]: 'var(--location-opens-soon-highlight)',
    [LocationState.CLOSES_SOON]: 'var(--location-closes-soon-highlight)',
};
export const mapMarkerBackgroundColors: Record<LocationState, string> = {
    [LocationState.OPEN]: 'var(--location-open-text-color)',
    [LocationState.CLOSED]: 'var(--location-closed-text-color)',
    [LocationState.CLOSED_LONG_TERM]: 'var(--location-closed-long-term-text-color)',
    [LocationState.OPENS_SOON]: 'var(--location-opens-soon-text-color)',
    [LocationState.CLOSES_SOON]: 'var(--location-closes-soon-text-color)',
};

export const mapMarkerTextColors: Record<LocationState, string> = {
    [LocationState.OPEN]: 'var(--map-open-text-color)',
    [LocationState.CLOSED]: 'var(--map-closed-text-color)',
    [LocationState.CLOSED_LONG_TERM]: 'var(--map-closed-long-term-text-color)',
    [LocationState.OPENS_SOON]: 'var(--map-opens-soon-text-color)',
    [LocationState.CLOSES_SOON]: 'var(--map-closes-soon-text-color)',
};
