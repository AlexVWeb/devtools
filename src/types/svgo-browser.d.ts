declare module 'svgo' {
    export interface OptimizeOptions {
        multipass?: boolean;
        plugins?: Array<{
            name: string;
            params?: {
                overrides?: Record<string, any>;
            };
        }>;
    }

    export interface OptimizeResult {
        data: string;
        info?: {
            width?: string;
            height?: string;
        };
    }

    export function optimize(svg: string, options?: OptimizeOptions): OptimizeResult;
} 