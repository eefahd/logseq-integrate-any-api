import { useState, useEffect, useCallback } from "react";
import _ from 'lodash';
import { ModalLayout } from "../components/ModalTemplateComponents/ModalLayout"
import { InformationBox } from "../components/ModalTemplateComponents/InformationBox";
import { CommandsList } from "./CommandsList";
import { processCommand } from "./CommandProcessor";
import { API_CONFIG_COMMAND_LABEL } from "../constants";

export const CommandsModal = (props) => {
    const [apiConfigList, setApiConfigList] = useState([]);

    const handleKeyDown = useCallback((event) => {
        if (event.key === 'Escape') {
            closeAndClearModal();
        }
    }, []);

    const closeAndClearModal = useCallback(() => {
        window.parent.document.removeEventListener('keydown', handleKeyDown);
        props.onCloseModal();
    }, [handleKeyDown, props]);


    useEffect(() => {
        setApiConfigList(logseq.settings.apiConfigList || []);

        window.parent.document.addEventListener('keydown', handleKeyDown);

        return () => {
            window.parent.document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const handleOnClickConfigureCommands = () => {
        closeAndClearModal();
        logseq.App.invokeExternalCommand("logseq.command-palette/toggle");
    }

    const handleOnClickCommand = (apiConfig) => {
        closeAndClearModal();
        processCommand(props.blockUUID, apiConfig);
    }

    return (
        <ModalLayout
            onCloseModal={closeAndClearModal}
            displaySideBar={false}
        >
            {
                apiConfigList.length ? (
                    <CommandsList apiConfigList={apiConfigList} handleOnClickCommand={handleOnClickCommand} />
                ) : (
                    <InformationBox
                        message={`No Configured Commands! Add one by invoking the command "${API_CONFIG_COMMAND_LABEL}".`}
                        btnLabel="Open Commands Palette"
                        handleOnClickButton={handleOnClickConfigureCommands}
                    />
                )
            }
        </ModalLayout>
    )
}