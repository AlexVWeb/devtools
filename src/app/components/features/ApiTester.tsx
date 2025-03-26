'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Send, Copy, RefreshCw, Code, History } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Header {
    key: string;
    value: string;
}

interface RequestHistory {
    id: number;
    method: string;
    url: string;
    timestamp: Date;
}

type AuthType = 'none' | 'bearer' | 'basic' | 'apiKey';

interface AuthOption {
    value: AuthType;
    label: string;
    description: string;
}

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];

const AUTH_OPTIONS: AuthOption[] = [
    { value: 'none', label: 'Aucune', description: 'Pas d\'authentification' },
    { value: 'bearer', label: 'Bearer Token', description: 'JWT ou token d\'accès' },
    { value: 'basic', label: 'Basic Auth', description: 'username:password en Base64' },
    { value: 'apiKey', label: 'API Key', description: 'Clé d\'API' },
];

const RequestUrlInput = ({ url, onChange }: { url: string; onChange: (value: string) => void }) => (
    <div>
        <Label htmlFor="url" className="text-sm font-medium dark:text-gray-200">URL</Label>
        <Input
            id="url"
            type="text"
            value={url}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://api.example.com/endpoint"
            className="dark:bg-gray-700 dark:border-gray-600"
        />
    </div>
);

const MethodSelector = ({ method, onChange }: { method: string; onChange: (value: string) => void }) => (
    <div className="flex-1">
        <Label className="text-sm font-medium dark:text-gray-200">Méthode</Label>
        <Select value={method} onValueChange={onChange}>
            <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {HTTP_METHODS.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    </div>
);

const CurlInput = ({ value, onChange, onParse }: { 
    value: string; 
    onChange: (value: string) => void;
    onParse: () => void;
}) => (
    <div className="flex-1">
        <Label className="text-sm font-medium dark:text-gray-200">CURL</Label>
        <Input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Collez votre commande CURL ici..."
            className="dark:bg-gray-700 dark:border-gray-600"
        />
    </div>
);

const HeadersSection = ({ 
    showHeaders, 
    onToggle, 
    headers, 
    onAdd, 
    onRemove, 
    onChange 
}: {
    showHeaders: boolean;
    onToggle: (value: boolean) => void;
    headers: Header[];
    onAdd: () => void;
    onRemove: (index: number) => void;
    onChange: (index: number, field: 'key' | 'value', value: string) => void;
}) => (
    <div className="space-y-2">
        <div className="flex items-center justify-between">
            <Label className="text-sm font-medium dark:text-gray-200">Headers</Label>
            <Switch
                checked={showHeaders}
                onCheckedChange={onToggle}
                className="data-[state=checked]:bg-blue-600"
            />
        </div>
        {showHeaders && (
            <div className="space-y-2">
                {headers.map((header, index) => (
                    <div key={index} className="flex gap-2">
                        <Input
                            placeholder="Key"
                            value={header.key}
                            onChange={(e) => onChange(index, 'key', e.target.value)}
                            className="flex-1 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <Input
                            placeholder="Value"
                            value={header.value}
                            onChange={(e) => onChange(index, 'value', e.target.value)}
                            className="flex-1 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onRemove(index)}
                            className="text-red-500 hover:text-red-600"
                        >×</Button>
                    </div>
                ))}
                <Button variant="outline" onClick={onAdd} className="w-full">
                    Ajouter un header
                </Button>
            </div>
        )}
    </div>
);

const AuthSection = ({
    authType,
    authValue,
    onTypeChange,
    onValueChange
}: {
    authType: AuthType;
    authValue: string;
    onTypeChange: (type: AuthType) => void;
    onValueChange: (value: string) => void;
}) => (
    <div className="space-y-2">
        <Label className="text-sm font-medium dark:text-gray-200">Authentification</Label>
        <div className="flex gap-4">
            <div className="flex-1">
                <Select value={authType} onValueChange={onTypeChange}>
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                        <SelectValue placeholder="Type d'authentification" />
                    </SelectTrigger>
                    <SelectContent>
                        {AUTH_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                <div className="flex flex-col">
                                    <span>{option.label}</span>
                                    <span className="text-xs text-gray-500">{option.description}</span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            {authType !== 'none' && (
                <div className="flex-1">
                    <Input
                        type={authType === 'basic' ? 'text' : 'password'}
                        value={authValue}
                        onChange={(e) => onValueChange(e.target.value)}
                        placeholder={
                            authType === 'bearer' ? 'Entrez votre token' :
                            authType === 'basic' ? 'username:password' :
                            'Entrez votre clé API'
                        }
                        className="dark:bg-gray-700 dark:border-gray-600"
                    />
                </div>
            )}
        </div>
    </div>
);

const BodySection = ({
    showBody,
    onToggle,
    body,
    onChange
}: {
    showBody: boolean;
    onToggle: (value: boolean) => void;
    body: string;
    onChange: (value: string) => void;
}) => (
    <div className="space-y-2">
        <div className="flex items-center justify-between">
            <Label className="text-sm font-medium dark:text-gray-200">Body</Label>
            <Switch
                checked={showBody}
                onCheckedChange={onToggle}
                className="data-[state=checked]:bg-blue-600"
            />
        </div>
        {showBody && (
            <Textarea
                value={body}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Entrez le body de la requête..."
                className="h-32 dark:bg-gray-700 dark:border-gray-600"
            />
        )}
    </div>
);

const ResponseSection = ({
    response,
    responseStatus,
    onCopy,
    copied
}: {
    response: string;
    responseStatus: number | null;
    onCopy: () => void;
    copied: boolean;
}) => (
    <div className="space-y-2">
        <div className="flex items-center justify-between">
            <Label className="text-sm font-medium dark:text-gray-200">Réponse</Label>
            <div className="flex items-center gap-2">
                {responseStatus && (
                    <span className={`text-sm font-medium ${
                        responseStatus >= 200 && responseStatus < 300
                            ? 'text-green-500'
                            : responseStatus >= 400
                            ? 'text-red-500'
                            : 'text-yellow-500'
                    }`}>
                        {responseStatus}
                    </span>
                )}
                <Button variant="ghost" size="icon" onClick={onCopy}>
                    {copied ? <RefreshCw className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
            </div>
        </div>
        <ScrollArea className="h-64 w-full rounded-md border p-4 dark:bg-gray-700 dark:border-gray-600">
            <pre className="text-sm whitespace-pre-wrap">
                {formatResponse(response)}
            </pre>
        </ScrollArea>
    </div>
);

const HistorySection = ({
    history,
    onSelect
}: {
    history: RequestHistory[];
    onSelect: (url: string, method: string) => void;
}) => (
    <div className="space-y-2">
        <Label className="text-sm font-medium dark:text-gray-200">Historique</Label>
        <ScrollArea className="h-32 w-full rounded-md border p-4 dark:bg-gray-700 dark:border-gray-600">
            <div className="space-y-2">
                {history.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded cursor-pointer"
                        onClick={() => onSelect(item.url, item.method)}
                    >
                        <div className="flex items-center gap-2">
                            <History className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{item.method}</span>
                            <span className="text-sm text-gray-500">{item.url}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                            {item.timestamp.toLocaleTimeString()}
                        </span>
                    </div>
                ))}
            </div>
        </ScrollArea>
    </div>
);

const formatResponse = (response: string) => {
    try {
        const parsed = JSON.parse(response);
        return JSON.stringify(parsed, null, 2);
    } catch {
        return response;
    }
};

const HttpTester = () => {
    const [url, setUrl] = useState('');
    const [method, setMethod] = useState('GET');
    const [headers, setHeaders] = useState<Header[]>([{ key: '', value: '' }]);
    const [body, setBody] = useState('');
    const [response, setResponse] = useState('');
    const [responseStatus, setResponseStatus] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showHeaders, setShowHeaders] = useState(false);
    const [showBody, setShowBody] = useState(false);
    const [curlInput, setCurlInput] = useState('');
    const [history, setHistory] = useState<RequestHistory[]>([]);
    const [copied, setCopied] = useState(false);
    const [authType, setAuthType] = useState<AuthType>('none');
    const [authValue, setAuthValue] = useState('');

    const handleAuthChange = (type: AuthType) => {
        setAuthType(type);
        setAuthValue('');
        
        // Supprimer l'ancien header Authorization s'il existe
        setHeaders(headers.filter(h => h.key.toLowerCase() !== 'authorization'));
        
        if (type !== 'none') {
            setShowHeaders(true);
        }
    };

    const handleAuthValueChange = (value: string) => {
        setAuthValue(value);
        
        // Supprimer l'ancien header Authorization
        const newHeaders = headers.filter(h => h.key.toLowerCase() !== 'authorization');
        
        // Ajouter le nouveau header Authorization
        if (value) {
            let authHeader = '';
            switch (authType) {
                case 'bearer':
                    authHeader = `Bearer ${value}`;
                    break;
                case 'basic':
                    authHeader = `Basic ${btoa(value)}`;
                    break;
                case 'apiKey':
                    authHeader = value;
                    break;
            }
            
            if (authHeader) {
                newHeaders.push({ key: 'Authorization', value: authHeader });
            }
        }
        
        setHeaders(newHeaders);
    };

    const handleAddHeader = () => {
        setHeaders([...headers, { key: '', value: '' }]);
    };

    const handleRemoveHeader = (index: number) => {
        setHeaders(headers.filter((_, i) => i !== index));
    };

    const handleHeaderChange = (index: number, field: 'key' | 'value', value: string) => {
        const newHeaders = [...headers];
        newHeaders[index] = { ...newHeaders[index], [field]: value };
        setHeaders(newHeaders);
    };

    const handleSendRequest = async () => {
        setIsLoading(true);
        setError('');
        setResponse('');

        try {
            const headersObj = headers.reduce((acc, header) => {
                if (header.key && header.value) {
                    acc[header.key] = header.value;
                }
                return acc;
            }, {} as Record<string, string>);

            const options: RequestInit = {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    ...headersObj,
                },
            };

            if (['POST', 'PUT', 'PATCH'].includes(method) && body) {
                options.body = body;
            }

            const response = await fetch(url, options);
            setResponseStatus(response.status);
            const responseData = await response.text();
            setResponse(responseData);

            // Ajouter à l'historique
            setHistory(prev => [{
                id: Date.now(),
                method,
                url,
                timestamp: new Date()
            }, ...prev].slice(0, 10));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyResponse = async () => {
        await navigator.clipboard.writeText(response);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const parseCurl = (curl: string) => {
        try {
            // Réinitialiser tous les états
            setUrl('');
            setMethod('GET');
            setHeaders([{ key: '', value: '' }]);
            setBody('');
            setError('');
            setShowHeaders(false);
            setShowBody(false);

            // Nettoyer la commande curl
            curl = curl.trim();
            
            // Extraire l'URL et la méthode
            const urlMethodRegex = /curl\s+(?:-X\s+([A-Z]+)\s+)?['"']?(https?:\/\/[^\s'"]+)['"']?/;
            const urlMethodMatch = curl.match(urlMethodRegex);
            
            if (urlMethodMatch) {
                if (urlMethodMatch[1]) {
                    setMethod(urlMethodMatch[1]);
                }
                setUrl(urlMethodMatch[2]);
            }

            // Extraire les headers
            const newHeaders: Header[] = [];
            const headerRegex = /-H\s+['"]([^:]+):\s*([^'"]+)['"]/g;
            let headerMatch;
            
            while ((headerMatch = headerRegex.exec(curl)) !== null) {
                newHeaders.push({
                    key: headerMatch[1].trim(),
                    value: headerMatch[2].trim()
                });
            }
            
            if (newHeaders.length > 0) {
                setHeaders(newHeaders);
            }

            // Extraire le body
            const bodyRegex = /-d\s+['"]({[^}]+})['"]/;
            const bodyMatch = curl.match(bodyRegex);
            if (bodyMatch) {
                try {
                    // Tenter de formater le JSON si c'est du JSON valide
                    const jsonBody = JSON.parse(bodyMatch[1]);
                    setBody(JSON.stringify(jsonBody, null, 2));
                } catch {
                    // Si ce n'est pas du JSON valide, utiliser le body tel quel
                    setBody(bodyMatch[1]);
                }
            }

            // Activer les sections pertinentes
            if (newHeaders.length > 0) {
                setShowHeaders(true);
            }
            if (bodyMatch) {
                setShowBody(true);
            }
        } catch (err) {
            setError('Format CURL invalide');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <Card className="border-none shadow-lg dark:bg-gray-800">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                    <div className="flex items-center gap-2">
                        <Code className="h-6 w-6" />
                        <CardTitle>HTTP Tester</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <RequestUrlInput url={url} onChange={setUrl} />
                            
                            <div className="flex gap-4">
                                <MethodSelector method={method} onChange={setMethod} />
                                <CurlInput 
                                    value={curlInput} 
                                    onChange={setCurlInput}
                                    onParse={() => parseCurl(curlInput)}
                                />
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    onClick={() => parseCurl(curlInput)}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    <Code className="h-4 w-4 mr-2" />
                                    Parser CURL
                                </Button>
                                <Button
                                    onClick={handleSendRequest}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                                    disabled={isLoading || !url}
                                >
                                    <Send className="h-4 w-4 mr-2" />
                                    {isLoading ? 'Envoi...' : 'Envoyer'}
                                </Button>
                            </div>

                            <AuthSection 
                                authType={authType}
                                authValue={authValue}
                                onTypeChange={handleAuthChange}
                                onValueChange={handleAuthValueChange}
                            />

                            <HeadersSection 
                                showHeaders={showHeaders}
                                onToggle={setShowHeaders}
                                headers={headers}
                                onAdd={handleAddHeader}
                                onRemove={handleRemoveHeader}
                                onChange={handleHeaderChange}
                            />

                            <BodySection 
                                showBody={showBody}
                                onToggle={setShowBody}
                                body={body}
                                onChange={setBody}
                            />
                        </div>

                        {error && (
                            <Alert className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
                                <AlertDescription className="text-red-600 dark:text-red-400">
                                    {error}
                                </AlertDescription>
                            </Alert>
                        )}

                        {response && (
                            <ResponseSection 
                                response={response}
                                responseStatus={responseStatus}
                                onCopy={handleCopyResponse}
                                copied={copied}
                            />
                        )}

                        {history.length > 0 && (
                            <HistorySection 
                                history={history}
                                onSelect={(url, method) => {
                                    setUrl(url);
                                    setMethod(method);
                                }}
                            />
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default HttpTester; 