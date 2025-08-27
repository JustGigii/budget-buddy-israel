import { 
  Home, 
  Receipt, 
  Wallet,
  Settings,
  User
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useStore } from "@/store/useStore";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "דף הבית", url: "/", icon: Home },
  { title: "התחשבנות", url: "/balance", icon: Wallet },
  { title: "הוצאות", url: "/expenses", icon: Receipt },
  { title: "הגדרות", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";
  const { users, trip } = useStore();

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary/10 text-primary font-medium border-r-2 border-primary" : "hover:bg-muted/50";

  return (
    <Sidebar
      className={collapsed ? "w-14" : "w-64"}
      collapsible="icon"
    >
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-3 px-3 py-2">
          <span className="text-2xl">🇯🇵</span>
          {!collapsed && (
            <div>
              <h2 className="font-semibold text-foreground">יפן 2025</h2>
              <p className="text-xs text-muted-foreground">מעקב הוצאות</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>תפריט</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!collapsed && (
          <SidebarGroup>
            <SidebarGroupLabel>סטטוס תקציב</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="space-y-3 px-2">
                {/* עמרי */}
                <div className="bg-card/50 rounded-lg p-3 border">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">עמרי</span>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">שילם</div>
                    <div className="text-sm font-bold text-primary">
                      ₪{users[0]?.totalPaid?.toLocaleString() || '0'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {users[0]?.netBalance > 0 ? 'זוכה' : users[0]?.netBalance < 0 ? 'חייב' : 'מאוזן'}
                    </div>
                  </div>
                </div>

                {/* נועה */}
                <div className="bg-card/50 rounded-lg p-3 border">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-secondary" />
                    <span className="text-sm font-medium">נועה</span>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">שילמה</div>
                    <div className="text-sm font-bold text-secondary">
                      ₪{users[1]?.totalPaid?.toLocaleString() || '0'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {users[1]?.netBalance > 0 ? 'זוכה' : users[1]?.netBalance < 0 ? 'חייבת' : 'מאוזנת'}
                    </div>
                  </div>
                </div>

                {/* סה״כ תקציב */}
                <div className="bg-muted/30 rounded-lg p-3 border">
                  <div className="text-xs text-muted-foreground mb-1">נשאר בתקציב</div>
                  <div className={`text-sm font-bold ${trip.remainingBudget > 0 ? 'text-success' : 'text-warning'}`}>
                    ₪{trip.remainingBudget?.toLocaleString() || '0'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    מתוך ₪{trip.budget?.toLocaleString() || '0'}
                  </div>
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}