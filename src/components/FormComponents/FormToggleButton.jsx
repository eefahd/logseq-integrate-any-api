import { forwardRef } from 'react';

export const FormToggleButton = forwardRef((props, ref) => (
    <div className="it sm:grid sm:grid-cols-3 sm:gap-4 sm:items-center">
        <label className="block text-sm font-medium leading-5 opacity-70" htmlFor={props.id}>{props.label}</label>
        <div>
            <div className="rounded-md sm:max-w-xs">
                <a className="ui__toggle is-small" role="checkbox" onClick={(e) => props.handleOnChange(!props.value)}>
                    <span aria-checked={!!props.value} tabindex="0" role="checkbox" className="wrapper transition-colors ease-in-out duration-200 ui__toggle-background-off">
                        <span aria-hidden="true" className="switcher transform transition ease-in-out duration-200 translate-x-0"></span>
                    </span>
                </a>
            </div>
        </div>
    </div>
))