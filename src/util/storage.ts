export function getPinnedIds(): Record<string, true> {
    try {
        const arr = JSON.parse(localStorage.getItem('pinnedEateries') ?? '[]');
        return Object.fromEntries((arr as string[]).map((id) => [id, true]));
    } catch {
        return {};
    }
}

export function setPinnedIds(obj: Record<string, true>) {
    const arr = Object.keys(obj);
    localStorage.setItem('pinnedEateries', JSON.stringify(arr));
}
