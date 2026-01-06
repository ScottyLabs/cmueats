import { useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { $api, fetchClient } from '../api';
import css from './ReviewPage.module.css';
import LikeIcon from '../assets/control_buttons/like.svg?react';
import DislikeIcon from '../assets/control_buttons/dislike.svg?react';
import PencilIcon from '../assets/control_buttons/pencil.svg?react';

interface Tag {
    id: number;
    name: string;
    totalVotes: number;
    totalLikes: number;
    myReview: {
        vote: boolean;
        text: string | null;
        createdAt: number;
        updatedAt: number;
    } | null;
}
function Tag({ tag, locationId }: { tag: Tag; locationId: string }) {
    const queryClient = useQueryClient();
    const toggleVote = (voteUp: boolean) =>
        fetchClient
            .PUT('/v2/locations/{locationId}/reviews/tags/{tagId}/me', {
                params: { path: { locationId, tagId: tag.id.toString() } },
                body: { voteUp: tag.myReview?.vote === voteUp ? undefined : voteUp },
            })
            .then(() => {
                queryClient.refetchQueries(
                    $api.queryOptions('get', '/v2/locations/{locationId}/reviews/summary', {
                        params: { path: { locationId } },
                    }),
                );
            });
    const upvotePercent = (tag.totalLikes / tag.totalVotes) * 100 || 0; // in case of divsion by 0
    const greenRectCount = Math.floor(upvotePercent / 10);

    return (
        <>
            <div className={css.tag__percent}>{upvotePercent}%</div>
            <div
                className={clsx(css['tag__bar-indicator'], tag.totalVotes === 0 && css['tag__bar-indicator--inactive'])}
            >
                {Array(greenRectCount)
                    .fill(undefined)
                    .map((_, i) => (
                        <div className={css['bar-indicator__bar']} aria-selected />
                    ))}
                {Array(10 - greenRectCount)
                    .fill(undefined)
                    .map((_, i) => (
                        <div className={css['bar-indicator__bar']} />
                    ))}
            </div>
            <div className={css.tag__name}>{tag.name}</div>
            <button
                aria-pressed={tag.myReview?.vote === true}
                className={clsx(css.tag__vote, css.tag__like)}
                onClick={() => toggleVote(true)}
                type="button"
            >
                <LikeIcon />
                {tag.totalLikes}
            </button>
            <button
                className={clsx(css.tag__vote, css.tag__dislike)}
                onClick={() => toggleVote(false)}
                type="button"
                aria-pressed={tag.myReview?.vote === false}
            >
                <DislikeIcon />
                {tag.totalVotes - tag.totalLikes}
            </button>
            <button className={css['tag__review-button']}>
                <PencilIcon />
                Review
            </button>
        </>
    );
}

export default function ReviewPage({ locationId }: { locationId: string }) {
    const {
        data: reviewSummary,
        isLoading,
        error,
    } = $api.useQuery('get', '/v2/locations/{locationId}/reviews/summary', {
        params: { path: { locationId } },
    });
    if (error) return <div>Failed to load reviews!</div>;
    return (
        <div>
            <section className={css['star-section']}>
                <div className={css.stars}>
                    <div className={css['stars__global-rating']}>{reviewSummary?.starData.avg ?? 'NO'} </div>
                    <div className={css['stars__personal-rating']}>
                        {reviewSummary?.starData.personalRating ?? 'NO'}
                    </div>
                </div>
            </section>
            <section className={css['tag-section']}>
                <ul className={css['tag-list']}>
                    {reviewSummary?.tagData.map((tag) => (
                        <Tag tag={tag} key={tag.id} locationId={locationId} />
                    ))}
                </ul>
            </section>
        </div>
    );
}
