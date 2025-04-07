"use client"

import React from "react";
import {SidebarProvider,SidebarInset} from "@/components/ui/sidebar";
import {AppSidebar} from "@/app/(main)/dashboard/_components/app-sidebar";
import {SiteHeader} from "@/components/site-header";
import {usePathname} from "next/navigation";

type Props = {
    children: React.ReactNode,
}

export default function DashboardLayout({ children } : Props){
    const pathname = usePathname();

    return(
       <SidebarProvider>
           <AppSidebar variant="inset" />
           <SidebarInset>
               <SiteHeader pathname={pathname} />
                {children}
           </SidebarInset>
       </SidebarProvider>
    )
}