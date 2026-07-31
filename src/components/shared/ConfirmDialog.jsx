import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

const ConfirmDialog = ({ isOpen, onClose, config }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!config) return null;

    const handleConfirm = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            if (config.onConfirm) {
                await config.onConfirm();
            }
            onClose();
        } catch (error) {
            // CHANGE THIS TO HAVE AN ERROR
            console.error("Confirmation action failed:", error);
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="relative flex justify-center items-center p-6 border-b border-gray-100">
            <AlertDialog
                open={isOpen}
                onOpenChange={(open) => !open && onClose()}
            >
                <AlertDialogContent>
                    
                    <AlertDialogHeader className="items-center text-center sm:items-center sm:text-center">
                        <AlertDialogTitle className="text-center justify-center font-bold">{config.title}</AlertDialogTitle>
                        <AlertDialogDescription className="mt-2 text-justify"><span className="text-custom-gray">{config.description || null}</span></AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter className="w-full sm:flex-col sm:justify-stretch">
                        <div className="grid grid-cols-2 gap-6 mt-4 ">
                            <AlertDialogCancel
                                onClick={onClose}
                                variant="outline"
                                className="w-full"
                            >
                                Cancel
                            </AlertDialogCancel>
                            
                            <AlertDialogAction
                                onClick={handleConfirm}
                                variant="destructive"
                                className="w-full"
                            >
                                {config.confirmText || "Confirm"}
                            </AlertDialogAction>
                        </div>
                    </AlertDialogFooter>

                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default ConfirmDialog;