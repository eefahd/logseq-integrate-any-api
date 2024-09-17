import apiRequest from "../api/api";
import { convertBlobToBase64 } from "../api/apiHelpers";


export async function processCommand(blockUUID, apiConfig) {
    const selectedBlock = await logseq.Editor.getBlock(blockUUID, { includeChildren: true });
    if (!selectedBlock) {
        logseq.UI.showMsg('No block selected!', "error", { timeout: 3000 });
        return
    }

    logseq.UI.showMsg(
        "Processing your request...",
        "warning",
        { key: "logseq-integrate-any-api-progress-status", timeout: 20000 }
    );

    let inputContent = parseBlockContent(selectedBlock);
    const filePath = await parseFilePath(selectedBlock.content);
    if (filePath) {
        if (apiConfig.inputFileMethod == 'path') {
            inputContent = filePath;
        } else {
            const fileBlob = await readFileBlob(filePath);
            inputContent = apiConfig.contentType === 'form' ? fileBlob : await convertBlobToBase64(fileBlob);
        }
    } else {
        const contentURL = parseURL(selectedBlock.content);
        if (contentURL) {
            inputContent = contentURL
        }
    }

    const headers = JSON.parse(apiConfig.headers);
    let body = apiConfig.body ? JSON.parse(apiConfig.body) : {};
    body = replacePlaceholderWithInputContent(body, inputContent);

    apiRequest(
        apiConfig.endpoint,
        apiConfig.method,
        body,
        headers,
        apiConfig.contentType
    ).then(response => {
        if (response.value) {
            const responseContent = response.value;
            if (apiConfig.responseAction == 'write_child_below') {
                logseq.Editor.insertBlock(blockUUID, responseContent, { before: false, sibling: false });
            } else if (apiConfig.responseAction == 'write_sibling_below') {
                logseq.Editor.insertBlock(blockUUID, responseContent, { before: false, sibling: true })
            } else if (apiConfig.responseAction == 'replace_content') {
                logseq.Editor.updateBlock(blockUUID, responseContent)
            }
        }
    }).then(() => {
        logseq.UI.showMsg('Done!', "success", { timeout: 3000 });
    }).catch((e) => {
        console.log(e);
        logseq.UI.showMsg(`Request Failed! ${e}`, "error", { timeout: 3000 });
    }).finally(() => {
        logseq.UI.closeMsg("logseq-integrate-any-api-progress-status");
    })

}

const parseBlockContent = (block, depth = 0) => {
    const indent = '  '.repeat(depth);
    const dash = depth > 0 ? '- ' : '';
    let parsedContent = `${indent}${dash}${block.content}\n`;

    if (block.children && block.children.length > 0) {
        block.children.forEach(child => {
            parsedContent += parseBlockContent(child, depth + 1);
        });
    }

    return parsedContent;
}

async function parseFilePath(blockContent) {
    try {
        // examples:
        // ![something.pdf](../assets/some_file_name.pdf)
        // [something.docx](../assets/some_file_name.docx)
        const markdownFilePattern = /^!?\[.*?\]\((\.\.\/assets\/.*?)\)$/;
        const filePathMatch = blockContent.match(markdownFilePattern);
        if (filePathMatch) {
            let filePath = await logseq.Assets.makeUrl(filePathMatch[1].trim());
            filePath = filePath.replace('assets://', '');
            return filePath;
        }

        return null;
    } catch (e) {
        console.log(e);
        logseq.UI.showMsg('Error while reading the file!', 'error', { timeout: 3000 });
        return undefined;
    }
}

function parseURL(blockContent) {
    // {{video https://www.youtube.com/watch?v=something}}
    const markdownVideoPattern = /^{{video\s+(https?:\/\/[^\s]+)}}$/;
    const videoMatch = blockContent.match(markdownVideoPattern);
    if (videoMatch) {
        return videoMatch[1].trim();
    }
    return null;
}

async function readFileBlob(filePath) {
    try {
        filePath = 'file://' + filePath;

        const response = await fetch(filePath);
        const blob = await response.blob();
        return blob;
    } catch (e) {
        console.log(e);
        logseq.UI.showMsg('Error while reading the file!', 'error', { timeout: 3000 });
        return undefined;
    }
}

const replacePlaceholderWithInputContent = (obj, placeholderValue) => {
    return JSON.parse(JSON.stringify(obj), (key, value) => {
        if (value === '$1') {
            return placeholderValue;
        } else if (typeof value === 'string' && value.includes('$1')) {
            return value.replace('$1', placeholderValue);
        }
        return value;
    });
};