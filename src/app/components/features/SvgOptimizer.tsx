import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'react-hot-toast';
import { createPatch } from 'diff';

interface OptimizationOptions {
    removeViewBox: boolean;
    removeDimensions: boolean;
    removeUselessDefs: boolean;
    removeUselessStrokeAndFill: boolean;
    removeEmptyAttrs: boolean;
    removeHiddenElems: boolean;
    removeEmptyText: boolean;
    removeEmptyContainers: boolean;
    cleanupIDs: boolean;
    convertColors: {
        currentColor: boolean;
        names2hex: boolean;
        rgb2hex: boolean;
        shorthex: boolean;
        shortname: boolean;
    };
    convertPathData: boolean;
    convertTransform: boolean;
    removeUnknownsAndDefaults: boolean;
    removeNonInheritableGroupAttrs: boolean;
}

const SvgOptimizer: React.FC = () => {
    const [originalSvg, setOriginalSvg] = useState<string>('');
    const [optimizedSvg, setOptimizedSvg] = useState<string>('');
    const [diff, setDiff] = useState<string>('');
    const [options, setOptions] = useState<OptimizationOptions>({
        removeViewBox: true,
        removeDimensions: true,
        removeUselessDefs: true,
        removeUselessStrokeAndFill: true,
        removeEmptyAttrs: true,
        removeHiddenElems: true,
        removeEmptyText: true,
        removeEmptyContainers: true,
        cleanupIDs: true,
        convertColors: {
            currentColor: true,
            names2hex: true,
            rgb2hex: true,
            shorthex: true,
            shortname: true
        },
        convertPathData: true,
        convertTransform: true,
        removeUnknownsAndDefaults: true,
        removeNonInheritableGroupAttrs: true,
    });

    const onDrop = async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        if (!file.type.includes('svg')) {
            toast.error('Veuillez sélectionner un fichier SVG');
            return;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
            const svgContent = e.target?.result as string;
            setOriginalSvg(svgContent);
            await optimizeSvg(svgContent);
        };
        reader.readAsText(file);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/svg+xml': ['.svg']
        },
        multiple: false
    });

    const optimizeSvg = async (svgContent: string) => {
        try {
            const response = await fetch('/api/optimize-svg', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    svg: svgContent,
                    options
                })
            });

            if (!response.ok) {
                throw new Error('Optimisation échouée');
            }

            const result = await response.json();

            if (!result.data) {
                throw new Error('Optimisation échouée');
            }

            setOptimizedSvg(result.data);
            
            // Générer le diff
            const patch = createPatch('input.svg', svgContent, result.data);
            setDiff(patch);

            const originalSize = svgContent.length;
            const optimizedSize = result.data.length;
            const reduction = ((originalSize - optimizedSize) / originalSize * 100).toFixed(2);
            toast.success(`Optimisation réussie ! Réduction de ${reduction}%`);
        } catch (error) {
            toast.error('Erreur lors de l&apos;optimisation du SVG');
            console.error(error);
        }
    };

    const handleOptionChange = (option: keyof OptimizationOptions) => {
        setOptions(prev => ({
            ...prev,
            [option]: !prev[option]
        }));
    };

    const renderDiff = (diffText: string) => {
        return diffText.split('\n').map((line, index) => {
            if (line.startsWith('+')) {
                return <div key={index} className="bg-green-100 text-green-800">{line}</div>;
            } else if (line.startsWith('-')) {
                return <div key={index} className="bg-red-100 text-red-800">{line}</div>;
            } else if (line.startsWith('@')) {
                return <div key={index} className="bg-blue-100 text-blue-800">{line}</div>;
            }
            return <div key={index}>{line}</div>;
        });
    };

    return (
        <div className="space-y-4">
            <Card className="p-4">
                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                        ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}`}
                >
                    <input {...getInputProps()} />
                    {isDragActive ? (
                        <p>Déposez le fichier SVG ici...</p>
                    ) : (
                        <p>Glissez-déposez un fichier SVG ici, ou cliquez pour sélectionner</p>
                    )}
                </div>
            </Card>

            {originalSvg && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4">
                        <h3 className="font-semibold mb-2">SVG Original</h3>
                        <div className="mb-4 border rounded-md p-4 bg-white">
                            <div dangerouslySetInnerHTML={{ __html: originalSvg }} className="max-w-full h-auto" />
                        </div>
                        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                            <pre className="text-sm whitespace-pre-wrap break-all">{originalSvg}</pre>
                        </ScrollArea>
                    </Card>

                    <Card className="p-4">
                        <h3 className="font-semibold mb-2">SVG Optimisé</h3>
                        <div className="mb-4 border rounded-md p-4 bg-white">
                            <div dangerouslySetInnerHTML={{ __html: optimizedSvg }} className="max-w-full h-auto" />
                        </div>
                        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                            <pre className="text-sm whitespace-pre-wrap break-all">{optimizedSvg}</pre>
                        </ScrollArea>
                    </Card>
                </div>
            )}

            {diff && (
                <Card className="p-4">
                    <h3 className="font-semibold mb-2">Modifications</h3>
                    <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                        <pre className="text-sm font-mono whitespace-pre-wrap break-all">
                            {renderDiff(diff)}
                        </pre>
                    </ScrollArea>
                </Card>
            )}

            <Card className="p-4">
                <h3 className="font-semibold mb-2">Options d&apos;optimisation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(options).map(([key, value]) => (
                        <div key={key} className="flex items-center space-x-2">
                            <Switch
                                id={key}
                                checked={typeof value === 'boolean' ? value : true}
                                onCheckedChange={() => handleOptionChange(key as keyof OptimizationOptions)}
                            />
                            <Label htmlFor={key} className="text-sm">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                            </Label>
                        </div>
                    ))}
                </div>
                {originalSvg && (
                    <Button
                        className="mt-4"
                        onClick={() => optimizeSvg(originalSvg)}
                    >
                        Réoptimiser
                    </Button>
                )}
            </Card>
        </div>
    );
};

export default SvgOptimizer; 