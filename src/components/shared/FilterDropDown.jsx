import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const FilterDropDown = ({ filter, updateFilter, filterSelections }) => {  
    return (
      <div className="flex items-center gap-6">
        {filterSelections?.map((option) => (
          <Select
            key={option.key}
            value={filter[option.key] || '__all__'}
            onValueChange={(val) => updateFilter(option.key, val === '__all__' ? '' : val)}>
            <SelectTrigger className="w-40">
                <SelectValue placeholder={option.label} />
            </SelectTrigger>
            <SelectContent>
                {option.options.map((opt) => (
                    <SelectItem
                        key={opt.label}
                        value={opt.value || '__all__'}
                    >
                        {opt.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
        ))}
    </div>
    )
}

export default FilterDropDown;