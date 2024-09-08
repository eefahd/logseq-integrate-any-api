import { forwardRef } from 'react';

export const FormTextInput = forwardRef((props, ref) => (
    <div className="mt-2 sm:mt-1 it sm:grid sm:grid-cols-3 sm:gap-4 sm:items-center">
        <div className="flex flex-col">
            <label className="block text-sm font-medium leading-5 opacity-70" htmlFor={props.id}>
                {props.label}
            </label>
        </div>

        <div className="sm:col-span-2 flex items-center flex items-center">
            <div className='w-full'>
                <input
                    id={props.id}
                    type="text"
                    className="form-input"
                    ref={ref}
                    value={!!props.value ? props.value : ''}
                    onChange={(e) => props.handleOnChange(e.target.value)}
                />
            </div>
            <div className="text-sm flex"></div>
        </div>
    </div>
))