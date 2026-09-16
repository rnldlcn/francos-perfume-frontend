import { Input } from "../ui/input";
import { Label } from "../ui/label";

const FormField = ({ label, value, onChange, type = "text", placeholder, error }) => {
    return (
        <div className="flex flex-col gap-2">
        <Label>{label}</Label>
        <Input 
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            aria-invalid={!!error}
        />
        {error && (
            <p className="text-xs font-medium text-destructive mt-0.5">
                {error}
            </p>
        )}
    </div>
    )
    
}


export default FormField;