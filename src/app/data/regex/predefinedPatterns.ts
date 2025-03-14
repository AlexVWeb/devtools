export interface RegExPattern {
    id: string;
    name: string;
    description: string;
    pattern: string;
    flags?: string;
    example?: string;
    params?: {
        name: string;
        label: string;
        type: "text" | "select" | "checkbox";
        options?: { value: string; label: string }[];
        defaultValue: string | boolean;
    }[];
}

const predefinedPatterns: RegExPattern[] = [
    {
        id: "email",
        name: "Email",
        description: "Valide une adresse email",
        pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
        flags: "g",
        example: "contact@exemple.fr, support@domain.com"
    },
    {
        id: "phone",
        name: "Numéro de téléphone",
        description: "Valide un numéro de téléphone français",
        pattern: "^(?:(?:\\+|00)33|0)\\s*[1-9](?:[\\s.-]*\\d{2}){4}$",
        flags: "g",
        example: "06 12 34 56 78, +33 6 12 34 56 78, 01.23.45.67.89"
    },
    {
        id: "url",
        name: "URL",
        description: "Valide une URL",
        pattern: "^(https?:\\/\\/)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w .-]*)*\\/?$",
        flags: "g",
        example: "https://www.exemple.fr, exemple.com/page, www.site.org/chemin/page.html"
    },
    {
        id: "date",
        name: "Date",
        description: "Valide une date au format JJ/MM/AAAA",
        pattern: "^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/(19|20)\\d\\d$",
        flags: "g",
        example: "01/01/2023, 31/12/2022, 15/06/2024"
    },
    {
        id: "password",
        name: "Mot de passe",
        description: "Valide un mot de passe fort",
        pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
        flags: "g",
        example: "Passw0rd!, Secur1té@, Mot2P@sse"
    },
    {
        id: "ipv4",
        name: "IPv4",
        description: "Valide une adresse IPv4",
        pattern: "^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$",
        flags: "g",
        example: "192.168.1.1, 10.0.0.1, 172.16.254.1"
    },
    {
        id: "custom_word",
        name: "Recherche de mot",
        description: "Recherche un mot spécifique",
        pattern: "\\b{word}\\b",
        flags: "gi",
        example: "Le mot exemple apparaît dans cette phrase comme exemple de recherche.",
        params: [
            {
                name: "word",
                label: "Mot à rechercher",
                type: "text",
                defaultValue: "exemple"
            }
        ]
    },
    {
        id: "number_range",
        name: "Plage de nombres",
        description: "Recherche des nombres dans une plage spécifique",
        pattern: "\\b([{min}-{max}])\\b",
        flags: "g",
        example: "Les nombres 5, 10, 42, 100, 200 sont présents dans ce texte.",
        params: [
            {
                name: "min",
                label: "Valeur minimale",
                type: "text",
                defaultValue: "1"
            },
            {
                name: "max",
                label: "Valeur maximale",
                type: "text",
                defaultValue: "100"
            }
        ]
    },
    {
        id: "file_extension",
        name: "Extension de fichier",
        description: "Recherche des fichiers avec une extension spécifique",
        pattern: "\\w+\\.{extension}\\b",
        flags: "g",
        example: "document.pdf, image.jpg, script.js, page.html, styles.css",
        params: [
            {
                name: "extension",
                label: "Extension",
                type: "select",
                options: [
                    { value: "pdf", label: "PDF (.pdf)" },
                    { value: "docx?", label: "Word (.doc/.docx)" },
                    { value: "xlsx?", label: "Excel (.xls/.xlsx)" },
                    { value: "jpe?g", label: "JPEG (.jpg/.jpeg)" },
                    { value: "png", label: "PNG (.png)" },
                    { value: "gif", label: "GIF (.gif)" },
                    { value: "txt", label: "Texte (.txt)" },
                    { value: "html?", label: "HTML (.htm/.html)" },
                    { value: "css", label: "CSS (.css)" },
                    { value: "jsx?", label: "JavaScript (.js/.jsx)" },
                    { value: "tsx?", label: "TypeScript (.ts/.tsx)" }
                ],
                defaultValue: "pdf"
            }
        ]
    },
    // Ajout de quelques modèles supplémentaires
    {
        id: "postal_code_fr",
        name: "Code postal français",
        description: "Valide un code postal français",
        pattern: "^(?:0[1-9]|[1-8]\\d|9[0-8])\\d{3}$",
        flags: "g",
        example: "75001, 13200, 33000, 59000, 06000"
    },
    {
        id: "credit_card",
        name: "Carte de crédit",
        description: "Valide un numéro de carte de crédit (formats principaux)",
        pattern: "^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\\d{3})\\d{11})$",
        flags: "g",
        example: "4111111111111111, 5500000000000004, 340000000000009"
    },
    {
        id: "hex_color",
        name: "Couleur hexadécimale",
        description: "Valide une couleur au format hexadécimal",
        pattern: "^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$",
        flags: "g",
        example: "#FFF, #000000, #FF5733, #3498DB"
    }
];

export default predefinedPatterns; 