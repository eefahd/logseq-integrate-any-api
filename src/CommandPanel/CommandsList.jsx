
export const CommandsList = ({ apiConfigList, handleOnClickCommand }) => {
    return (
        <div className="search-results">
            {
                apiConfigList.map((item) => (
                    <div
                        key={item.id}
                        className="flex flex-col transition-opacity !opacity-100 bg-gray-03-alpha dark:bg-gray-04-alpha
                            transition-all duration-50 ease-in !opacity-75 hover:!opacity-100 hover:cursor-pointer
                            hover:bg-gradient-to-r hover:from-gray-03-alpha hover:to-gray-01-alpha
                            from-0% to-100% py-1.5 px-3 gap-0.5"
                        onClick={() => handleOnClickCommand(item)}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded flex items-center justify-center w-5 h-5 rounded flex items-center justify-center bg-gray-05 dark:text-white">
                                <span className="ui__icon ti ls-icon-command ">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-command" width="14" height="14" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                        <path d="M7 9a2 2 0 1 1 2 -2v10a2 2 0 1 1 -2 -2h10a2 2 0 1 1 -2 2v-10a2 2 0 1 1 2 2h-10"></path>
                                    </svg>
                                </span>
                            </div>
                            <div className="flex flex-1 flex-col">
                                <div className="text-sm font-medium text-gray-12">
                                    <span>{item.name}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}