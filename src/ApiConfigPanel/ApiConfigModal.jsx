import { useState, useEffect, useCallback } from "react";
import _ from 'lodash';
import { ApiConfigDataForm } from "./ApiConfigDataForm"
import { ModalLayout } from "../components/ModalTemplateComponents/ModalLayout"
import { InformationBox } from "../components/ModalTemplateComponents/InformationBox";

export const ApiConfigModal = (props) => {
    const [apiConfigList, setApiConfigList] = useState([]);
    const [selectedApiConfigItem, setSelectedApiConfigItem] = useState({});
    const [apiConfigChanged, setApiConfigChanged] = useState(false);

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

    useEffect(() => {
        handleOnSettingsChanged();
    }, [selectedApiConfigItem]);

    logseq.onSettingsChanged(() => {
        handleOnSettingsChanged();
    });

    const handleOnSettingsChanged = () => {
        if (selectedApiConfigItem.id) {
            const logseqConfig = logseq.settings.apiConfigList || [];
            const savedApiConfigItem = logseqConfig.find(item => item.id === selectedApiConfigItem.id);
            setApiConfigChanged(!_.isEqual(selectedApiConfigItem, savedApiConfigItem));
        }
    }

    const handleAddApiConfig = () => {
        const newApiConfig = {
            "id": Date.now().toString(),
            "name": "Untitled",
        }
        setApiConfigList([...apiConfigList, newApiConfig]);
        setSelectedApiConfigItem(newApiConfig);
    }

    const handleDeleteApiConfig = (removedConfigId) => {
        // TODO: create a modal for confirmation
        const confirmed = window.confirm('Are you sure you want to delete this item?');
        if (confirmed) {
            setApiConfigList(apiConfigList.filter(item => item.id !== removedConfigId));
            const logseqApiConfigList = logseq.settings.apiConfigList || [];
            logseq.updateSettings({ apiConfigList: logseqApiConfigList.filter(item => item.id !== removedConfigId) });
            if (removedConfigId == selectedApiConfigItem.id) {
                setSelectedApiConfigItem({});
            }
        }
    }

    const handleReorderItem = (initIndex, newIndex) => {
        if (initIndex == newIndex) {
            return;
        }
        const reorderedItem = apiConfigList[initIndex];
        const filteredItems = apiConfigList.filter((_, idx) => idx !== initIndex);
        const adjustedNewIndex = newIndex > initIndex ? newIndex - 1 : newIndex;
        filteredItems.splice(adjustedNewIndex, 0, reorderedItem);

        setApiConfigList(filteredItems);
        logseq.updateSettings({ apiConfigList: filteredItems || [] });
    }

    const handleSelectApiConfig = (selectedId) => {
        const selectedConfig = apiConfigList.find(item => item.id === selectedId);
        setSelectedApiConfigItem(selectedConfig);
    }

    const handleOnChangeApiConfig = (apiConfigId, data) => {
        const newConfigList = apiConfigList.map(item =>
            item.id === apiConfigId ? data : item
        );
        setApiConfigList(newConfigList);
        setSelectedApiConfigItem(data);
    }

    const handleDuplicateApiConfig = (apiConfig) => {
        const clonedApiConfig = { ...apiConfig, 'id': Date.now().toString(), 'name': apiConfig.name + " Copy" }
        const newConfigList = [...apiConfigList, clonedApiConfig]
        setApiConfigList(newConfigList);
        setSelectedApiConfigItem(clonedApiConfig);
    }

    const handleSaveApiConfig = (apiConfigId) => {
        const updatedApiConfigItem = apiConfigList.find(item => item.id === apiConfigId);

        const logseqConfigList = logseq.settings.apiConfigList || [];
        const logseqItemIndex = logseqConfigList.findIndex(item => item.id === apiConfigId);

        const newConfigList = (logseqItemIndex >= 0) ? (
            logseqConfigList.map(item =>
                item.id === apiConfigId ? updatedApiConfigItem : item
            )
        ) : (
            [...logseqConfigList, updatedApiConfigItem]
        );

        logseq.updateSettings({ apiConfigList: newConfigList || [] });
    }

    return (
        <ModalLayout
            onCloseModal={closeAndClearModal}
            listItems={apiConfigList}
            selectedItem={selectedApiConfigItem}
            handleSelectItem={handleSelectApiConfig}
            handleAddItem={handleAddApiConfig}
            handleDeleteItem={handleDeleteApiConfig}
            handleReorderItem={handleReorderItem}
            displaySideBar={true}
        >
            {
                selectedApiConfigItem.id ? (
                    <ApiConfigDataForm
                        apiConfig={selectedApiConfigItem}
                        handleOnChangeApiConfig={handleOnChangeApiConfig}
                        handleDuplicateApiConfig={handleDuplicateApiConfig}
                        handleSaveApiConfig={handleSaveApiConfig}
                        apiConfigChanged={apiConfigChanged}
                    />
                ) : (
                    <InformationBox message="Select an item to edit, or add a new one!" />
                )
            }
        </ModalLayout>
    )
}