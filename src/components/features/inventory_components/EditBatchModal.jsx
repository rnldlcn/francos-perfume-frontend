import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Minus, Plus, X } from "lucide-react";
import { useState } from "react";

const EditBatchModal = ({ isOpen, onClose, batch, onSave }) => {
  
  const [batchId, setBatchId] = useState(batch?.batchId || 0);
  const [batchDisplayId, setBatchDisplayId] = useState(batch?.batchDisplayId || "");
  const [productName, setProductName] = useState(batch?.productName || "")
  const [quantity, setQuantity] = useState(batch?.quantity || 0);
  const [targetDate, setTargetDate] = useState(batch?.targetDate || "");
  const [reason, setReason] = useState("Restock");

  const handleSave = () => {
    onSave({
      batchId,  
      batchDisplayId,
      productName,
      quantity,
      targetDate,
      reason,
    });
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md font-montserrat p-8" showCloseButton={true}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#333]">
            Edit Batch: {batchDisplayId}
          </DialogTitle>
        </DialogHeader>

        <div className="py-6 space-y-5">
          {/* Selected Perfume */}
          <div className="flex items-center justify-between gap-4">
            <span className="w-1/3 text-sm text-gray-400 font-medium">Selected Perfume:</span>
            <span className="w-2/3 font-bold text-[#333] text-base">{productName}</span>
          </div>

          {/* Target Date */}
          <div className="flex items-center justify-between gap-4">
            <span className="w-1/3 text-sm text-gray-400 font-medium">Target Date:</span>
            <div className="w-2/3">
              <Input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full text-gray-600 bg-white"
              />
            </div>
          </div>

          {/* Stock Adjustment */}
          <div className="flex items-center justify-between gap-4">
            <span className="w-1/3 text-sm text-gray-400 font-medium">Stock Adjustment:</span>
            <div className="w-2/3 flex items-center gap-2">
              <Button 
                variant="primary" 
                size="icon-sm" 
                className="bg-[#E5D5C1] hover:bg-[#d4c2ab] text-[#333]" 
                onClick={() => setQuantity(q => q + 1)}
              >
                <Plus size={16} />
              </Button>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-24 text-center font-bold text-lg focus:ring-[#E5D5C1]"
              />
              <Button 
                variant="primary" 
                size="icon-sm" 
                className="bg-[#E5D5C1] hover:bg-[#d4c2ab] text-[#333]" 
                onClick={() => setQuantity(q => Math.max(0, q - 1))}
              >
                <Minus size={16} />
              </Button>
            </div>
          </div>

          {/* Reason for Edit */}
          <div className="flex items-center justify-between gap-4">
            <span className="w-1/3 text-sm text-gray-400 font-medium">Reason for edit:</span>
            <div className="w-2/3">
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Restock">Restock</SelectItem>
                  <SelectItem value="Correction">Correction</SelectItem>
                  <SelectItem value="Damaged">Damaged</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter className="flex w-full justify-between sm:justify-between pt-2">
          <Button variant="ghost" className="gap-2 text-[#D47B7B] hover:text-red-700 hover:bg-red-50 bg-[#EAE7DF]/40" onClick={onClose}>
            <X size={16} /> Cancel
          </Button>
          <Button variant="primary" className="gap-2 px-8 shadow-sm" onClick={handleSave}>
            <Check size={16} /> Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditBatchModal;