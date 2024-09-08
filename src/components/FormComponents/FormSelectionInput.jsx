
export const FormSelectionInput = (props) => (
    <div className="mt-2 sm:mt-1 it sm:grid sm:grid-cols-3 sm:gap-4 sm:items-center">
        <div className="flex flex-col">
            <label className="block text-sm font-medium leading-5 opacity-70" htmlFor={props.id}>
                {props.label}
            </label>
        </div>

        <div className="sm:col-span-2 flex items-center flex items-center">
            <div className='w-full'>
                <select
                    id={props.id}
                    className="form-select"
                    value={!!props.value ? props.value : ''}
                    onChange={(e) => props.handleOnChange(e.target.value)}
                >
                    <option value="" disabled>Select an option</option>
                    {
                        props.selectionOptions.map((item) => (
                            <option value={item.id}>{item.label}</option>
                        ))
                    }
                </select>
            </div>
            <div className="text-sm flex"></div>
        </div>
    </div>
)