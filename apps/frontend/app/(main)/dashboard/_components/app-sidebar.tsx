"use client"
import { BarChart2, Briefcase, Code, PaintBucket,  Search, Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import {useUser} from "@clerk/nextjs";




const items = [{
    icon : <BarChart2 className="mr-3 h-4 w-4" />,
    name : "Overview",
    path: "#"
},{
    icon : <Briefcase className="mr-3 h-4 w-4" />,
    name : "Positions",
    path: "#"
},{
    icon : <PaintBucket className="mr-3 h-4 w-4" />,
    name : "Create Monitor",
    path : "/dashboard/create-monitor"
},{
    icon: <Users className="mr-3 h-4 w-4" />,
    name :"Team Management",
    path: "#"
},{
    icon : <Code className="mr-3 h-4 w-4" />,
    name : "API Key",
    path: "#"
}]

export function AppSidebar() {
    const user = useUser();


    return (
            <Sidebar className="bg-black text-white border-r-0">
                <SidebarHeader className="p-4 flex items-center justify-between mt-5">
                    <h1 className="text-xl font-bold">Checker</h1>

                </SidebarHeader>

                <SidebarContent className="px-3">

                    <div className="relative mb-4">
                        <Input
                            placeholder="Search"
                            className="bg-[#1e1e1e] border-0 rounded-md pl-3 pr-9 h-10 text-sm text-gray-300 w-full"
                        />
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>

                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu className="flex flex-col gap-4">
                                {items.map((item,index) => (
                                    <SidebarMenuItem key={index}>
                                        <SidebarMenuButton asChild className="text-white hover:bg-[#1e1e1e] hover:text-white">
                                            <a href={`${item.path}`} className="flex items-center">
                                                {item.icon}
                                                <span>{item.name}</span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}

                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter className="p-4 mt-auto border-t border-[#1e1e1e]">
                    <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-3">
                            <AvatarImage src={`${user.user?.imageUrl}`} alt={`${user.user?.firstName}`} />
                            <AvatarFallback className="bg-indigo-600">{user.user?.firstName}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{user.user?.firstName}</p>
                            <p className="text-xs text-gray-400 truncate">{user.user?.emailAddresses[0].emailAddress}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-more-horizontal"
                            >
                                <circle cx="12" cy="12" r="1" />
                                <circle cx="19" cy="12" r="1" />
                                <circle cx="5" cy="12" r="1" />
                            </svg>
                            <span className="sr-only">User menu</span>
                        </Button>
                    </div>
                </SidebarFooter>
            </Sidebar>

    )
}

