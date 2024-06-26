import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import AuthProvider from './context/AuthContext';
import { QueryProvider } from './lib/react-query/QueryProvider';


ReactDOM.createRoot(document.getElementById('root')!)
    .render(
        <React.StrictMode>
            <BrowserRouter>
                <QueryProvider>
                    <AuthProvider>
                        <App />
                    </AuthProvider>
                    <ReactQueryDevtools />
                </QueryProvider>
            </BrowserRouter>
        </React.StrictMode>
    )