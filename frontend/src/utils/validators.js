export function isValidPhone(phone) {
    return /^[6-9]\d{9}$/.test(phone);
}

export function required(value) {
    return value && value.trim().length > 0;
}
