export const convertBlobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result);
        };
        reader.onerror = () => {
            reject(new Error('Failed to convert Blob to base64'));
        };
        reader.readAsDataURL(blob);
    });
};

export const prepareFormData = (data) => {
    const formData = new FormData();

    for (const key in data) {
        formData.append(key, data[key]);
    }
    return formData;
}