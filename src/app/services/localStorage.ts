export interface LocalStorageData {
    base64?: {
        input: string;
        output: string;
    };
    jwt?: {
        input: string;
        decodedJWT: {
            header: any;
            payload: any;
            signature: string;
        } | null;
    };
    urssaf?: {
        history: Array<{
            id: number;
            date: string;
            quarter: number;
            revenue: number;
            urssafAmount: number;
            impotAmount: number;
            formationAmount: number;
            totalAmount: number;
        }>;
        includeImpot: boolean;
    };
    jiraToGit?: {
        prefix: string;
        numberTicket: string;
        title: string;
        type: string;
        language: 'fr' | 'en';
        lastUpdated?: string;
    };
    selectedTool?: string;
    theme?: string;
    colorConverter?: {
        inputColor: string;
        inputFormat: 'hex' | 'rgb' | 'hsl' | 'cmyk' | 'hsv';
        colorValues: {
            hex: string;
            rgb: { r: number; g: number; b: number };
            hsl: { h: number; s: number; l: number };
            cmyk: { c: number; m: number; y: number; k: number };
            hsv: { h: number; s: number; v: number };
        } | null;
    };
}

const STORAGE_KEY = 'devtools_data';

export const LocalStorageService = {
    // Récupérer toutes les données
    getAllData: (): LocalStorageData => {
        if (typeof window === 'undefined') return {};
        
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : {};
    },

    // Sauvegarder toutes les données
    saveAllData: (data: LocalStorageData): void => {
        if (typeof window === 'undefined') return;
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    },

    // Mettre à jour une partie spécifique des données
    updateData: (key: keyof LocalStorageData, value: any): void => {
        if (typeof window === 'undefined') return;
        
        const currentData = LocalStorageService.getAllData();
        currentData[key] = value;
        LocalStorageService.saveAllData(currentData);
    },

    // Récupérer une partie spécifique des données
    getData: (key: keyof LocalStorageData): any => {
        if (typeof window === 'undefined') return null;
        
        const data = LocalStorageService.getAllData();
        return data[key];
    },

    // Supprimer une partie spécifique des données
    removeData: (key: keyof LocalStorageData): void => {
        if (typeof window === 'undefined') return;
        
        const currentData = LocalStorageService.getAllData();
        delete currentData[key];
        LocalStorageService.saveAllData(currentData);
    },

    // Effacer toutes les données
    clearAllData: (): void => {
        if (typeof window === 'undefined') return;
        
        localStorage.removeItem(STORAGE_KEY);
    }
}; 