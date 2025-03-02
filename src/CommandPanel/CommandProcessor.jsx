import apiRequest from "../api/api";
import { convertBlobToBase64 } from "../api/apiHelpers";


export async function processCommand(blockUUID, apiConfig) {
    const selectedBlock = await logseq.Editor.getBlock(blockUUID, { includeChildren: true });
    if (!selectedBlock) {
        logseq.UI.showMsg('No block selected!', "error", { timeout: 3000 });
        return
    }

    const tempStatusBlock = await logRequestStartMessages(blockUUID, apiConfig);

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
            let rawResponseContent = response.value;

            if (apiConfig.requestType === 'ollama' && rawResponseContent) {
                const ollamaResponse = JSON.parse(JSON.stringify(rawResponseContent));
                if (ollamaResponse.response) {
                    rawResponseContent = ollamaResponse.response;
                }
            } else if (apiConfig.requestType === 'openai' && rawResponseContent) {
                const openaiResponse = JSON.parse(JSON.stringify(rawResponseContent));
                if (openaiResponse.choices && openaiResponse.choices.length > 0) {
                    rawResponseContent = openaiResponse.choices[0].message.content;
                }
            }

            let processedResponseBlocks = [];
            if (apiConfig.responseFormattingMethod == "raw") {
                processedResponseBlocks = [{ content: rawResponseContent }];
            } else if (apiConfig.responseFormattingMethod == "multiline") {
                processedResponseBlocks = postprocessMarkdownToLogseqMultilineBlocks(rawResponseContent);
            } else {
                processedResponseBlocks = postprocessMarkdownToLogseqStructuredBlocks(rawResponseContent);
            }

            // wrap the response in a parent block if enabled
            if (apiConfig.responseWrapperBlockTitle) {
                processedResponseBlocks = [{ content: apiConfig.responseWrapperBlockTitle, children: processedResponseBlocks }];
            }

            if (apiConfig.responseAction == 'write_child_below') {
                logseq.Editor.insertBatchBlock(blockUUID, processedResponseBlocks, { before: false, sibling: false });
            } else if (apiConfig.responseAction == 'write_sibling_below') {
                logseq.Editor.insertBatchBlock(blockUUID, processedResponseBlocks, { before: false, sibling: true })
            } else if (apiConfig.responseAction == 'replace_content') {
                logseq.Editor.insertBatchBlock(blockUUID, processedResponseBlocks, { before: false, sibling: true });
                logseq.Editor.removeBlock(blockUUID);
            }
        }
    }).then(() => {
        logseq.UI.showMsg('Done!', "success", { timeout: 3000 });
    }).catch((e) => {
        console.log(e);
        logseq.UI.showMsg(`Request Failed! ${e}`, "error", { timeout: 3000 });
        if (tempStatusBlock) {
            logseq.Editor.insertBlock(tempStatusBlock.uuid, `🚧Error! ${e}`, { before: false, sibling: true });
        }
    }).finally(() => {
        logseq.UI.closeMsg("logseq-integrate-any-api-progress-status");
        if (tempStatusBlock) {
            logseq.Editor.removeBlock(tempStatusBlock.uuid);
        }
    })

}

async function logRequestStartMessages(blockUUID, apiConfig) {
    logseq.UI.showMsg(
        "Processing your request...",
        "warning",
        { key: "logseq-integrate-any-api-progress-status", timeout: 20000 }
    );

    // if the response will be written into logseq,
    // then insert a temporary block with "Generating output..." content.
    if (apiConfig.responseAction != 'none') {
        const insertAsSibling = apiConfig.responseAction !== 'write_child_below';
        const tempStatusBlock = await logseq.Editor.insertBlock(blockUUID, "⌛Generating output...", { before: false, sibling: insertAsSibling });
        return tempStatusBlock;
    }

    return null;
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

const postprocessMarkdownToLogseqStructuredBlocks = (markdownText) => {
    // this is an initial function to prepare data for logseq
    // TODO: improve this function
    const lines = markdownText.split('\n');
    let blocks = [];
    let currentBlock = null;
    let currentLevelIsRoot = true;

    lines.forEach(line => {
        line = line.trim();

        if (line.startsWith('#')) {
            currentBlock = { content: line, children: [] };
            currentLevelIsRoot = false;
            blocks.push(currentBlock);
        } else if (line.startsWith('- ')) {
            if (currentBlock) {
                currentBlock.children.push({ content: line });
            } else {
                blocks.push({ content: line });
            }
        } else if (line.length > 0) {
            if (currentBlock && !currentLevelIsRoot) {
                currentBlock.children.push({ content: line });
            } else {
                currentBlock = { content: line, children: [] };
                blocks.push(currentBlock);
            }
        }
    });


    return blocks;
}

const postprocessMarkdownToLogseqMultilineBlocks = (markdownText) => {
    /**
     * Splits the markdown content into blocks at each heading.
     * All content lines between headings are grouped as multiline content for the same block.
     * To improve presentation:
     * - An empty line is added after a list if followed by a heading.
     * - Two empty lines are added after a list if followed by any other content.
     */
    const lines = markdownText.split('\n');
    const blocks = [];
    let currentBlockLines = [];
    let previousBlockIsList = false;
    let emptyLinesAfterCurrentListCount = 0;

    lines.forEach(line => {
        // replace "- " with "* " to handle them both in a similar way
        line = line.trim().replace(/^- /, "* ");

        if (line.startsWith("* ")) { // list item
            currentBlockLines.push(line);
            previousBlockIsList = true;
        } else {
            if (line.startsWith('#')) { // heading
                if (currentBlockLines.length > 0) { // append the previous multiline content
                    if (previousBlockIsList && emptyLinesAfterCurrentListCount == 0) {
                        //append an empty line between the list and the heading
                        currentBlockLines.push('\n');
                    }
                    blocks.push({ content: currentBlockLines.join('\n').trim() });
                }
                currentBlockLines = [];
                previousBlockIsList = false;
                emptyLinesAfterCurrentListCount = 0;
            } else if (previousBlockIsList) { // other type of content after a list
                if (line.length === 0) { // empty line
                    // do not reset the previousBlockIsList flag in this case,
                    // as we need to count and handle empty lines immediately following a list.
                    // only reset the flag if valid content (other than empty lines) is encountered.
                    emptyLinesAfterCurrentListCount += 1;
                } else { // a non-empty line following a list
                    const newEmptyLinesToAppend = Math.max(0, 2 - emptyLinesAfterCurrentListCount);
                    currentBlockLines.push(...new Array(newEmptyLinesToAppend).fill('\n'));
                    previousBlockIsList = false;
                    emptyLinesAfterCurrentListCount = 0;
                }
            }
            currentBlockLines.push(line);
        }
    });

    if (currentBlockLines.length > 0) {
        // no need to append any empty lines in this case.
        blocks.push({ content: currentBlockLines.join('\n').trim() });
    }

    return blocks;
}