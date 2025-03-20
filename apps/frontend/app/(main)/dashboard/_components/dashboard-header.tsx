import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {redirect} from "next/navigation";

interface HeaderProps {
    name?: string;
}

const DashboardHeader: React.FC<HeaderProps> = ({ name = "Sidharth" }) => {


    return (
        <header className="w-full py-4 px-6 flex items-center justify-between animate-fade-in">
            <h1 className="text-2xl font-medium">How are you today, {name}?</h1>

            <div className="flex items-center gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Search"
                        className="py-2 pl-10 pr-4 w-64 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">/</span>
                </div>

                <Button
                    className="bg-primary hover:bg-primary/90 transition-all"
                    onClick={() => redirect('dashboard/create-monitor')}
                >
                    Create monitor
                </Button>
            </div>
        </header>
    );
};

export default DashboardHeader;