import React, { createContext, useState, useContext } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [sharedData, setSharedData] = useState(null);

    return (
        <DataContext.Provider value={{ sharedData, setSharedData }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);

export default DataProvider;
