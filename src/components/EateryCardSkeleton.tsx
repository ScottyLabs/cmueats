import { Card, CardHeader, styled, Grid, CardContent, Avatar, Skeleton } from '@mui/material';
import IS_MIKU_DAY from '../util/constants';
import mikuDancingUrl from '../assets/miku/miku-dancing.svg';

const StyledCard = styled(Card)({
    backgroundColor: 'var(--card-bg)',
    border: 'var(--card-border-width) solid var(--card-border-color)',
    textAlign: 'left',
    borderRadius: 7,
    height: '100%',
    justifyContent: 'flex-start',
});

const StyledCardHeader = styled(CardHeader)({
    fontWeight: 500,
    backgroundColor: 'var(--card-header-bg)',
});

const SkeletonText = styled(Skeleton)({
    marginBottom: '12px',
});

function EateryCardSkeleton({ index }: { index: number }) {
    return (
        <Grid item xs={12} md={4} lg={3} xl={3}>
            <StyledCard
                className="skeleton-card--animated"
                style={{
                    '--oscillate-delay': `${1.4 + index * 0.1}s`, // let the skeleton cards fade in first before oscillating
                }}
            >
                <StyledCardHeader
                    title={<Skeleton variant="text" sx={{ fontSize: '1rem' }} animation={false} />}
                    avatar={
                        IS_MIKU_DAY ? (
                            <Avatar
                                sx={{
                                    width: 40,
                                    height: 40,
                                    backgroundColor: 'transparent',
                                }}
                            >
                                <img
                                    src={mikuDancingUrl}
                                    alt="Loading Miku!"
                                    style={{ width: '30px', height: '30px' }}
                                />
                            </Avatar>
                        ) : (
                            <Avatar
                                sx={{
                                    width: 12,
                                    height: 12,
                                    backgroundColor: 'var(--card-header-bg)',
                                }}
                            >
                                <Skeleton variant="circular" width={40} height={40} animation={false} />
                            </Avatar>
                        )
                    }
                />
                <CardContent>
                    <SkeletonText variant="text" sx={{ fontSize: '2rem' }} animation={false} />
                    <SkeletonText variant="text" sx={{ fontSize: '1rem' }} animation={false} />
                    <SkeletonText variant="text" sx={{ fontSize: '1.2rem' }} animation={false} />
                </CardContent>
            </StyledCard>
        </Grid>
    );
}

export default EateryCardSkeleton;
