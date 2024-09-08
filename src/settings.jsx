import { API_CONFIG_COMMAND_LABEL } from "./constants";

export const addSettingsToLogseq = () => {
    const settingsTemplate = [
        {
            key: "heading",
            title: "Integrate Any API Settings",
            description: "",
            type: "heading",
            default: null,
        },
        {
            key: "maxResponseSizeLimit",
            title: "Maximum Allowed Response Size (KB)",
            description: "Defines the maximum size of a response in kilobytes (KB). Responses exceeding this limit will be rejected. **Do not set this value too high becasue that may cause Logseq to become unresponsive when processing large responses.**",
            type: "number",
            default: 100,
        },
        {
            key: "apiConfigList",
            title: "APIs Configuration",
            description: `To configure your API list, execute the \"${API_CONFIG_COMMAND_LABEL}\" command from your commands list (default shortcut: \`Meta+Shift+P\`).`,
            type: "object",
            default: [],
        },
    ];
    logseq.useSettingsSchema(settingsTemplate);
};
