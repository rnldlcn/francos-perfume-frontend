import { X } from "lucide-react";

const CloseButton = ({ onClose }) => {
    return (
        <button
            className="absolute right-6 p-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer rounded-md hover:bg-muted"
            onClick={onClose} 
            >
            <X className="h-6 w-6 text-foreground"/>
        </button>
    )
}

export default CloseButton;