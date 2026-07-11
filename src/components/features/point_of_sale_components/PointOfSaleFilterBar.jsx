import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Filter, Search } from 'lucide-react';

const PointOfSaleFilterBar = ({ filter, updateFilter }) => {

    return (
    <div className="flex gap-3 mb-6 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input 
              type="text" 
              placeholder="Search products..." 
              onChange={(e) => updateFilter('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-slate-800 border-slate-700 hover:bg-slate-700 hover:text-white text-slate-300 gap-2">
                <Filter size={18} />
                Filter {(filter.product_type !== '' || filter.product_gender !== '') && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-slate-900 border-slate-800 text-slate-200">
              <DropdownMenuLabel>Product Type</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-800" />
              {['', 'PREMIUM', 'CLASSIC'].map((type) => (
                <DropdownMenuCheckboxItem
                  key={type || 'ALL'}
                  checked={filter.product_type === type}
                  onCheckedChange={() => updateFilter('product_type', type)}
                >
                  {type || 'ALL'}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator className="bg-slate-800" />
              <DropdownMenuLabel>Gender</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-800" />
              {['ALL', 'MEN', 'WOMEN', 'UNISEX'].map((gender) => (
                <DropdownMenuCheckboxItem
                  key={gender || 'ALL'}
                  checked={filter.product_gender === gender}
                  onCheckedChange={() => updateFilter('product_gender', gender)}
                >
                  {gender || 'ALL'}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
  );
};

export default PointOfSaleFilterBar;