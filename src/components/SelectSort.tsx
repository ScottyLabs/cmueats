import css from './SelectLocation.module.css';

export type SelectSort = 'time' | 'stars-asc' | 'stars-desc';

type SelectSortProps = {
    sortOption: SelectSort;
    setSortOption: React.Dispatch<SelectSort>;
};

function SelectSort({ sortOption, setSortOption }: SelectSortProps) {
    return (
        <select
            onChange={(e) => setSortOption(e.target.value as SelectSort)}
            className={css.select}
            defaultValue={sortOption}
        >
            <option value="time">Sort by Opening</option>
            <option value="stars-desc">Sort by Highest Rating</option>
            <option value="stars-asc">Sort by Lowest Rating</option>
        </select>
    );
}

export default SelectSort;