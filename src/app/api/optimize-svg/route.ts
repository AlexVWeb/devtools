import { NextResponse } from 'next/server';
import { optimize } from 'svgo';

export async function POST(request: Request) {
    try {
        const { svg, options } = await request.json();

        if (!svg) {
            return NextResponse.json(
                { error: 'SVG content is required' },
                { status: 400 }
            );
        }

        // Créer un objet de configuration avec tous les plugins désactivés par défaut
        const pluginConfig = {
            removeViewBox: false,
            removeDimensions: false,
            removeUselessDefs: false,
            removeUselessStrokeAndFill: false,
            removeEmptyAttrs: false,
            removeHiddenElems: false,
            removeEmptyText: false,
            removeEmptyContainers: false,
            cleanupIDs: false,
            convertColors: false,
            convertPathData: false,
            convertTransform: false,
            removeUnknownsAndDefaults: false,
            removeNonInheritableGroupAttrs: false,
            // Désactiver d'autres optimisations par défaut
            cleanupAttrs: false,
            mergeStyles: false,
            inlineStyles: false,
            minifyStyles: false,
            cleanupNumericValues: false,
            convertStyleToAttrs: false,
            removeComments: false,
            removeDesc: false,
            removeTitle: false,
            removeMetadata: false,
            removeEditorsNSData: false,
            removeEmptyRects: false,
            removeEmptyLines: false,
            collapseGroups: false,
            mergePaths: false,
            convertShapeToPath: false,
            moveElemsAttrsToGroup: false,
            moveGroupAttrsToElems: false,
            removeRasterImages: false,
            removeScriptElement: false,
            removeStyleElement: false,
            removeXMLProcInst: false,
            removeDoctype: false,
            removeXMLNS: false,
            sortAttrs: false,
            sortDefsChildren: false,
            removeOffCanvasPaths: false,
            reusePaths: false
        };

        // Activer uniquement les plugins sélectionnés
        const activePlugins = { ...pluginConfig, ...options };

        const result = optimize(svg, {
            multipass: true,
            plugins: [
                {
                    name: 'preset-default',
                    params: {
                        overrides: activePlugins
                    }
                }
            ]
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error('SVG optimization error:', error);
        return NextResponse.json(
            { error: 'Failed to optimize SVG' },
            { status: 500 }
        );
    }
} 