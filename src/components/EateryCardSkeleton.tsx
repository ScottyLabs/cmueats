import { Card, CardHeader, styled, Grid, CardContent, Avatar, Skeleton } from '@mui/material';

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
                    title={<Skeleton variant="text" sx={{ fontSize: '16px' }} animation={false} />}
                    avatar={
                        <Avatar
                            sx={{
                                width: 12,
                                height: 12,
                                backgroundColor: 'var(--card-header-bg)',
                            }}
                        >
                            <Skeleton variant="circular" width={40} height={40} animation={false} />
                        </Avatar>
                    }
                />
                <CardContent>
                    <SkeletonText variant="text" sx={{ fontSize: '32px' }} animation={false} />
                    <SkeletonText variant="text" sx={{ fontSize: '16px' }} animation={false} />
                    <SkeletonText variant="text" sx={{ fontSize: '19.2px' }} animation={false} />
                </CardContent>
            </StyledCard>
        </Grid>
    );
}

export default EateryCardSkeleton;
