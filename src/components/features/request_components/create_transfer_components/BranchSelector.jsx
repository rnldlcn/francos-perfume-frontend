import FormSelect from '@/components/shared/FormSelect';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const BranchSelector = ({ fromBranch, toBranch, onFromChange, onToBranch, onClear, branchOptions }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-foreground mb-4">Branch Information</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
                <FormSelect
                    label="Source Branch (From)"
                    value={fromBranch}
                    onChange={onFromChange}
                    options={branchOptions}
                    placeholder="Select source branch..."
                />
                <FormSelect
                    label="Destination Branch (To)"
                    value={toBranch}
                    onChange={onToBranch}
                    options={branchOptions.filter(b => b.value !== fromBranch)}
                    placeholder="Select destination branch..."
                />
            </div>

            <Button
                variant="outline"
                className="w-full border-dashed border-rose-300 text-rose-500 hover:bg-rose-50 hover:text-rose-600"
                onClick={onClear}
                disabled={!fromBranch && !toBranch}
            >
                <X size={14} /> Clear selected branches
            </Button>
        </div>
    );
};

export default BranchSelector;