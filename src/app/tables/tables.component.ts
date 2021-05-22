import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AgentService } from 'app/agent-service.service';

declare interface TableData {
    headerRow: string[];
    dataRows: string[][];
}

@Component({
    selector: 'app-tables',
    templateUrl: './tables.component.html',
    styleUrls: ['./tables.component.css']
})
export class TablesComponent implements OnInit {
    public tableData1: TableData;
    public tableData2: TableData;
    private FilterBy: [{
        key: string,
        value: string,
    }] = null;
    urs = '';
    public SearchAttr = null;
    public StatusList = null;
    public Clients = null;
    public itemsPerPage = null;
    public lastPage = null;
    public currentPage = null;
    public totalItems = null;
    public clientIndex: number = 0;
    public isFiltered = false;
    private queryParams = null;
    public screenPage: string = 'Clients';
    public Headers = ["Name", "Email", "Company",
        "Birth Date", "Gender",
        "PhoneNo", "Status"];

    constructor(private agentService: AgentService, private router: Router, private activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {

        this.activatedRoute.queryParams.subscribe(queryParams => {
            this.queryParams = queryParams;

            if (!this.isFiltered) {
                this.agentService.GetClients(this.queryParams)
                    .subscribe(response => {
                        if (document.getElementById('loadPrev'))
                            document.getElementById('loadPrev').style.display = "none";
                        console.warn('Response Search', response);
                        this.itemsPerPage = response['Clients']?.per_page;
                        this.currentPage = response['Clients']?.current_page;
                        this.lastPage = response['Clients']?.last_page;
                        this.totalItems = response['Clients']?.total;
                        this.Clients = response['Clients']?.data;
                        if ('page' in this.queryParams)
                            this.OptimizeIndex(+this.queryParams['page'], +this.itemsPerPage);
                        else
                            this.clientIndex = 0;
                    },
                        error => {
                            console.error('Error While getting Search', error.error);
                            if ('apiCode' in error.error) {
                                sessionStorage.setItem('isValid', '0');
                                if (error.error.apiCode === 2 || error.error.apiCode === 3 || error.error.apiCode === 5)
                                    this.router.navigate(['/login'], {
                                        state: {
                                            redirect: this.router.url
                                        }
                                    });
                            }
                        });
            }
        });
    }

    updateStatus(pClientID, pStatusID) {
        this.agentService.UpdateClientStatus(pClientID, pStatusID, this.queryParams).subscribe(
            response => {
                console.warn(response);
                this.Clients = response['Clients']?.data;
                this.currentPage = response['Clients']?.current_page > response['Clients']?.last_page ? response['Clients']?.last_page : response['Clients']?.current_page;
                if (this.queryParams['page']) {
                    if (this.currentPage < this.queryParams['page']) {
                        this.queryParams = { ...this.queryParams, page: this.currentPage + '' };
                        this.router.navigate(
                            ['/clients'],
                            {
                                queryParams: this.queryParams,
                                queryParamsHandling: 'merge'
                            }
                        );
                    }

                }
            },
            error => {
                console.error(error.error);
            }
        );
    }

    GetSearchAttributes(event) {

        if ('companyid' in event || 'statusid' in event) {
            event = { ...event, page: null };
            if (this.isAttributesChanged(this.SearchAttr, event)) {
                this.SearchAttr = event;
                return;
            }
            this.SearchAttr = event;

            console.log('event', event);
            document.getElementById('loadPrev').style.display = "";
            this.router.navigate(
                ['/clients'],
                {
                    queryParams: event,
                    queryParamsHandling: 'merge'
                }
            )
        }
        else if ('statuslist' in event) {
            this.StatusList = event['statuslist'];
        }
    }
    isAttributesChanged(SearchAttr: any, event: any): boolean {
        /*to avoid refresh if click on search button without:
         1) changing any attribute
         2) clicking on any attribute
         3) changing any attribute and refreshing the page */
        return ((JSON.stringify(SearchAttr) === JSON.stringify({ ...event, page: null }) ||
            (Object.values(event).every(row => row === null)) ||
            (!SearchAttr && this.router.url.indexOf('?') !== -1)));
    }

    hasQueryParam(url: string) {
        if (this.router.url.indexOf('?') === -1 || !this.router.url.split('?')[1])
            return false;
        return true;
    }

    addInput(f) {

        this.urs = this.urs ? this.urs + ',' + f : f;
        return this.urs;
    }

    NextPage(event) {
        document.getElementById('loadPrev').style.display = "";
        this.router.navigate(
            ['/clients'],
            {
                queryParams: { page: event },
                queryParamsHandling: 'merge'
            }
        );
    }
    OptimizeIndex(page: number, perPage: number) {
        let pageIndex = page - 1;
        if (pageIndex === 0)
            this.clientIndex = 0;
        else
            this.clientIndex = pageIndex * perPage;
    }
}



