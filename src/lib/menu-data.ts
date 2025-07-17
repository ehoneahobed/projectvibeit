import { Home, Settings, ShoppingCart, List, Plus, BookOpen, GraduationCap } from "lucide-react";

export const menuItems = [
    {
        label: "Dashboard",
        href: "/portal",
        icon: Home,
    },
    {
        label: "Learning",
        icon: BookOpen,
        subMenu: [
            {
                label: "All Courses",
                href: "/courses",
                icon: List,
            },
            {
                label: "My Progress",
                href: "/portal/progress",
                icon: GraduationCap,
            },
        ]
    },
    {
        label: "Products",
        icon: ShoppingCart,
        subMenu: [
            {
                label: "All Products",
                href: "/portal/products",
                icon: List,
            },
            {
                label: "Add Product",
                href: "/portal/products/add",
                icon: Plus,
            },
        ]
    },
    {
        label: "Settings",
        href: "/portal/settings",
        icon: Settings,
    },
]; 