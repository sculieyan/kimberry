import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

const Loader = () => {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <ClipLoader 
                color="#4fa94d" 
                loading={true} 
                size={50} 
                aria-label="Loading Spinner"
            />
        </div>
    );
};

export default Loader;
