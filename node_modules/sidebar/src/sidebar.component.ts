import { Component, OnInit } from '@angular/core';

import { SidebarService } from '../../services/sidebar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarMenu } from '../../models/sidebar/sidebar-menu';

@Component({
    selector: 'sidebar',
    templateUrl: 'AppPortal/components/sidebar/sidebar.component.html',
    providers: [SidebarService],
    styleUrls: ['AppPortal/components/sidebar/sidebar.css']
})


export class SidebarComponent implements OnInit {

    errorMessage: string;
    model: SidebarMenu;
    //structure: string;    
    sub: any;

    constructor(
        private sidebarService: SidebarService,
        private router: Router,
        private route: ActivatedRoute
        ) {        
    }

    ngOnInit() {
        if (!this.model) {
            this.loadSidebar();
        }
    }

    loadSidebar() {
        this.sub = this.route.params.subscribe(params => {
            let id = 1;
            this.getSidebarMenu(Number(id));
        });
    }
        
    getSidebarMenu(id: number) {
        this.sidebarService.getSidebarMenu(id)
            .subscribe(
            model => {
                this.model = model[0];
            },
            error => this.errorMessage = <any>error);
    }
}
