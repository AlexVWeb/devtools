'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, RefreshCw, Eye, EyeOff, Palette } from 'lucide-react';

type ColorFormat = 'hex' | 'rgb' | 'rgba' | 'hsl' | 'cmyk' | 'hsv';

interface ColorValues {
    hex: string;
    rgb: { r: number; g: number; b: number };
    rgba: { r: number; g: number; b: number; a: number };
    hsl: { h: number; s: number; l: number };
    cmyk: { c: number; m: number; y: number; k: number };
    hsv: { h: number; s: number; v: number };
}

const ColorConverter = () => {
    const [inputColor, setInputColor] = useState('');
    const [inputFormat, setInputFormat] = useState<ColorFormat>('hex');
    const [outputFormat, setOutputFormat] = useState<ColorFormat>('rgb');
    const [colorValues, setColorValues] = useState<ColorValues | null>(null);
    const [copied, setCopied] = useState<{ [key: string]: boolean }>({});
    const [showColorPicker, setShowColorPicker] = useState(true);
    const [error, setError] = useState('');
    const [alpha, setAlpha] = useState(1);

    const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    };

    const rgbToHex = (r: number, g: number, b: number): string => {
        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    };

    const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
        r /= 255;
        g /= 255;
        b /= 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0, s = 0, l = (max + min) / 2;

        if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    };

    const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
        h /= 360;
        s /= 100;
        l /= 100;
        let r = 0, g = 0, b = 0;

        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p: number, q: number, t: number) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;

            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    };

    const rgbToCmyk = (r: number, g: number, b: number): { c: number; m: number; y: number; k: number } => {
        r /= 255;
        g /= 255;
        b /= 255;
        const k = 1 - Math.max(r, g, b);
        const c = (1 - r - k) / (1 - k) || 0;
        const m = (1 - g - k) / (1 - k) || 0;
        const y = (1 - b - k) / (1 - k) || 0;
        return {
            c: Math.round(c * 100),
            m: Math.round(m * 100),
            y: Math.round(y * 100),
            k: Math.round(k * 100)
        };
    };

    const rgbToHsv = (r: number, g: number, b: number): { h: number; s: number; v: number } => {
        r /= 255;
        g /= 255;
        b /= 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const d = max - min;
        let h = 0, s = max === 0 ? 0 : d / max, v = max;

        if (max !== min) {
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            v: Math.round(v * 100)
        };
    };

    const cleanColorInput = (color: string, format: ColorFormat): string => {
        switch (format) {
            case 'hex':
                return color.replace(/^#/, ''); // Retire le # si présent
            case 'rgb':
            case 'rgba':
            case 'hsl':
            case 'cmyk':
            case 'hsv':
                return color.replace(/\s+/g, ''); // Retire les espaces
            default:
                return color;
        }
    };

    const convertColor = () => {
        try {
            setError('');
            let rgb: { r: number; g: number; b: number };
            const cleanedInput = cleanColorInput(inputColor, inputFormat);

            switch (inputFormat) {
                case 'hex':
                    if (!/^[A-Fa-f0-9]{6}$/.test(cleanedInput)) {
                        throw new Error('Format HEX invalide');
                    }
                    rgb = hexToRgb(cleanedInput);
                    break;

                case 'rgb':
                    const rgbMatch = cleanedInput.match(/^rgb\((\d+),(\d+),(\d+)\)$/);
                    if (!rgbMatch) {
                        throw new Error('Format RGB invalide');
                    }
                    rgb = {
                        r: parseInt(rgbMatch[1]),
                        g: parseInt(rgbMatch[2]),
                        b: parseInt(rgbMatch[3])
                    };
                    break;

                case 'rgba':
                    const rgbaMatch = cleanedInput.match(/^rgba\((\d+),(\d+),(\d+),([0-9.]+)\)$/);
                    if (!rgbaMatch) {
                        throw new Error('Format RGBA invalide');
                    }
                    rgb = {
                        r: parseInt(rgbaMatch[1]),
                        g: parseInt(rgbaMatch[2]),
                        b: parseInt(rgbaMatch[3])
                    };
                    setAlpha(parseFloat(rgbaMatch[4]));
                    break;

                case 'hsl':
                    const hslMatch = cleanedInput.match(/^hsl\((\d+),(\d+)%,(\d+)%\)$/);
                    if (!hslMatch) {
                        throw new Error('Format HSL invalide');
                    }
                    const hsl = {
                        h: parseInt(hslMatch[1]),
                        s: parseInt(hslMatch[2]),
                        l: parseInt(hslMatch[3])
                    };
                    rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
                    break;

                case 'cmyk':
                    const cmykMatch = cleanedInput.match(/^cmyk\((\d+)%,(\d+)%,(\d+)%,(\d+)%\)$/);
                    if (!cmykMatch) {
                        throw new Error('Format CMYK invalide');
                    }
                    const cmyk = {
                        c: parseInt(cmykMatch[1]),
                        m: parseInt(cmykMatch[2]),
                        y: parseInt(cmykMatch[3]),
                        k: parseInt(cmykMatch[4])
                    };
                    // Conversion CMYK vers RGB
                    const c = cmyk.c / 100;
                    const m = cmyk.m / 100;
                    const y = cmyk.y / 100;
                    const k = cmyk.k / 100;
                    rgb = {
                        r: Math.round(255 * (1 - c) * (1 - k)),
                        g: Math.round(255 * (1 - m) * (1 - k)),
                        b: Math.round(255 * (1 - y) * (1 - k))
                    };
                    break;

                case 'hsv':
                    const hsvMatch = cleanedInput.match(/^hsv\((\d+),(\d+)%,(\d+)%\)$/);
                    if (!hsvMatch) {
                        throw new Error('Format HSV invalide');
                    }
                    const hsv = {
                        h: parseInt(hsvMatch[1]),
                        s: parseInt(hsvMatch[2]),
                        v: parseInt(hsvMatch[3])
                    };
                    // Conversion HSV vers RGB
                    const h = hsv.h / 360;
                    const s = hsv.s / 100;
                    const v = hsv.v / 100;
                    const i = Math.floor(h * 6);
                    const f = h * 6 - i;
                    const p = v * (1 - s);
                    const q = v * (1 - f * s);
                    const t = v * (1 - (1 - f) * s);
                    let r = 0, g = 0, b = 0;
                    switch (i % 6) {
                        case 0: r = v; g = t; b = p; break;
                        case 1: r = q; g = v; b = p; break;
                        case 2: r = p; g = v; b = t; break;
                        case 3: r = p; g = q; b = v; break;
                        case 4: r = t; g = p; b = v; break;
                        case 5: r = v; g = p; b = q; break;
                    }
                    rgb = {
                        r: Math.round(r * 255),
                        g: Math.round(g * 255),
                        b: Math.round(b * 255)
                    };
                    break;

                default:
                    throw new Error('Format non supporté');
            }

            const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
            const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
            const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
            const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);

            setColorValues({
                hex,
                rgb,
                rgba: { ...rgb, a: alpha },
                hsl,
                cmyk,
                hsv
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur de conversion');
            setColorValues(null);
        }
    };

    const handleCopy = async (text: string, format: string) => {
        await navigator.clipboard.writeText(text);
        setCopied(prev => ({ ...prev, [format]: true }));
        setTimeout(() => setCopied(prev => ({ ...prev, [format]: false })), 2000);
    };

    const detectColorFormat = (color: string): ColorFormat | null => {
        if (/^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) return 'hex';
        if (/^rgb\(\d+,\s*\d+,\s*\d+\)$/.test(color)) return 'rgb';
        if (/^rgba\(\d+,\s*\d+,\s*\d+,\s*[0-9.]+\)$/.test(color)) return 'rgba';
        if (/^hsl\(\d+,\s*\d+%,\s*\d+%\)$/.test(color)) return 'hsl';
        if (/^cmyk\(\d+%,\s*\d+%,\s*\d+%,\s*\d+%\)$/.test(color)) return 'cmyk';
        if (/^hsv\(\d+,\s*\d+%,\s*\d+%\)$/.test(color)) return 'hsv';
        return null;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputColor(value);
        
        if (value) {
            const detectedFormat = detectColorFormat(value);
            if (detectedFormat) {
                setInputFormat(detectedFormat);
            }
            convertColor();
        }
    };

    const getColorPreview = () => {
        if (!colorValues) return null;
        return (
            <div className="relative group">
                <div 
                    className="w-full h-32 rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-300"
                    style={{ 
                        backgroundColor: outputFormat === 'rgba' 
                            ? `rgba(${colorValues.rgba.r}, ${colorValues.rgba.g}, ${colorValues.rgba.b}, ${colorValues.rgba.a})`
                            : colorValues.hex 
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                </div>
                <div className="absolute bottom-2 left-2 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {getOutputValue()}
                </div>
            </div>
        );
    };

    const getOutputValue = () => {
        if (!colorValues) return '';
        switch (outputFormat) {
            case 'hex': return colorValues.hex;
            case 'rgb': return `rgb(${colorValues.rgb.r}, ${colorValues.rgb.g}, ${colorValues.rgb.b})`;
            case 'rgba': return `rgba(${colorValues.rgba.r}, ${colorValues.rgba.g}, ${colorValues.rgba.b}, ${colorValues.rgba.a})`;
            case 'hsl': return `hsl(${colorValues.hsl.h}, ${colorValues.hsl.s}%, ${colorValues.hsl.l}%)`;
            case 'cmyk': return `cmyk(${colorValues.cmyk.c}%, ${colorValues.cmyk.m}%, ${colorValues.cmyk.y}%, ${colorValues.cmyk.k}%)`;
            case 'hsv': return `hsv(${colorValues.hsv.h}, ${colorValues.hsv.s}%, ${colorValues.hsv.v}%)`;
            default: return '';
        }
    };

    const getColorExamples = () => {
        const examples = {
            hex: 'FF0000', // Sans le # pour éviter la confusion
            rgb: 'rgb(255,0,0)', // Sans espaces
            rgba: 'rgba(255,0,0,0.5)', // Sans espaces
            hsl: 'hsl(0,100%,50%)', // Sans espaces
            cmyk: 'cmyk(0%,100%,100%,0%)', // Sans espaces
            hsv: 'hsv(0,100%,100%)' // Sans espaces
        };

        return (
            <div className="mt-2 space-y-2">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    Exemples de formats :
                </div>
                <div className="flex flex-wrap gap-2">
                    {Object.entries(examples).map(([format, example]) => (
                        <Button
                            key={format}
                            variant="outline"
                            size="sm"
                            className="text-xs font-mono"
                            onClick={() => {
                                setInputColor(example);
                                setInputFormat(format as ColorFormat);
                                if (format === 'rgba') {
                                    const alphaMatch = example.match(/,\s*([0-9.]+)\)$/);
                                    if (alphaMatch) {
                                        setAlpha(parseFloat(alphaMatch[1]));
                                    }
                                }
                                convertColor();
                            }}
                        >
                            {format.toUpperCase()}: {format === 'hex' ? `#${example}` : example}
                        </Button>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <Card className="border-none shadow-lg dark:bg-gray-800">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
                    <div className="flex items-center gap-2">
                        <Palette className="h-6 w-6" />
                        <CardTitle>Convertisseur de Couleurs</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="color" className="text-sm font-medium dark:text-gray-200">
                                    Couleur
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="color"
                                        type="text"
                                        value={inputColor}
                                        onChange={handleInputChange}
                                        placeholder="Entrez une couleur (HEX, RGB, RGBA, HSL, etc.)"
                                        className="pr-10 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-0 top-0 h-full px-3"
                                        onClick={() => setShowColorPicker(!showColorPicker)}
                                    >
                                        {showColorPicker ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                </div>
                                {inputColor && (
                                    <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                        Format détecté : {inputFormat.toUpperCase()}
                                    </div>
                                )}
                                {getColorExamples()}
                            </div>

                            <div>
                                <Label className="text-sm font-medium dark:text-gray-200">
                                    Format de sortie
                                </Label>
                                <div className="flex gap-2 mt-2">
                                    {(['hex', 'rgb', 'rgba', 'hsl', 'cmyk', 'hsv'] as ColorFormat[]).map((format) => (
                                        <Button
                                            key={format}
                                            variant={outputFormat === format ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setOutputFormat(format)}
                                            className="flex-1"
                                        >
                                            {format.toUpperCase()}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {error && (
                            <Alert className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
                                <AlertDescription className="text-red-600 dark:text-red-400">
                                    {error}
                                </AlertDescription>
                            </Alert>
                        )}

                        {colorValues && (
                            <div className="space-y-4">
                                {showColorPicker && getColorPreview()}

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium dark:text-gray-200">
                                        Résultat
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            type="text"
                                            value={getOutputValue()}
                                            readOnly
                                            className="pr-10 dark:bg-gray-700 dark:border-gray-600"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-0 top-0 h-full px-3"
                                            onClick={() => handleCopy(getOutputValue(), outputFormat)}
                                        >
                                            {copied[outputFormat] ? <RefreshCw className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ColorConverter; 