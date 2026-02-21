import css from './SortByDropdown.module.css';

export type SortByOption = '' | 'default' | 'distance';

type SortByDropdownProps = {
    value: SortByOption;
    onChange: (option: SortByOption) => void;
};

function SortByDropdown({ value, onChange }: SortByDropdownProps) {
    return (
        <select
            className={css.select}
            value={value}
            onChange={(e) => onChange(e.target.value as SortByOption)}
        >
            <option value="">Sort by</option>
            <option value="default">Default</option>
            <option value="distance">Location</option>
        </select>
    );
}

export default SortByDropdown;
