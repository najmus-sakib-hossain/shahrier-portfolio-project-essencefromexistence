import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import ReactDOMServer from 'react-dom/server';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        title: (title) => (title ? `${title} - ${appName}` : appName),
        resolve: async (name) => {
            // Try .tsx first, then .jsx
            const pages = import.meta.glob('./pages/**/*.{tsx,jsx}');
            
            for (const extension of ['tsx', 'jsx']) {
                const path = `./pages/${name}.${extension}`;
                if (pages[path]) {
                    return pages[path]();
                }
            }
            
            throw new Error(`Page not found: ${name}`);
        },
        setup: ({ App, props }) => {
            return <App {...props} />;
        },
    }),
);
