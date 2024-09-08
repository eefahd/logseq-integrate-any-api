import '@logseq/libs'

import ReactDOM from "react-dom/client";
import { addSettingsToLogseq } from "./settings";
import { ApiConfigModal } from './ApiConfigPanel/ApiConfigModal';
import { CommandsModal } from './CommandPanel/CommandsModal';
import { API_CONFIG_COMMAND_LABEL, CONTEXT_MENU_ITEM_LABEL } from './constants';

const main = () => {
    addSettingsToLogseq();

    logseq.Editor.registerBlockContextMenuItem(CONTEXT_MENU_ITEM_LABEL,
        ({ uuid }) => {
            try {
                const detachedContainer = window.parent.document.createElement('div');
                const root = ReactDOM.createRoot(detachedContainer);
                root.render(
                    <CommandsModal blockUUID={uuid} onCloseModal={() => {
                        window.parent.document.body.removeChild(detachedContainer);
                    }} />
                );
                window.parent.document.body.appendChild(detachedContainer);
            } catch (err) {
                logseq.UI.showMsg(`Failed to show commands list. ${err}`, 'error');
                console.log(err);
            }
        }
    );

    logseq.App.registerCommand(`logseq-integrate-any-api-config`, {
        key: `logseq-integrate-any-api-config-panel`,
        label: API_CONFIG_COMMAND_LABEL,
        palette: true
    }, async () => {
        try {
            const detachedContainer = window.parent.document.createElement('div');
            const root = ReactDOM.createRoot(detachedContainer);
            root.render(
                <ApiConfigModal onCloseModal={() => {
                    window.parent.document.body.removeChild(detachedContainer);
                }} />
            );
            window.parent.document.body.appendChild(detachedContainer);
        } catch (err) {
            logseq.UI.showMsg(`Failed to show API config panel. ${err}`, 'error');
            console.log(err);
        }
    });
}

logseq.ready(main).catch(console.error)