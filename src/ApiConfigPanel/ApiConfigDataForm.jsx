import { useEffect, useRef } from 'react';
import { FormTextInput } from '../components/FormComponents/FormTextInput';
import { FormSelectionInput } from '../components/FormComponents/FormSelectionInput';
import { FormTextAreaInput } from '../components/FormComponents/FormTextAreaInput';

export const ApiConfigDataForm = ({
    apiConfig,
    handleOnChangeApiConfig,
    handleDuplicateApiConfig,
    handleSaveApiConfig,
    apiConfigChanged
}) => {
    const inputRef = useRef(null);

    const handleOnChangeConfigName = (value) => {
        handleOnChangeApiConfig(apiConfig.id, { ...apiConfig, 'name': value });
    }

    const handleOnChangeEndpoint = (value) => {
        handleOnChangeApiConfig(apiConfig.id, { ...apiConfig, 'endpoint': value });
    }

    const handleOnChangeMethod = (value) => {
        handleOnChangeApiConfig(
            apiConfig.id,
            { ...apiConfig, 'method': value, 'body': value === 'GET' ? '' : apiConfig.body }
        );
    }

    const handleOnChangeHeaders = (value) => {
        handleOnChangeApiConfig(apiConfig.id, { ...apiConfig, 'headers': value });
    }

    const handleOnChangeContentType = (value) => {
        handleOnChangeApiConfig(apiConfig.id, { ...apiConfig, 'contentType': value });
    }

    const handleOnChangeBody = (value) => {
        handleOnChangeApiConfig(apiConfig.id, { ...apiConfig, 'body': value });
    }

    const handleOnChangeInputFileMethod = (value) => {
        handleOnChangeApiConfig(apiConfig.id, { ...apiConfig, 'inputFileMethod': value });
    }

    const handleOnChangeResponseAction = (value) => {
        handleOnChangeApiConfig(apiConfig.id, { ...apiConfig, 'responseAction': value });
    }

    const handleOnClickDuplicateConfig = () => {
        handleDuplicateApiConfig(apiConfig);
    }

    const handleOnClickSaveConfig = () => {
        try {
            JSON.parse(apiConfig.headers);
        } catch {
            logseq.UI.showMsg("Invalid Headers!", "error", { timeout: 3000 });
            return;
        }
        try {
            if (apiConfig.method !== 'GET' || apiConfig.body) {
                JSON.parse(apiConfig.body);
            }
        } catch {
            logseq.UI.showMsg("Invalid Body!", "error", { timeout: 3000 });
            return;
        }

        handleSaveApiConfig(apiConfig.id)
    }


    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [apiConfig.id]);

    return (
        <div>
            <h2>API Config</h2>
            <div className="w-full flex items-end flex-row items-end justify-end mt-3">
                <button
                    className="
                        ui__button inline-flex items-center justify-center whitespace-nowrap gap-1
                        font-medium ring-offset-background transition-colors focus-visible:outline-none
                        focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                        disabled:pointer-events-none disabled:opacity-50 select-none bg-secondary/90
                        hover:bg-secondary/100 active:opacity-90 text-secondary-foreground hover:text-secondary-foreground
                        as-classic h-7 rounded px-3 py-1 text-sm mr-1
                    "
                    onClick={() => handleOnClickDuplicateConfig()}
                >
                    Duplicate
                </button>
                <button
                    className="
                        ui__button inline-flex items-center justify-center whitespace-nowrap gap-1
                        font-medium ring-offset-background transition-colors focus-visible:outline-none
                        focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                        disabled:pointer-events-none disabled:opacity-50 select-none bg-primary/90
                        hover:bg-primary/100 active:opacity-90 text-primary-foreground hover:text-primary-foreground
                        as-classic h-7 rounded px-3 py-1 text-sm mr-1
                    "
                    disabled={!apiConfigChanged}
                    onClick={() => handleOnClickSaveConfig()}
                >
                    Save
                </button>
            </div>

            <FormTextInput id="config_name" label="Name" ref={inputRef} value={apiConfig.name} handleOnChange={handleOnChangeConfigName} />
            <FormTextInput id="api_endpoint" label="Endpoint" value={apiConfig.endpoint} handleOnChange={handleOnChangeEndpoint} />
            <FormSelectionInput
                id="request_method"
                label="Method"
                selectionOptions={[{ "id": "GET", "label": "GET" }, { "id": "POST", "label": "POST" }]}
                value={apiConfig.method}
                handleOnChange={handleOnChangeMethod} />
            <FormSelectionInput
                id="content_type"
                label="Content Type"
                selectionOptions={[{ "id": "json", "label": "JSON" }, { "id": "form", "label": "FormData" }]}
                value={apiConfig.contentType}
                handleOnChange={handleOnChangeContentType}
            />

            {
                apiConfig.method === 'POST' && (
                    <FormTextAreaInput
                        id="body"
                        label="Body (Use $1 as a placeholder for the block content)"
                        placeholder='{"prompt": "do something $1...etc"}'
                        value={apiConfig.body} handleOnChange={handleOnChangeBody}
                    />
                )
            }
            <FormTextAreaInput
                id="headers"
                label="Headers"
                placeholder='{"Authorization": "Bearer 123"}'
                value={apiConfig.headers}
                handleOnChange={handleOnChangeHeaders}
            />

            <FormSelectionInput
                id="input_file_method"
                label="How to Handle Attached Files (if attached to block)"
                selectionOptions={[{ "id": "path", "label": "Use File Path" }, { "id": "content", "label": "Use File Content" }]}
                value={apiConfig.inputFileMethod}
                handleOnChange={handleOnChangeInputFileMethod}
            />

            <FormSelectionInput
                id="response_action"
                label="Response Action"
                selectionOptions={[
                    { "id": "none", "label": "Do Nothing" },
                    { "id": "write_child_below", "label": "Write Below the Block (Child)" },
                    { "id": "write_sibling_below", "label": "Write After the Block (Sibling)" },
                    { "id": "replace_content", "label": "Replace Content" }
                ]}
                value={apiConfig.responseAction}
                handleOnChange={handleOnChangeResponseAction}
            />

        </div>
    )
}