import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';

import { SidebarMenu } from '../models/sidebar/sidebar-menu';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class SidebarService {

    private sidebarUrl: string;
    private headers: Headers;

    constructor(private http: Http) {

        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');
        this.sidebarUrl = 'http://localhost/CloudFactoryStore/AppPortal/services/sidebar-data/';
    }

    getSidebarMenu(id: number): Observable<SidebarMenu> {
        console.log("getting sidebar: " + id);

        return this.http.get(this.sidebarUrl + "sidebar" + id + ".json")
            .map((response: Response) => <SidebarMenu>response.json());
        //    .do(data => console.log('All: ' + JSON.stringify(data)));
    }


    private handleError(error: Response) {
        //   debugger;
        console.error('error in sidebar service: ' + error);
        return Observable.throw(error.json().error || 'Server error');
    }
}