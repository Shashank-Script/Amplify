import { createContext, useContext, useState } from "react";

interface SearchContextType {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

interface SearchProviderProps {
    children: React.ReactNode
}
export const SearchProvider: React.FC<SearchProviderProps> = ({children}) => {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
            {children}
        </SearchContext.Provider>
    );
}

export const useSearch = () => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error("useSearch must be used within a SearchProvider");
    }
    return context;
}