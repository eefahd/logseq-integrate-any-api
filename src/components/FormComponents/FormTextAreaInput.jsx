export const FormTextAreaInput = (props) => {
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (e.key === 'Enter') {
                const { selectionStart, selectionEnd, value } = e.target;
                e.target.value = value.substring(0, selectionStart) + '\n' + value.substring(selectionEnd);
                e.target.scrollTop = e.target.scrollHeight;
                e.target.selectionStart = e.target.selectionEnd = selectionStart + 1;
            }
        }
    }

    return (
        <div className="mt-2 sm:mt-1 it sm:grid sm:grid-cols-3 sm:gap-4 sm:items-center">
            <div className="flex flex-col">
                <label className="block text-sm font-medium leading-5 opacity-70" htmlFor={props.id}>
                    {props.label}
                </label>
            </div>

            <div className="sm:col-span-2 flex items-center flex items-center">
                <div className='w-full'>
                    <textarea
                        id={props.id}
                        type="text"
                        className="form-input"
                        style={{ whiteSpace: "pre-line", overflow: "auto" }}
                        rows="4"
                        value={!!props.value ? props.value : ''}
                        placeholder={!!props.placeholder ? props.placeholder : ''}
                        onChange={(e) => props.handleOnChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>
                <div className="text-sm flex"></div>
            </div>
        </div>
    )
}
