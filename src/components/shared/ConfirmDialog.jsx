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

const ConfirmDialog = ({ isOpen, onClose, config }) => {
    if (!config) return null;

    const handleConfirm = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            if (config.onConfirm) {
                await config.onConfirm();
            }
            onClose();
        } catch (error) {
            console.error("Confirmation action failed:", error);
        }
    };

    const handleCancel = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onClose();
    }

    const confirmVariant = config.confirmVariant || "destructive";
    const isAlertOnly = config.isAlert === true;

    return (
        <AlertDialog
            open={isOpen}
            onOpenChange={(open) => !open && onClose()}
        >
            <AlertDialogContent>

                <AlertDialogHeader className="items-center text-center sm:items-center sm:text-center">
                    <AlertDialogTitle className="text-center justify-center font-bold">
                        {config.title}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="mt-2 text-justify">
                        <span className="text-muted-foreground">{config.description || null}</span>
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="w-full sm:flex-col sm:justify-stretch">
                    <div className={`grid ${isAlertOnly ? 'grid-cols-1' : 'grid-cols-2'} gap-6 mt-4 w-full`}>
                        {!isAlertOnly && (
                            <AlertDialogCancel
                                onClick={handleCancel}
                                variant="outline"
                                className="w-full"
                            >
                                {config.cancelText || "Cancel"}
                            </AlertDialogCancel>
                        )}

                        <AlertDialogAction
                            onClick={handleConfirm}
                            variant={confirmVariant}
                            className="w-full"
                        >
                            {config.confirmText || (isAlertOnly ? "OK" : "Confirm")}
                        </AlertDialogAction>
                    </div>
                </AlertDialogFooter>

            </AlertDialogContent>
        </AlertDialog>
    )
}

export default ConfirmDialog;