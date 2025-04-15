'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Copy, Lock, Unlock, Hash, AlertCircle } from "lucide-react";
import toast from 'react-hot-toast';
import CryptoJS from 'crypto-js';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const HashGenerator = () => {
    const [input, setInput] = useState('');
    const [algorithm, setAlgorithm] = useState('SHA-256');
    const [hash, setHash] = useState('');
    const [key, setKey] = useState('');
    const [operationType, setOperationType] = useState<'hash' | 'encrypt' | 'decrypt'>('hash');

    const generateHash = () => {
        if (!input) {
            toast.error('Veuillez entrer un texte à traiter');
            return;
        }

        try {
            let result = '';
            switch (algorithm) {
                case 'MD5':
                    result = CryptoJS.MD5(input).toString();
                    break;
                case 'SHA-1':
                    result = CryptoJS.SHA1(input).toString();
                    break;
                case 'SHA-256':
                    result = CryptoJS.SHA256(input).toString();
                    break;
                case 'SHA-384':
                    result = CryptoJS.SHA384(input).toString();
                    break;
                case 'SHA-512':
                    result = CryptoJS.SHA512(input).toString();
                    break;
                case 'SHA-3':
                    result = CryptoJS.SHA3(input).toString();
                    break;
                case 'RIPEMD-160':
                    result = CryptoJS.RIPEMD160(input).toString();
                    break;
                case 'AES':
                    if (operationType === 'encrypt') {
                        if (!key) {
                            toast.error('Veuillez entrer une clé de chiffrement');
                            return;
                        }
                        result = CryptoJS.AES.encrypt(input, key).toString();
                    } else if (operationType === 'decrypt') {
                        if (!key) {
                            toast.error('Veuillez entrer une clé de déchiffrement');
                            return;
                        }
                        try {
                            result = CryptoJS.AES.decrypt(input, key).toString(CryptoJS.enc.Utf8);
                            if (!result) {
                                toast.error('Clé de déchiffrement invalide');
                                return;
                            }
                        } catch (error) {
                            toast.error('Erreur lors du déchiffrement');
                            return;
                        }
                    }
                    break;
                case 'DES':
                    if (operationType === 'encrypt') {
                        if (!key) {
                            toast.error('Veuillez entrer une clé de chiffrement');
                            return;
                        }
                        result = CryptoJS.DES.encrypt(input, key).toString();
                    } else if (operationType === 'decrypt') {
                        if (!key) {
                            toast.error('Veuillez entrer une clé de déchiffrement');
                            return;
                        }
                        try {
                            result = CryptoJS.DES.decrypt(input, key).toString(CryptoJS.enc.Utf8);
                            if (!result) {
                                toast.error('Clé de déchiffrement invalide');
                                return;
                            }
                        } catch (error) {
                            toast.error('Erreur lors du déchiffrement');
                            return;
                        }
                    }
                    break;
                default:
                    toast.error('Algorithme non supporté');
                    return;
            }
            setHash(result);
        } catch (error) {
            toast.error('Erreur lors du traitement');
            console.error(error);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(hash);
        toast.success('Résultat copié dans le presse-papier');
    };

    const hashAlgorithms = ['MD5', 'SHA-1', 'SHA-256', 'SHA-384', 'SHA-512', 'SHA-3', 'RIPEMD-160'];
    const encryptionAlgorithms = ['AES', 'DES'];

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h3 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Générateur de Hash & Chiffrement
            </h3>

            <Card className="bg-gray-50 dark:bg-gray-900 border-none shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                    <div className="flex items-center gap-2">
                        <Hash className="h-6 w-6" />
                        <CardTitle>Configuration</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="space-y-6">
                        {/* Type d&apos;opération */}
                        <div className="space-y-2">
                            <Label>Type d&apos;opération</Label>
                            <div className="flex space-x-2">
                                <Button
                                    variant={operationType === 'hash' ? 'default' : 'outline'}
                                    onClick={() => setOperationType('hash')}
                                    className="flex-1"
                                >
                                    <Hash className="w-4 h-4 mr-2" />
                                    Hash
                                </Button>
                                <Button
                                    variant={operationType === 'encrypt' ? 'default' : 'outline'}
                                    onClick={() => setOperationType('encrypt')}
                                    className="flex-1"
                                >
                                    <Lock className="w-4 h-4 mr-2" />
                                    Chiffrer
                                </Button>
                                <Button
                                    variant={operationType === 'decrypt' ? 'default' : 'outline'}
                                    onClick={() => setOperationType('decrypt')}
                                    className="flex-1"
                                >
                                    <Unlock className="w-4 h-4 mr-2" />
                                    Déchiffrer
                                </Button>
                            </div>
                        </div>

                        {/* Texte à traiter */}
                        <div className="space-y-2">
                            <Label htmlFor="input">Texte à traiter</Label>
                            <Input
                                id="input"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={operationType === 'hash' ? "Entrez le texte à hasher..." : operationType === 'encrypt' ? "Entrez le texte à chiffrer..." : "Entrez le texte à déchiffrer..."}
                                className="dark:bg-gray-800 dark:border-gray-700"
                            />
                        </div>

                        {/* Algorithme */}
                        <div className="space-y-2">
                            <Label htmlFor="algorithm">Algorithme</Label>
                            <Select 
                                value={algorithm} 
                                onValueChange={setAlgorithm}
                            >
                                <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700">
                                    <SelectValue placeholder="Sélectionnez un algorithme" />
                                </SelectTrigger>
                                <SelectContent>
                                    {operationType === 'hash' ? (
                                        hashAlgorithms.map((algo) => (
                                            <SelectItem key={algo} value={algo}>{algo}</SelectItem>
                                        ))
                                    ) : (
                                        encryptionAlgorithms.map((algo) => (
                                            <SelectItem key={algo} value={algo}>{algo}</SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Clé de chiffrement/déchiffrement */}
                        {operationType !== 'hash' && (
                            <div className="space-y-2">
                                <Label htmlFor="key">Clé de {operationType === 'encrypt' ? 'chiffrement' : 'déchiffrement'}</Label>
                                <Input
                                    id="key"
                                    type="password"
                                    value={key}
                                    onChange={(e) => setKey(e.target.value)}
                                    placeholder={`Entrez votre clé de ${operationType === 'encrypt' ? 'chiffrement' : 'déchiffrement'}...`}
                                    className="dark:bg-gray-800 dark:border-gray-700"
                                />
                            </div>
                        )}

                        {/* Bouton de traitement */}
                        <Button onClick={generateHash} className="w-full">
                            {operationType === 'hash' ? 'Générer le hash' : operationType === 'encrypt' ? 'Chiffrer' : 'Déchiffrer'}
                        </Button>

                        {/* Résultat */}
                        {hash && (
                            <div className="space-y-2">
                                <Label>Résultat</Label>
                                <div className="relative group">
                                    <Input 
                                        value={hash} 
                                        readOnly 
                                        className="pr-24 dark:bg-gray-800 dark:border-gray-700"
                                    />
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={copyToClipboard}
                                        className="absolute right-2 top-1/2 -translate-y-1/2"
                                    >
                                        <Copy className="h-4 w-4 mr-2" />
                                        Copier
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Info Card */}
                        <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                            <AlertCircle className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                            <AlertTitle>Note</AlertTitle>
                            <AlertDescription className="text-blue-700 dark:text-blue-300">
                                {operationType === 'hash' 
                                    ? "Les algorithmes de hachage sont des fonctions à sens unique qui transforment des données en une empreinte numérique unique."
                                    : operationType === 'encrypt'
                                    ? "Le chiffrement transforme vos données en un format illisible sans la clé de déchiffrement appropriée."
                                    : "Le déchiffrement nécessite la même clé que celle utilisée pour le chiffrement."}
                            </AlertDescription>
                        </Alert>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default HashGenerator; 