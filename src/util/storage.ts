export function getPinnedIds(): string[] {
	try {
		return JSON.parse(localStorage.getItem('pinnedEateries') ?? '[]');
	} catch {
		return [];
	}
}

export function setPinnedIds(pinned: string[]) {
	localStorage.setItem('pinnedEateries', JSON.stringify(pinned));
}
