import css from './SelectLocation.module.css';

export type SelectSort = 'time' | 'stars-desc-open' | 'stars-asc' | 'stars-desc';

type SelectSortProps = {
    sortOption: SelectSort;
    setSortOption: React.Dispatch<SelectSort>;
};

function SelectSortControl({ sortOption, setSortOption }: SelectSortProps) {
    return (
        <select
            onChange={(e) => setSortOption(e.target.value as SelectSort)}
            className={css.select}
            value={sortOption}
            aria-label="Sort results"
        >
            <option value="time">Sort by Opening</option>
            <option value="stars-desc-open">Sort by Highest Rating (Open Only)</option>
            <option value="stars-desc">Sort by Highest Rating (All)</option>
            <option value="stars-asc">Sort by Lowest Rating (All)</option>
        </select>
    );
}

export default SelectSortControl;