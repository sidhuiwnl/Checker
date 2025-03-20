"use client"

import React from 'react';
import {redirect} from "next/navigation";
import { Button } from '@/components/ui/button';
import { ChevronDown, AlertCircle, HelpCircle } from 'lucide-react';

const CreateMonitor = () => {


    return (
        <div className="min-h-screen bg-background text-white">
            <header className="w-full py-6 px-6">
                <h1 className="text-2xl font-medium">Create monitor</h1>
            </header>

            <main className="container mx-auto px-6 py-6 max-w-5xl animate-slide-up">
                <div className="grid grid-cols-12 gap-8">
                    {/* Left column */}
                    <div className="col-span-4">
                        <h2 className="text-xl font-medium mb-3">What to monitor</h2>
                        <p className="text-gray-400">
                            Configure the target website you want to monitor.
                            You'll find the advanced configuration below, in
                            the advanced settings section.
                        </p>
                    </div>

                    {/* Right column */}
                    <div className="col-span-8 space-y-6">
                        <div className="p-6 bg-white/5 rounded-lg border border-white/10">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <span>Alert us when</span>
                                    <HelpCircle size={16} className="text-gray-400" />
                                </div>
                                <div className="px-3 py-1 bg-white/10 rounded-md text-sm">
                                    Billable
                                </div>
                            </div>

                            <div className="relative">
                                <select
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-md appearance-none text-white focus:outline-none focus:ring-1 focus:ring-primary"
                                >
                                    <option>URL becomes unavailable</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                            </div>

                            <div className="mt-4">
                                <p className="text-gray-400 text-sm">
                                    We recommend the keyword matching method.
                                    <a href="#" className="text-primary ml-1 hover:underline">
                                        Upgrade your account to enable more options.
                                    </a>
                                </p>
                            </div>
                        </div>

                        <div className="p-6 bg-white/5 rounded-lg border border-white/10">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <span>URL to monitor</span>
                                    <HelpCircle size={16} className="text-gray-400" />
                                </div>
                            </div>

                            <input
                                type="text"
                                placeholder="https://"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-primary"
                            />

                            <div className="mt-4">
                                <p className="text-gray-400 text-sm">
                                    You can import multiple monitors
                                    <a href="#" className="text-primary ml-1 hover:underline">
                                        here
                                    </a>.
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button
                                variant="outline"
                                className="border-white/20 text-white hover:bg-white/10"
                                onClick={() => redirect('/dashboard')}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="bg-primary hover:bg-primary/90"
                                onClick={() => redirect('/dashboard')}
                            >
                                Create monitor
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CreateMonitor;