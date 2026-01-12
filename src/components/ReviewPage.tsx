import { useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { MethodResponse } from 'openapi-react-query';
import { $api, fetchClient } from '../api';
import css from './ReviewPage.module.css';
import LikeIcon from '../assets/control_buttons/like.svg?react';
import DislikeIcon from '../assets/control_buttons/dislike.svg?react';
import EmptyStarIcon from '../assets/control_buttons/starEmpty.svg?react';
import FilledStarIcon from '../assets/control_buttons/starFilled.svg?react';
import PencilIcon from '../assets/control_buttons/pencil.svg?react';
import DeleteIcon from '../assets/control_buttons/delete.svg?react';
import { redToGreenInterpolation } from '../util/color';
import { useContainerWidth } from '../contexts/ScreenWidth';
import AllTagReviews from './AllTagReviews';

type APISummaryType = MethodResponse<typeof $api, 'get', '/v2/locations/{locationId}/reviews/summary'>;

const MIN_INPUT_HEIGHT_PX = 100;
function BarIndicator({ upvotePercent, inactive }: { upvotePercent: number; inactive: boolean }) {
    const greenRectCount = Math.floor(upvotePercent / 10);

    return (
        <div className={clsx(css['tag__bar-indicator'], inactive && css['tag__bar-indicator--inactive'])}>
            {Array(greenRectCount)
                .fill(undefined)
                .map((_, i) => (
                    <div className={css['bar-indicator__bar']} aria-selected key={i} />
                ))}
            {Array(10 - greenRectCount)
                .fill(undefined)
                .map((_, i) => (
                    <div className={css['bar-indicator__bar']} key={i} />
                ))}
        </div>
    );
}
function StarDisplay({
    starRating,
    setNewRating,
    deleteRating,
    starHeight,
    starGap,
}: {
    starRating: number | null;
    setNewRating?: (rating: number) => void;
    deleteRating?: () => void;
    starHeight: number;
    starGap: number;
}) {
    const [hoverCount, setHoverCount] = useState<number>(); // ranges from 1-10
    const findStarCutoffPercent = () => {
        const percent = (hoverCount !== undefined ? hoverCount / 10 : starRating !== null ? starRating / 5 : 0) * 100;
        const gapsCovered = Math.floor((percent - 0.00001) / 20);
        // raw percentage includes the 4 gaps, so we'll need to subtract off 4*STAR_GAP*percentage to get real total star width. we then add on the gaps
        return `calc(${percent}% - ${(4 * starGap * percent) / 100}px + ${gapsCovered * starGap}px)`;
    };

    return (
        <div
            className={css['star-display']}
            style={{ '--star-gap': `${starGap}px`, '--star-height': `${starHeight}px` }}
        >
            <div className={css['star-outer-container']} onMouseLeave={() => setHoverCount(undefined)}>
                <div className={css['empty-star-container']}>
                    {Array(5)
                        .fill(undefined)
                        .map((_, i) => (
                            <EmptyStarIcon key={i} />
                        ))}
                </div>
                <div
                    className={css['filled-star-container']}
                    style={{
                        '--star-cutoff': `${findStarCutoffPercent()}`,
                    }}
                >
                    {Array(5)
                        .fill(undefined)
                        .map((_, i) => (
                            <FilledStarIcon key={i} />
                        ))}
                </div>
                {setNewRating && (
                    <div className={css['invisible-button-container']}>
                        {Array(10)
                            .fill(undefined)
                            .map((_, i) => (
                                <button
                                    key={i}
                                    onMouseEnter={() => setHoverCount(i + 1)}
                                    onClick={() => setNewRating((i + 1) / 2)}
                                    type="button"
                                    aria-label={`Set rating to ${(i + 1) / 2} stars`}
                                />
                            ))}
                    </div>
                )}
            </div>
            {setNewRating && (
                <button
                    className={css['star-display__delete']}
                    disabled={starRating === null}
                    aria-label="delete rating"
                    onClick={deleteRating}
                    type="button"
                >
                    <DeleteIcon />
                </button>
            )}
        </div>
    );
}
function StarDistribution({ distribution }: { distribution: number[] }) {
    return (
        <div className={css['star-distribution']}>
            {distribution.map((d, i) => (
                <div className={css['star-distribution__bar']} key={i} style={{ flexGrow: d }} />
            ))}
        </div>
    );
}
function Ratings({ starData, locationId }: { starData: APISummaryType['starData']; locationId: string }) {
    const queryClient = useQueryClient();
    const totalReviewCount = starData.buckets.reduce((acc, val) => acc + val);
    const drawerWidth = useContainerWidth();

    return (
        <div className={css.stars}>
            <div className={css['stars__global-rating']}>
                <span
                    className={clsx(
                        css['global-rating__number'],
                        starData.avg === null && css['global-rating__number--inactive'],
                    )}
                >
                    {starData.avg?.toFixed(1) ?? '0.0'}
                </span>
                <div className={css['global-rating__info']}>
                    <div className={css['global-rating__info__star-display-wrapper']}>
                        <StarDisplay starRating={starData.avg} starHeight={18} starGap={5} />
                        <div className={css['star-display-wrapper__total-votes']}>({totalReviewCount})</div>
                    </div>
                    <StarDistribution distribution={starData.buckets} />
                </div>
            </div>
            <div className={css['stars__personal-rating']}>
                <span className={css['personal-rating__text']}>Your rating</span>
                <StarDisplay
                    starRating={starData.personalRating}
                    starHeight={drawerWidth > 450 ? 23 : 34}
                    starGap={5}
                    setNewRating={async (stars) => {
                        const { error } = await fetchClient
                            .PUT('/v2/locations/{locationId}/reviews/stars/me', {
                                params: { path: { locationId } },
                                body: { stars },
                            })
                            .catch((e) => ({ error: e }));
                        if (error) {
                            toast.error('Failed to set rating! Are you logged in?');
                        } else {
                            await queryClient.refetchQueries(
                                $api.queryOptions('get', '/v2/locations/{locationId}/reviews/summary', {
                                    params: { path: { locationId } },
                                }),
                            );
                        }
                    }}
                    deleteRating={async () => {
                        const { error } = await fetchClient
                            .DELETE('/v2/locations/{locationId}/reviews/stars/me', {
                                params: { path: { locationId } },
                            })
                            .catch((e) => ({ error: e }));
                        if (error) {
                            toast.error('Failed to delete rating!');
                        } else {
                            await queryClient.refetchQueries(
                                $api.queryOptions('get', '/v2/locations/{locationId}/reviews/summary', {
                                    params: { path: { locationId } },
                                }),
                            );
                        }
                    }}
                />
            </div>
        </div>
    );
}
function ReviewSection({
    currentReview,
    openForEditing,
    saveNewReview,
    closeDraft,
    deleteReview,
}: {
    currentReview: string | null;
    openForEditing: boolean;
    saveNewReview: (text: string) => void;
    closeDraft: () => void;
    deleteReview: () => void;
}) {
    const [inputBoxHeight, setInputBoxHeight] = useState(MIN_INPUT_HEIGHT_PX);
    const [draftText, setDraftText] = useState('');
    const inputBoxRef = useRef<HTMLTextAreaElement | null>(null);

    // listen for `cmd/ctrl` + `enter` for textarea submission
    useEffect(() => {
        if (!openForEditing) return () => {};
        function handleKeyDown(event: KeyboardEvent) {
            if (event.defaultPrevented) return;
            const isMac = navigator.platform.includes('Mac');
            if (
                ((isMac && event.metaKey) || (!isMac && event.ctrlKey)) &&
                event.key === 'Enter' &&
                document.activeElement === inputBoxRef.current
            ) {
                event.preventDefault();
                saveNewReview(draftText);
            }
        }

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [openForEditing, draftText, saveNewReview]);

    useLayoutEffect(() => {
        if (openForEditing) {
            // this conditional is important, since we don't want to early-update draft text when the textbox doesn't exist yet
            setDraftText(currentReview ?? '');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps -- (we don't want the draft input to change mid-edit)
    }, [openForEditing]);

    useLayoutEffect(() => {
        if (openForEditing) {
            setInputBoxHeight(0); // recalibrate
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps -- (we only want to recalibrate height when draftText changes)
    }, [draftText]);

    // focus cursor at end of textarea on input box open
    useEffect(() => {
        if (openForEditing && inputBoxRef.current) {
            inputBoxRef.current.focus();
            inputBoxRef.current.selectionStart = inputBoxRef.current.value.length;
        }
    }, [openForEditing]);

    // the actual height calibration one
    useLayoutEffect(() => {
        if (inputBoxHeight === 0 && inputBoxRef.current) {
            setInputBoxHeight(Math.max(MIN_INPUT_HEIGHT_PX, inputBoxRef.current.scrollHeight + 2)); // the +2 is to account for the border
        }
    }, [inputBoxHeight]); // we 'trigger' a recalibration by setting height to 0

    if (currentReview === null && !openForEditing) return undefined;
    return openForEditing ? (
        <div className={clsx(css['tag__review-container'], css['tag__review-container--edit'])}>
            <textarea
                className={css.review}
                value={draftText}
                onChange={(ev) => {
                    setDraftText(ev.target.value);
                    setInputBoxHeight(0); // recalibrate
                }}
                placeholder="Your review here (anonymous)"
                style={{ height: inputBoxHeight }}
                ref={inputBoxRef}
                maxLength={1000}
            />
            <div className={css['review-control-buttons']}>
                {currentReview && (
                    <button className={css['review-control-buttons__delete']} type="button" onClick={deleteReview}>
                        Delete
                    </button>
                )}
                <button type="button" onClick={closeDraft}>
                    Cancel
                </button>
                <button type="button" onClick={() => saveNewReview(draftText)} disabled={draftText === ''}>
                    Save
                </button>
            </div>
        </div>
    ) : (
        <div className={css['tag__review-container']}>
            <div className={css.review}>{currentReview}</div>
        </div>
    );
}
function Tag({
    tag,
    toggleVote,
    updateReview,
}: {
    tag: APISummaryType['tagData'][0];
    toggleVote: (voteUp: boolean) => Promise<void>;
    updateReview: (review: string | null) => Promise<boolean>;
}) {
    const [isDraftingReview, setIsDraftingReview] = useState(false);

    const upvotePercent = (tag.totalLikes / tag.totalVotes) * 100 || 0; // in case of division by 0
    return (
        <>
            <tr className={css.tag}>
                <td>
                    <BarIndicator upvotePercent={upvotePercent} inactive={tag.totalVotes === 0} />
                </td>
                <td>
                    <div
                        className={css.tag__percent}
                        style={{
                            color:
                                tag.totalVotes > 0 ? redToGreenInterpolation(upvotePercent / 100) : `var(--black-500)`,
                        }}
                    >
                        {upvotePercent}%
                    </div>
                </td>

                <td style={{ width: '100%' }}>
                    <div className={css.tag__name}>{tag.name}</div>
                </td>
                <td>
                    <button
                        aria-pressed={tag.myReview?.vote === true}
                        className={clsx(css.tag__vote, css.tag__like)}
                        onClick={() => toggleVote(true)}
                        type="button"
                    >
                        <LikeIcon />
                        {tag.totalLikes}
                    </button>
                </td>
                <td>
                    <button
                        className={clsx(css.tag__vote, css.tag__dislike)}
                        onClick={() => toggleVote(false)}
                        type="button"
                        aria-pressed={tag.myReview?.vote === false}
                    >
                        <DislikeIcon />
                        {tag.totalVotes - tag.totalLikes}
                    </button>
                </td>
                <td>
                    <button
                        className={css['tag__review-button']}
                        disabled={tag.myReview === null}
                        type="button"
                        onClick={() => setIsDraftingReview(true)}
                    >
                        <PencilIcon />
                        <span className={css['tag__review-button__text']}>
                            {tag.myReview?.text ? 'Edit' : 'Review'}
                        </span>
                    </button>
                </td>
            </tr>
            <tr className={css['tag__review-row']}>
                <td colSpan={6} className={css.tag__review}>
                    <ReviewSection
                        currentReview={tag.myReview?.text ?? null}
                        openForEditing={isDraftingReview}
                        saveNewReview={async (review) => {
                            const success = await updateReview(review);
                            if (success) setIsDraftingReview(false);
                        }}
                        closeDraft={() => setIsDraftingReview(false)}
                        deleteReview={async () => {
                            const success = await updateReview(null);
                            if (success) setIsDraftingReview(false);
                        }}
                    />
                </td>
            </tr>
        </>
    );
}

export default function ReviewPage({ locationId }: { locationId: string }) {
    const { data: reviewSummary, error } = $api.useQuery('get', '/v2/locations/{locationId}/reviews/summary', {
        params: { path: { locationId } },
    });
    const tagVoteProcessing = useRef(false);
    const [page, setPage] = useState<'summary' | 'tag-reviews'>('summary');
    const queryClient = useQueryClient();

    const revalidateData = async () => {
        await Promise.all([
            queryClient.refetchQueries(
                $api.queryOptions('get', '/v2/locations/{locationId}/reviews/summary', {
                    params: { path: { locationId } },
                }),
            ),
            queryClient.refetchQueries(
                $api.queryOptions('get', '/v2/locations/{locationId}/reviews/tags', {
                    params: { path: { locationId } },
                }),
            ),
        ]);
    };

    if (error) return <div>Failed to load reviews!</div>;
    if (reviewSummary === undefined) return <div>Loading...</div>;
    return page === 'summary' ? (
        <div>
            <section className={css['star-section']}>
                <Ratings starData={reviewSummary.starData} locationId={locationId} />
            </section>
            <section className={css['tag-section']}>
                <div className={css['tag-section__header']}>
                    <span>Tags</span>
                    <button
                        className={css['tag-section__see-all-button']}
                        type="button"
                        onClick={() => setPage('tag-reviews')}
                    >
                        See all tag reviews
                    </button>
                </div>
                <table className={css['tag-section__list']}>
                    <tbody>
                        {reviewSummary?.tagData.map((tag) => (
                            <Tag
                                tag={tag}
                                key={tag.id}
                                toggleVote={async (voteUp) => {
                                    if (tagVoteProcessing.current) return; // guarantee that `reviewSummary` represents a correct summary
                                    const removeExistingVote = tag.myReview?.vote === voteUp;
                                    if (removeExistingVote && tag.myReview?.text) {
                                        toast.error('Please delete your written review before unvoting!');
                                        return;
                                    }

                                    tagVoteProcessing.current = true;
                                    const newReviewSummary: typeof reviewSummary = {
                                        starData: reviewSummary.starData,
                                        tagData: reviewSummary.tagData.map((originalTag) => {
                                            if (originalTag.id !== tag.id) return originalTag;
                                            return {
                                                ...originalTag,
                                                totalLikes:
                                                    originalTag.totalLikes +
                                                    (removeExistingVote
                                                        ? voteUp
                                                            ? -1
                                                            : 0
                                                        : voteUp
                                                          ? 1
                                                          : originalTag.myReview
                                                            ? -1
                                                            : 0),
                                                totalVotes:
                                                    originalTag.totalVotes +
                                                    (removeExistingVote ? -1 : originalTag.myReview ? 0 : 1),
                                                myReview: removeExistingVote
                                                    ? null
                                                    : {
                                                          createdAt: originalTag.myReview?.createdAt ?? Date.now(),
                                                          updatedAt: Date.now(),
                                                          text: originalTag.myReview?.text ?? null,
                                                          vote: voteUp,
                                                      },
                                            };
                                        }),
                                    };
                                    queryClient.setQueryData(
                                        $api.queryOptions('get', '/v2/locations/{locationId}/reviews/summary', {
                                            params: { path: { locationId } },
                                        }).queryKey,
                                        newReviewSummary,
                                    );
                                    const { error: updateVoteError } = await fetchClient
                                        .PUT('/v2/locations/{locationId}/reviews/tags/{tagId}/me', {
                                            params: { path: { locationId, tagId: tag.id.toString() } },
                                            body: {
                                                voteUp: removeExistingVote ? null : voteUp,
                                                text: tag.myReview?.text ?? null,
                                            },
                                        })
                                        .catch((er) => ({ error: er }));

                                    if (updateVoteError) {
                                        queryClient.setQueryData(
                                            $api.queryOptions('get', '/v2/locations/{locationId}/reviews/summary', {
                                                params: { path: { locationId } },
                                            }).queryKey,
                                            reviewSummary,
                                        );
                                        toast.error('Failed to vote! Are you logged in?');
                                        tagVoteProcessing.current = false;
                                    } else {
                                        tagVoteProcessing.current = false;
                                        revalidateData();
                                    }
                                }}
                                updateReview={async (review) => {
                                    if (tagVoteProcessing.current) return false; // prevent race-conditions between the refetch here and a failed tag set above
                                    if (review?.length === 0) return false;
                                    const { error: reviewError } = await fetchClient
                                        .PUT('/v2/locations/{locationId}/reviews/tags/{tagId}/me', {
                                            params: { path: { locationId, tagId: tag.id.toString() } },
                                            body: { voteUp: tag.myReview?.vote ?? null, text: review },
                                        })
                                        .catch((e) => ({ error: e }));
                                    if (reviewError) {
                                        toast.error(`Failed to ${review === null ? 'delete' : 'save'} review!`);
                                        return false;
                                    }
                                    await revalidateData();
                                    return true;
                                }}
                            />
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    ) : (
        <AllTagReviews locationId={locationId} goBack={() => setPage('summary')} />
    );
}
