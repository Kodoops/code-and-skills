"use client"

import * as React from "react"
import {
  IconDashboard,
  IconListDetails,
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
import {Separator} from "@/components/ui/separator";
import { NavOrga } from "./nav-orga"
import {
  Building2,
  RectangleEllipsis,
  SchoolIcon,
  TableOfContents,
  TagIcon,
  Link as SocialLink,
  GroupIcon,
  RouteIcon,
  TrafficConeIcon,
  ToolCaseIcon, BookOpenCheck, Newspaper, Mails, WalletIcon, CalendarSyncIcon
} from "lucide-react";
import {NavCS} from "@/components/sidebar/nav-cs";

const data = {

  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: IconDashboard,
    },
    {
      title: "Learning Path",
      url: "/admin/learning-paths",
      icon: RouteIcon,
    },
    {
      title: "Courses",
      url: "/admin/courses",
      icon: IconListDetails,
    },
    {
      title: "Workshops",
      url: "/admin/workshops",
      icon: TrafficConeIcon,
    },
    {
      title: "Resources",
      url: "/admin/resources",
      icon: ToolCaseIcon,
    },
    {
      title: "Quiz",
      url: "/admin/quiz",
      icon: BookOpenCheck,
    },
  ],
  navOrga:[
    {
      title: "Domains",
      url: "/admin/domains",
      icon: GroupIcon,
    },
    {
      title: "Categories",
      url: "/admin/categories",
      icon: TableOfContents,
    },
    {
      title: "Tags",
      url: "/admin/tags",
      icon: TagIcon,
    },
    {
      title: "Niveaux",
      url: "/admin/levels",
      icon: SchoolIcon,
    },
  ],
  navCS:[
    {
      title: "Features",
      url: "/admin/features",
      icon: RectangleEllipsis,
    },
    {
      title: "Company Infos",
      url: "/admin/company-infos",
      icon: Building2,
    },
    {
      title: "Social links",
      url: "/admin/social-links",
      icon: SocialLink,
    },
  ],
  navBilling:[
    {
      title: "Plans",
      url: "/admin/plans",
      icon: WalletIcon,
    },
    {
      title: "Subscriptions",
      url: "/admin/subscriptions",
      icon: CalendarSyncIcon,
    },

  ],
  navSecondary: [
    {
      title: "Messages",
      url: "/admin/messages",
      icon: Mails,
    },
    {
      title: "Newsletter",
      url: "/admin/newsletter",
      icon: Newspaper,
    },
    {
      title: "Settings",
      url: "/admin/settings",
      icon: IconSettings,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5 "
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
        <span>Organisation</span>
        <NavOrga items={data.navOrga}/>
        <Separator className="mt-4"/>
        <span>Subscriptions</span>
        <NavCS items={data.navBilling}/>
        <Separator className="mt-4"/>
        <span>Code & Skills</span>
        <NavCS items={data.navCS}/>
        <NavSecondary items={data.navSecondary} className="mt-auto"/>
      </SidebarContent>
      <SidebarFooter>
        <NavUser/>
      </SidebarFooter>
    </Sidebar>
  )
}
