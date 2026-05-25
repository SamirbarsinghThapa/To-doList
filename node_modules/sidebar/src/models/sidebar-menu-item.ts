
export class SidebarMenuItem {
    title: string;
    routerLink: string[];
    externalLink: string;
    iconName: string;
    children: SidebarMenuItem[];

    constructor(title: string, routerLink: string[], externalLink: string, iconName: string) {
        this.title = title;
        this.routerLink = routerLink;
        this.externalLink = externalLink;
        this.iconName = iconName;
    }
}