import _ from 'lodash';
import { prepareFormData } from "./apiHelpers";

const disallowedFileMimeTypes = [
    'application/',
    'image/',
    'video/',
    'audio/',
    'font/',
];
const defaultMaxResponseSizeLimit = 100; // 100 KB

async function apiRequest(url, method, data = null, headers = {}, contentType = "json") {
    const options = {
        method,
    };

    if (headers) {
        options.headers = headers;
    }

    if (data && !_.isEmpty(data)) {
        options.body = contentType == 'form' ? prepareFormData(data) : JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentLength = response.headers.get("content-length");
        const maxResponseSizeLimit = (logseq.settings.maxResponseSizeLimit || defaultMaxResponseSizeLimit) * 1024;
        if (contentLength && Number(contentLength) > maxResponseSizeLimit) {
            throw new Error(`Response size exceeds the maximum allowed size.`);
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return { 'type': 'json', 'value': await response.json() };
        }

        if (contentType && disallowedFileMimeTypes.some(type => contentType.startsWith(type))) {
            throw new Error("File response is unsupported as it could potentially lead to issues.");
        }

        return { 'type': 'text', 'value': await response.text() };
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

export default apiRequest;