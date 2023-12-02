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

const StyledCardContent = styled(CardContent)({
	space: '10px',
});

const StyledSkeletonText = styled(Skeleton)({
	marginBottom: '12px',
});

function EateryCardSkeleton() {
	return (
		<Grid item xs={12} md={4} lg={3} xl={3}>
			<StyledCard>
				<StyledCardHeader
					title={
						<Skeleton variant="text" sx={{ fontSize: '1rem' }} />
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
							/>
						</Avatar>
					}
				/>
				<StyledCardContent>
					<StyledSkeletonText
						variant="text"
						sx={{ fontSize: '2rem' }}
					/>
					<StyledSkeletonText
						variant="text"
						sx={{ fontSize: '1rem' }}
					/>
					<StyledSkeletonText
						variant="text"
						sx={{ fontSize: '1.2rem' }}
					/>
				</StyledCardContent>
			</StyledCard>
		</Grid>
	);
}

export default EateryCardSkeleton;
