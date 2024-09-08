
export const InformationBox = (props) => (
    <div className="flex flex-col h-full justify-center items-center text-center">
        <h1 className="text-center p-2">{props.message}</h1>
        {
            props.btnLabel && (
                <button
                    onClick={() => props.handleOnClickButton()}
                    type="button"
                    className="ui__button inline-flex items-center justify-center whitespace-nowrap gap-1
                        font-medium ring-offset-background transition-colors focus-visible:outline-none
                        focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                        disabled:pointer-events-none disabled:opacity-50 select-none bg-primary/90
                        hover:bg-primary/100 active:opacity-90 text-primary-foreground hover:text-primary-foreground
                        as-classic h-7 rounded px-3 py-1 text-sm mt-4"
                >
                    {props.btnLabel}
                </button>
            )
        }
    </div>
)