import { useRef } from 'react';
import { SortDesc } from 'lucide-react';
import css from './SelectDropdown.module.css';
import type { SortOption } from '../util/useLocationList';

type SelectSortProps = {
    setSortBy: React.Dispatch<SortOption>;
    sortBy: SortOption;
};

const sortOptionLabels: Record<SortOption, string> = {
    open: 'Sort by Open Status (Default)',
    distance: 'Sort by Distance',
    'rating-highest-open': 'Sort by Highest Rating (Open First)',
    'rating-highest': 'Sort by Highest Rating (All)',
    'rating-lowest': 'Sort by Lowest Rating (All)',
};

function SelectSort({ setSortBy, sortBy }: SelectSortProps) {
    const selectRef = useRef<HTMLSelectElement>(null);

    return (
        <div className={css.container}>
            <div className={css['icon-div']}>
                <SortDesc />
            </div>
            <select
                ref={selectRef}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className={css.select}
            >
                {(Object.keys(sortOptionLabels) as SortOption[]).map((option) => (
                    <option key={option} value={option}>
                        {sortOptionLabels[option]}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default SelectSort;
