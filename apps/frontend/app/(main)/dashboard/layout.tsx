import React from "react";
import {SidebarProvider,SidebarTrigger} from "@/components/ui/sidebar";
import {AppSidebar} from "@/app/(main)/dashboard/_components/app-sidebar";

type Props = {
    children: React.ReactNode,
}

export default function DashboardLayout({ children } : Props){
    return(
       <SidebarProvider>
           <AppSidebar/>
           <main className="w-full">
               {children}
           </main>
       </SidebarProvider>
    )
}