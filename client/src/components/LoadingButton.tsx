import React, { FormEvent, useState } from 'react'
import { useAuth } from '../contexts/UserAuth';




type Props = {

    className?: string;
    onClick?: () => void | Promise<void> | undefined;
    isLoading: boolean;
    buttonText: string;
    isEnabled?: boolean;
}


const LoadingButton: React.FC<Props> = ({ className, onClick, isLoading, buttonText, isEnabled }) => {

    const isAuthenticated = useAuth().isAuthenticated;


    const handleClick = () => {
        if (!isAuthenticated)
            throw new Error("Only registered users are allowed to post")
        else if (onClick)
            onClick();
    };

    return (
        <div id='loading-btn' className=''>
            <button
                type="submit"
                className={`relative inline-flex gap-4 items-center justify-center px-4 py-2 border
                 border-transparent text-base font-medium shadow rounded-md transition delay-100 bg-purple-600 
                   ${className} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} ${!isEnabled ? 'opacity-30 no-hover' : 'hover:bg-purple-500'}`}
                onClick={handleClick}
                disabled={isLoading || !isEnabled}>

                {

                    isLoading && <div

                        className="inline-block h-2 w-2 md:h-5 md:w-5 animate-spin rounded-full border-2 border-solid
                         border-current border-r-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]"
                        role="status">

                    </div>
                }

                {isLoading ? '' : buttonText}
            </button>
        </div>
    )
}

export default LoadingButton
