export const isValid = {
    required: (value) => 
        !value || value.trim() === '' ? 'This field is required' : null,
    
    email: (value) => 
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Invalid email address' : null,
    
    phone: (value) => 
        !/^(\+63|0)\d{10}$/.test(value.replace(/\s/g, '')) ? 'Invalid phone number' : null,
    
    minLength: (min) => (value) => 
        value.length < min ? `Must be at least ${min} characters` : null,
    
    maxLength: (max) => (value) => 
        value.length > max ? `Must be at most ${max} characters` : null,
    
    noSpecialChars: (value) => 
        /[^a-zA-Z0-9\s]/.test(value) ? 'No special characters allowed' : null,

    numbersOnly: (value) =>
        /\D/.test(value) ? 'Numbers only' : null,
};

export const checkIfValid = (value, rules = []) => {
    for (const rule of rules) {
        const error = rule(value);
        if (error) return error;
    }
    return null; 
}

export const validateForm = (data, schema) => {
    const errors = {};
    for (const field in schema) {
        const error = checkIfValid(data[field], schema[field]);
        if (error) errors[field] = error;
    }
    return errors;
}; 