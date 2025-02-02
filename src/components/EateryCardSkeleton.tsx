import {
	Card,
	CardHeader,
	styled,
	Grid,
	CardContent,
	Avatar,
	Skeleton,
} from '@mui/material';

const StyledCard = styled(Card)({
	backgroundColor: '#23272A',
	border: '2px solid rgba(0, 0, 0, 0.2)',
	textAlign: 'left',
	borderRadius: 7,
	height: '100%',
	justifyContent: 'flex-start',
});

const StyledCardHeader = styled(CardHeader)({
	fontWeight: 500,
	backgroundColor: '#1D1F21',
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
					title={
						<Skeleton
							variant="text"
							sx={{ fontSize: '1rem' }}
							animation={false}
						/>
					}
					avatar={
						<Avatar
							sx={{
								width: 12,
								height: 12,
								backgroundColor: '#1D1F21',
							}}
						>
							<Skeleton
								variant="circular"
								width={40}
								height={40}
								animation={false}
							/>
						</Avatar>
					}
				/>
				<CardContent>
					<SkeletonText
						variant="text"
						sx={{ fontSize: '2rem' }}
						animation={false}
					/>
					<SkeletonText
						variant="text"
						sx={{ fontSize: '1rem' }}
						animation={false}
					/>
					<SkeletonText
						variant="text"
						sx={{ fontSize: '1.2rem' }}
						animation={false}
					/>
				</CardContent>
			</StyledCard>
		</Grid>
	);
}

export default EateryCardSkeleton;
