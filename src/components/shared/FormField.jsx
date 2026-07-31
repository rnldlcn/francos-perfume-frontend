import { Input } from "../ui/input";
import { Label } from "../ui/label";

const FormField = ({ label, value, onChange, type = "text", placeholder }) => {
    return (
        <div className="flex flex-col gap-2">
        <Label>{label}</Label>
        <Input 
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
        />
    </div>
    )
    
}


export default FormField;