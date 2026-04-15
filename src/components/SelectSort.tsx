import css from './SelectLocation.module.css';

type SortOption = '' | 'distance';

function SelectSort({ sortBy, setSortBy }: { sortBy: SortOption; setSortBy: React.Dispatch<SortOption> }) {
    return (
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)} className={css.select}>
            <option value="" key="Sort by" label="Sort by" />
            <option value="distance">Distance</option>
        </select>
    );
}

export default SelectSort;
