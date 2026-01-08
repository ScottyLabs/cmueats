import { useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { $api, fetchClient } from '../api';
import css from './ReviewPage.module.css';
import LikeIcon from '../assets/control_buttons/like.svg?react';
import DislikeIcon from '../assets/control_buttons/dislike.svg?react';
import PencilIcon from '../assets/control_buttons/pencil.svg?react';
import { redToGreenInterpolation } from '../util/color';

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
    }, [draftText]);

    useLayoutEffect(() => {
        if (openForEditing) {
            // this conditional is important, since we don't want to early-update draft text when the textbox doesn't exist yet
            setDraftText(currentReview ?? '');
        }
    }, [openForEditing]);

    useLayoutEffect(() => {
        if (openForEditing) {
            // so is this one
            setInputBoxHeight(0); // recalibrate
        }
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
                placeholder="Your review here"
                style={{ height: inputBoxHeight }}
                ref={inputBoxRef}
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
function Tag({ tag, locationId }: { tag: Tag; locationId: string }) {
    const queryClient = useQueryClient();
    const [isDraftingReview, setIsDraftingReview] = useState(false);

    const toggleVote = async (voteUp: boolean) => {
        const removeExistingVote = tag.myReview?.vote === voteUp;
        if (removeExistingVote && tag.myReview?.text) {
            toast.error('Please delete your written review before unvoting!');
            return;
        }
        const { error } = await fetchClient
            .PUT('/v2/locations/{locationId}/reviews/tags/{tagId}/me', {
                params: { path: { locationId, tagId: tag.id.toString() } },
                body: {
                    voteUp: removeExistingVote ? undefined : voteUp,
                    text: tag.myReview?.text ?? undefined,
                },
            })
            .catch((er) => ({ error: er }));

        if (error) {
            toast.error('Failed to vote! Are you logged in?');
        } else {
            await queryClient.refetchQueries(
                $api.queryOptions('get', '/v2/locations/{locationId}/reviews/summary', {
                    params: { path: { locationId } },
                }),
            );
        }
    };
    const updateReview = async (review: string | undefined) => {
        if (review?.length === 0) return;
        const { error } = await fetchClient
            .PUT('/v2/locations/{locationId}/reviews/tags/{tagId}/me', {
                params: { path: { locationId, tagId: tag.id.toString() } },
                body: { voteUp: tag.myReview?.vote, text: review },
            })
            .catch((e) => ({ error: e }));
        if (error) {
            toast.error(`Failed to ${review === undefined ? 'delete' : 'save'} review!`);
        } else {
            await queryClient.refetchQueries(
                $api.queryOptions('get', '/v2/locations/{locationId}/reviews/summary', {
                    params: { path: { locationId } },
                }),
            );
            setIsDraftingReview(false);
        }
    };
    const upvotePercent = (tag.totalLikes / tag.totalVotes) * 100 || 0; // in case of divsion by 0
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
                        saveNewReview={updateReview}
                        closeDraft={() => setIsDraftingReview(false)}
                        deleteReview={() => {
                            updateReview(undefined);
                        }}
                    />
                </td>
            </tr>
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
                <table className={css['tag-list']}>
                    <tbody>
                        {reviewSummary?.tagData.map((tag) => (
                            <Tag tag={tag} key={tag.id} locationId={locationId} />
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
}
