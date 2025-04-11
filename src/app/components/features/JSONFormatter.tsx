'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle2, AlertCircle, Braces, Minus, Expand } from "lucide-react";
import toast from 'react-hot-toast';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const JSONFormatter = () => {
    const [input, setInput] = useState('');
    const [formattedJSON, setFormattedJSON] = useState('');
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const formatJSON = () => {
        try {
            setError('');
            if (!input.trim()) {
                throw new Error('Veuillez entrer du JSON à formater');
            }
            const parsed = JSON.parse(input);
            const formatted = JSON.stringify(parsed, null, 2);
            setFormattedJSON(formatted);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'JSON invalide');
            setFormattedJSON('');
        }
    };

    const minifyJSON = () => {
        try {
            setError('');
            if (!input.trim()) {
                throw new Error('Veuillez entrer du JSON à minifier');
            }
            const parsed = JSON.parse(input);
            const minified = JSON.stringify(parsed);
            setFormattedJSON(minified);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'JSON invalide');
            setFormattedJSON('');
        }
    };

    const validateJSON = () => {
        try {
            setError('');
            if (!input.trim()) {
                throw new Error('Veuillez entrer du JSON à valider');
            }
            JSON.parse(input);
            toast.success('JSON valide !');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'JSON invalide');
        }
    };

    const copyToClipboard = () => {
        if (formattedJSON) {
            navigator.clipboard.writeText(formattedJSON);
            setCopied(true);
            toast.success('JSON copié dans le presse-papier');
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
        setError('');
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h3 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Formateur JSON
            </h3>

            <Card className="bg-gray-50 dark:bg-gray-900 border-none shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                    <div className="flex items-center gap-2">
                        <Braces className="h-6 w-6" />
                        <CardTitle>Configuration</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="space-y-6">
                        {/* Onglets */}
                        <Tabs defaultValue="format" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="format">
                                    <Expand className="w-4 h-4 mr-2" />
                                    Formater
                                </TabsTrigger>
                                <TabsTrigger value="minify">
                                    <Minus className="w-4 h-4 mr-2" />
                                    Minifier
                                </TabsTrigger>
                                <TabsTrigger value="validate">
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Valider
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="format" className="space-y-4">
                                <div className="space-y-2">
                                    <Label>JSON à formater</Label>
                                    <textarea
                                        className="w-full h-48 p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 transition-all font-mono text-sm"
                                        value={input}
                                        onChange={handleInputChange}
                                        placeholder="Collez votre JSON ici..."
                                    />
                                </div>
                                <Button onClick={formatJSON} className="w-full">
                                    Formater le JSON
                                </Button>
                            </TabsContent>

                            <TabsContent value="minify" className="space-y-4">
                                <div className="space-y-2">
                                    <Label>JSON à minifier</Label>
                                    <textarea
                                        className="w-full h-48 p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 transition-all font-mono text-sm"
                                        value={input}
                                        onChange={handleInputChange}
                                        placeholder="Collez votre JSON ici..."
                                    />
                                </div>
                                <Button onClick={minifyJSON} className="w-full">
                                    Minifier le JSON
                                </Button>
                            </TabsContent>

                            <TabsContent value="validate" className="space-y-4">
                                <div className="space-y-2">
                                    <Label>JSON à valider</Label>
                                    <textarea
                                        className="w-full h-48 p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 transition-all font-mono text-sm"
                                        value={input}
                                        onChange={handleInputChange}
                                        placeholder="Collez votre JSON ici..."
                                    />
                                </div>
                                <Button onClick={validateJSON} className="w-full">
                                    Valider le JSON
                                </Button>
                            </TabsContent>
                        </Tabs>

                        {/* Message d'erreur */}
                        {error && (
                            <Alert variant="destructive" className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                                <AlertCircle className="h-4 w-4 text-red-500 dark:text-red-400" />
                                <AlertTitle>Erreur</AlertTitle>
                                <AlertDescription className="text-red-700 dark:text-red-300">
                                    {error}
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Résultat formaté */}
                        {formattedJSON && (
                            <div className="space-y-2">
                                <Label>Résultat</Label>
                                <div className="relative group">
                                    <textarea
                                        className="w-full h-48 p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 transition-all font-mono text-sm pr-24"
                                        value={formattedJSON}
                                        readOnly
                                    />
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={copyToClipboard}
                                        className="absolute right-2 top-2"
                                    >
                                        <Copy className="h-4 w-4 mr-2" />
                                        {copied ? 'Copié !' : 'Copier'}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Info Card */}
                        <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                            <AlertCircle className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                            <AlertTitle>Note</AlertTitle>
                            <AlertDescription className="text-blue-700 dark:text-blue-300">
                                Le formatage JSON ajoute des espaces et des retours à la ligne pour une meilleure lisibilité, tandis que la minification supprime tous les espaces inutiles pour réduire la taille du fichier.
                            </AlertDescription>
                        </Alert>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default JSONFormatter; 