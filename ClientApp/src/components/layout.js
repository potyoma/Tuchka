import React from 'react';
import Navigation from './navigation';

const Layout = ({ children }) => {
    return (
        <>
            <div className="navigationWrapper">
                <Navigation />
                <main className='mt-5 pt-4'>{children}</main>
            </div>
        </>
    );
};

export default Layout;