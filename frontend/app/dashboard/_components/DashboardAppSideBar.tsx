"use client"

import * as React from "react"
import {
    IconDashboard, IconFileText,
    IconHelp, IconListDetails,
    IconSearch,
    IconSettings,
} from "@tabler/icons-react"

import { NavMain } from "@/components/sidebar/nav-main"
import { NavSecondary } from "@/components/sidebar/nav-secondary"
import { NavUser } from "@/components/sidebar/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import AppLogoShape from "@/components/custom-ui/AppLogoShape";
import AppLogoText from "@/components/custom-ui/AppLogoText";
import {
    CalendarSyncIcon,
    Mails,
    MessageSquareMoreIcon,
    NewspaperIcon,
    RouteIcon,
    ToolCaseIcon,
    TrafficConeIcon
} from "lucide-react";
import {NavAccount} from "@/components/sidebar/nav-account";
import {Separator} from "@/components/ui/separator";

const data = {

    navMain: [
        {
            title: "Dashboard (*)",
            url: "/dashboard",
            icon: IconDashboard,
        },
        {
            title: "My Learning paths (*)",
            url: "/dashboard/learning-paths",
            icon: RouteIcon,
        },
        {
            title: "My Courses",
            url: "/dashboard/courses",
            icon: IconListDetails,
        },
        {
            title: "My Workshops (*)",
            url: "/dashboard/workshops",
            icon: TrafficConeIcon,
        },
        {
            title: "My Resources (*)",
            url: "/dashboard/resources",
            icon: ToolCaseIcon,
        },

    ],
    navAccount:[
        {
            title: "My Subscriptions (*)",
            url: "/dashboard/subscriptions",
            icon: CalendarSyncIcon,
        },{
            title: "My Messages",
            url: "/dashboard/messages",
            icon: Mails,
        },
        {
            title: "My Invoices (*)",
            url: "/dashboard/invoices",
            icon: IconFileText,
        },
    ],
    navSecondary: [
        {
            title: "Settings (*)",
            url: "/dashboard/settings",
            icon: IconSettings,
        },
        {
            title: "Get Help (*)",
            url: "#",
            icon: IconHelp,
        },
        {
            title: "My Testimonial (*)",
            url: "/dashboard/my-testimonial",
            icon: MessageSquareMoreIcon,
        },
        {
            title: "Newsletter",
            url: "/dashboard/my-newsletter",
            icon: NewspaperIcon,
        },
        {
            title: "/Search (*)",
            url: "/dashboard/Search",
            icon: IconSearch,
        },
    ],
}

export function DashboardAppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:!p-1.5"
                        >
                            <Link href="/" >
                                <AppLogoShape
                                    logo="/logo/code&skills-transparent.png"
                                    width={80}
                                    height={80}
                                    priority={ true}
                                />
                                <AppLogoText
                                    logo="/logo/CODE_SKILLS_cropped.png"
                                    alt="code and skills text"
                                    width={120}
                                    height={50}
                                    priority
                                />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain}/>
                <Separator className="mt-4"/>
                <span>Account</span>
                <NavAccount items={data.navAccount}/>
                <NavSecondary items={data.navSecondary} className="mt-auto"/>
            </SidebarContent>
            <SidebarFooter>
                <NavUser/>
            </SidebarFooter>
        </Sidebar>
    )
}
