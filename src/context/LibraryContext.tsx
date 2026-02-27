"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface LibraryContextType {
    library: { id: string; name: string } | null;
    user: any | null;
    isLoading: boolean;
    refreshLibrary: () => Promise<void>;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export function LibraryProvider({ children }: { children: React.ReactNode }) {
    const [library, setLibrary] = useState<{ id: string; name: string } | null>(null);
    const [user, setUser] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchLibraryData = async () => {
        try {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (!authUser) {
                setUser(null);
                setLibrary(null);
                setIsLoading(false);
                return;
            }

            setUser(authUser);

            const { data: libData, error } = await supabase
                .from("libraries")
                .select("id, name")
                .eq("owner_id", authUser.id)
                .maybeSingle();

            if (error) console.error("LibraryContext error:", error);
            setLibrary(libData || null);
        } catch (err) {
            console.error("LibraryContext unexpected error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLibraryData();
    }, []);

    return (
        <LibraryContext.Provider value={{ library, user, isLoading, refreshLibrary: fetchLibraryData }}>
            {children}
        </LibraryContext.Provider>
    );
}

export function useLibrary() {
    const context = useContext(LibraryContext);
    if (context === undefined) {
        throw new Error("useLibrary must be used within a LibraryProvider");
    }
    return context;
}
