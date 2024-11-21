'use client';

import React, {useEffect, useState} from 'react';
import {
    Settings,
    ChevronDown,
    AlignLeft,
    X,
    Search,
    Moon,
    Sun
} from 'lucide-react';
import {menuItems} from "@/app/enums/menuItems";

const MainNav = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState('');
    const [selectedTool, setSelectedTool] = useState<string>('');

    const handleToolSelect = (toolName: string) => {
        setSelectedTool(toolName);
        localStorage.setItem('selectedTool', toolName);
    };
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        // Check if user has dark mode preference
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        }

        // Check if user has selected a tool
        const selectedTool = localStorage.getItem('selectedTool');
        if (selectedTool) {
            setSelectedTool(selectedTool);
        }
    }, []);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        if (isDarkMode) {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
        } else {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
        }
    };

    const toggleDropdown = (key: string) => {
        setActiveDropdown(activeDropdown === key ? '' : key);
    };

    const renderTool = () => {
        if (selectedTool) {
            const category = Object.values(menuItems).find((item) => item.items.find((tool) => tool.name === selectedTool));
            const tool = category?.items.find((item) => item.name === selectedTool);

            if (tool?.component) {
                return tool.component;
            } else {
                return <div className="text-center text-gray-500 dark:text-gray-400">Outil {selectedTool} non trouvé</div>;
            }
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Top Navigation Bar */}
            <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 fixed w-full z-30">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Left side */}
                        <div className="flex items-center">
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
                            >
                                {isSidebarOpen ? <X className="h-6 w-6"/> : <AlignLeft className="h-6 w-6"/>}
                            </button>
                            <div className="ml-4 font-semibold text-lg text-gray-900 dark:text-white">DevTools</div>
                        </div>

                        {/* Search bar */}
                        <div className="flex-1 max-w-2xl mx-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search tools..."
                                    className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-200 dark:border-gray-600
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           dark:focus:ring-blue-400 dark:placeholder-gray-400"
                                />
                                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500"/>
                            </div>
                        </div>

                        {/* Right side */}
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                {isDarkMode ?
                                    <Sun className="h-5 w-5 text-gray-500 dark:text-gray-400"/> :
                                    <Moon className="h-5 w-5 text-gray-500 dark:text-gray-400"/>
                                }
                            </button>
                            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                                <Settings className="h-5 w-5 text-gray-500 dark:text-gray-400"/>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                      w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 
                      transition-transform duration-200 ease-in-out z-20 pt-16`}>
                <div className="h-full overflow-y-auto">
                    {Object.entries(menuItems).map(([category, {icon, items}]) => (
                        <div key={category} className="px-3 py-2">
                            <button
                                onClick={() => toggleDropdown(category)}
                                className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium
                         text-gray-600 dark:text-gray-300 rounded-lg
                         hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <div className="flex items-center">
                                    {icon}
                                    <span className="ml-3">{category}</span>
                                </div>
                                <ChevronDown
                                    className={`w-4 h-4 transition-transform duration-200 ${
                                        activeDropdown === category ? 'transform rotate-180' : ''
                                    }`}
                                />
                            </button>
                            {activeDropdown === category && (
                                <div className="mt-2 space-y-1 pl-10">
                                    {items.map((item) => (
                                        <button
                                            key={item.name}
                                            className="block w-full text-left px-3 py-2 text-sm
                               text-gray-600 dark:text-gray-300 rounded-lg
                               hover:bg-gray-100 dark:hover:bg-gray-700 relative"
                                            onClick={() => handleToolSelect(item.name)}
                                        >
                                            {selectedTool === item.name && (
                                                <div
                                                    className="absolute inset-y-0 left-0 w-1 bg-blue-500 rounded-l-lg"/>
                                            )}
                                            <div className="font-medium">
                                                {item.name} &nbsp;
                                                {item.new && (
                                                    <span
                                                        className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">New</span>
                                                )}

                                            </div>
                                            <div
                                                className="text-xs text-gray-400 dark:text-gray-500">{item.description}</div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Main content overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-10"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main content */}
            <main className={`transition-all duration-200 ${isSidebarOpen ? 'ml-64' : ''} pt-16`}>
                <div className="px-4 sm:px-6 lg:px-8 py-6">
                    {selectedTool ? (
                        renderTool()
                    ) : (
                        <div className="text-center text-gray-500 dark:text-gray-400">
                            Sélectionnez un outil pour commencer...
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default MainNav;