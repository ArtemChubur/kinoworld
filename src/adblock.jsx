import React from 'react';
import { Helmet } from 'react-helmet';

const AdBlocker = () => {
    return (
        <Helmet>
            <style>
                {`
                    .ad-container {
                        display: none !important;
                    }
                 `}
            </style>
        </Helmet>
    );
};

export default AdBlocker;
