/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import Dashboard from "@/components/Dashboard/Dashboard";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { getDashboard } from "@/utils/api";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [notebooks, setNotebooks] = useState(null);

  // fetch dashboard and set user and notebooks
  useEffect(() => {
    // Redirect to login if user is not logged in
    if (localStorage.getItem("accessToken") === null)
      return router.push("/login");
    const fetchDashboard = async () => {
      const { data } = await getDashboard();
      setUser(data.data.user);
      setNotebooks(data.data.notebooks);
    };
    fetchDashboard();
  }, []);

  return (
    // SidebarProvider is a context provider for the sidebar
    <SidebarProvider>
      {/* AppSidebar is the sidebar in dashboard */}
      <AppSidebar user={user} />
      <SidebarInset>
        <div className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center justify-between gap-2 px-4 w-full">
            <div className="flex items-center justify-between">
              {/* Side bar trigger */}
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <h4>Take Your notes safe</h4>
            </div>
            {/* Link to create new sketch */}
            <Link href={"/dashboard/create/sketch"}>
              <Button>
                <Plus />
                New Sketch
              </Button>
            </Link>
          </div>
        </div>
        {/* Dashboard is the main content */}
        <Dashboard notebooks={notebooks} />
      </SidebarInset>
    </SidebarProvider>
  );
}

export default Page;
