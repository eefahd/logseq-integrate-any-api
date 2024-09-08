import { React, useState } from 'react';

export const ModalLayout = ({
    onCloseModal,
    listItems,
    selectedItem,
    handleSelectItem,
    handleAddItem,
    handleDeleteItem,
    handleReorderItem,
    displaySideBar,
    children
}) => {
    const [hoverIndex, setHoverIndex] = useState(null);

    const handleOnDragOver = (e, itemIndex) => {
        e.preventDefault();
        setHoverIndex(itemIndex);
    }

    const handleOnDragLeave = (e) => {
        e.preventDefault();
        setHoverIndex(null);
    };

    const handleOnDrop = (e, dropIndex) => {
        e.preventDefault();
        const dragIndex = parseInt(e.dataTransfer.getData('index'));
        handleReorderItem(dragIndex, dropIndex + 1);
        setHoverIndex(null);
    }

    return (
        <div className="ui__modal" style={{ zIndex: 999 }}>
            <div className="ui__modal-overlay ease-out duration-300 opacity-100 enter-done">
                <div className="absolute inset-0 opacity-75"></div>
            </div>
            <div className="ui__modal-panel transform transition-all sm:min-w-lg sm ease-out duration-300 opacity-100 translate-y-0 sm:scale-100 enter-done">
                <div className="ui__modal-close-wrap">
                    <button
                        aria-label="Close"
                        type="button"
                        className="ui__modal-close"
                        onClick={() => onCloseModal()}
                    >
                        <svg stroke="currentColor" viewBox="0 0 24 24" fill="none" className="h-6 w-6">
                            <path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"></path>
                        </svg>
                    </button>
                </div>
                <div className="panel-content">
                    <div className="settings-modal">
                        <div id="settings" className="cp__settings-main">
                            <div className="cp__settings-inner min-h-[70dvh] max-h-[70dvh] flex flex-col">
                                {
                                    displaySideBar && (
                                        <aside className="md:w-64 flex flex-col m-h-full overflow-y-auto" style={{ minWidth: '10rem' }}>
                                            <header className="cp__settings-header mb-5">
                                                <h1 className="cp__settings-modal-title">APIs List</h1>
                                            </header>

                                            {
                                                listItems.map((item, index) => (
                                                    <ul className="mt-0 ml-0 cursor-pointer" key={item.id}>
                                                        <li
                                                            className={`settings-menu-item cursor-grab ${selectedItem.id == item.id && 'active'} ${hoverIndex === index ? 'border-b border-blue-500' : ''
                                                                }`}
                                                            onClick={() => handleSelectItem(item.id)}
                                                            draggable
                                                            onDragStart={(e) => e.dataTransfer.setData('index', index)}
                                                            onDragOver={(e) => handleOnDragOver(e, index)}
                                                            onDragLeave={(e) => handleOnDragLeave(e)}
                                                            onDrop={(e) => handleOnDrop(e, index)}
                                                        >
                                                            <span>{item.name}</span>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleDeleteItem(item.id) }}
                                                                className="float-right"
                                                            >
                                                                <span>✖</span>
                                                            </button>
                                                        </li>
                                                    </ul>
                                                ))
                                            }

                                            <div className="flex flex-col justify-end h-full gap-2">
                                                <div className="flex-grow"></div>
                                                <div className="w-full flex items-end">
                                                    <button
                                                        className="
                                                        ui__link ui__button w-full inline-flex items-center justify-center
                                                        whitespace-nowrap text-sm gap-1 font-medium ring-offset-background transition-colors
                                                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                                                        disabled:pointer-events-none disabled:opacity-50 select-none bg-blue-600 hover:bg-blue-700
                                                        active:opacity-90 text-white h-10 rounded px-3 py-1 text-center no-underline
                                                    "
                                                        onClick={() => handleAddItem()}
                                                    >
                                                        <svg stroke="currentColor" viewBox="0 0 24 24" fill="none" class="h-6 w-6">
                                                            <path d="M12 5v14M5 12h14" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"></path>
                                                        </svg>
                                                    </button>
                                                </div>
                                                <div className="text-sm flex"></div>
                                            </div>
                                        </aside>
                                    )
                                }

                                <article>
                                    <div className="panel-wrap is-general h-full">
                                        {children}
                                    </div>
                                </article>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}