"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import Dashboard from "@/components/Dashboard/Dashboard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { ModeToggle } from "@/components/ui/mode";

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center justify-between gap-2 px-4 w-full">
            <div className="flex items-center justify-between">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <ModeToggle variant="ghost" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <p>Take Your notes safe</p>
            </div>
            <div className="mr-8">
              <DropdownMenu>
                <DropdownMenuTrigger>Create Note</DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Link href={"/dashboard/create-note/note"}>Note</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href={"/dashboard/create-note/sketch"}>Sketch</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        <Dashboard />
      </SidebarInset>
    </SidebarProvider>
  );
}
