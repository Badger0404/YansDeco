import React, { createContext, useContext, useState, useEffect } from 'react';

type AdminRole = 'admin' | 'developer' | null;

interface AdminAuthContextType {
    role: AdminRole;
    isAuthenticated: boolean;
    login: (role: AdminRole, password: string) => Promise<boolean>;
    logout: () => void;
    hasAccess: (section: string) => boolean;
    adminSections: string[];
    updateAdminSections: (sections: string[]) => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const DEFAULT_ADMIN_SECTIONS = ['products', 'categories', 'clients'];
const DEVELOPER_SECTIONS = ['products', 'categories', 'clients', 'brands', 'translations', 'services', 'calculators', 'settings', 'content', 'warehouse', 'slogans'];

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [role, setRole] = useState<AdminRole>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [adminSections, setAdminSections] = useState(DEFAULT_ADMIN_SECTIONS);

    useEffect(() => {
        // Check if user is already authenticated
        const savedRole = sessionStorage.getItem('admin_role') as AdminRole;
        const savedAuth = sessionStorage.getItem('admin_authenticated');

        if (savedRole && savedAuth === 'true') {
            setRole(savedRole);
            setIsAuthenticated(true);
        }
        
        // Load access settings from Cloudflare
        loadAccessSettings();
    }, []);

    const loadAccessSettings = async () => {
        try {
            const response = await fetch('https://yasndeco-api.andrey-gaffer.workers.dev/api/admin/access-settings');
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.sections) {
                    setAdminSections(data.sections);
                }
            }
        } catch (error) {
            console.error('Failed to load access settings:', error);
        }
    };

    const login = async (role: AdminRole, password: string): Promise<boolean> => {
        try {
            console.log('Attempting login:', { role, passwordLength: password.length });
            
            const response = await fetch('https://yasndeco-api.andrey-gaffer.workers.dev/api/admin/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ role, password }),
            });

            const data = await response.json();
            console.log('Login response:', { status: response.status, data });

            if (data.success) {
                setRole(role);
                setIsAuthenticated(true);
                sessionStorage.setItem('admin_role', role || '');
                sessionStorage.setItem('admin_authenticated', 'true');
                return true;
            } else {
                console.error('Login failed:', data.error);
                return false;
            }
        } catch (err) {
            console.error('Login error:', err);
            return false;
        }
    };

    const logout = () => {
        setRole(null);
        setIsAuthenticated(false);
        sessionStorage.removeItem('admin_role');
        sessionStorage.removeItem('admin_authenticated');
    };

    const hasAccess = (section: string): boolean => {
        if (!isAuthenticated || !role) return false;

        if (role === 'developer') {
            return DEVELOPER_SECTIONS.includes(section);
        }

        if (role === 'admin') {
            return adminSections.includes(section);
        }

        return false;
    };

    const updateAdminSections = (sections: string[]) => {
        setAdminSections(sections);
        
        // Сразу сохраняем в Cloudflare
        fetch('https://yasndeco-api.andrey-gaffer.workers.dev/api/admin/access-settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sections }),
        }).then(response => {
            if (response.ok) {
                console.log('Access settings saved successfully');
            } else {
                console.error('Failed to save access settings');
            }
        }).catch(error => {
            console.error('Error saving access settings:', error);
        });
    };

    return (
        <AdminAuthContext.Provider value={{ role, isAuthenticated, login, logout, hasAccess, adminSections, updateAdminSections }}>
            {children}
        </AdminAuthContext.Provider>
    );
};

export const useAdminAuth = () => {
    const context = useContext(AdminAuthContext);
    if (!context) {
        throw new Error('useAdminAuth must be used within AdminAuthProvider');
    }
    return context;
};
