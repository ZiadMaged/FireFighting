import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AgentService } from 'app/agent-service.service';

@Component({
  selector: 'app-typography',
  templateUrl: './typography.component.html',
  styleUrls: ['./typography.component.css']
})
export class TypographyComponent implements OnInit {
  public Headers = ['Client', 'Category', 'Question', 'Status'];
  private queryParams = null;
  public Values = null;
  public StatusList = null;
  private href = '';
  private params = null;
  public itemsPerPage = null;
  public lastPage = null;
  public currentPage = null;
  public totalItems = null;
  public clientIndex: number = 0;
  public screenPage: string = 'Questions';
  private isClicked = false;
  public SearchAttr = null;

  constructor(private agentService: AgentService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.href = this.router.url;
    this.activatedRoute.queryParams.subscribe(queryParams => {
      //this.Values = null;
      this.href = this.router.url.split('?')[0] ?? this.router.url;
      this.params = this.activatedRoute.snapshot.queryParams;
      this.queryParams = queryParams;
      
      this.agentService.GetQuestions(this.queryParams).then(response => {
        console.warn('Response Search', response);
        if (document.getElementById('loadPrev'))
          document.getElementById('loadPrev').style.display = "none";
        this.Values = response['Questions']?.data;
        this.itemsPerPage = response['Questions']?.per_page;
        this.currentPage = response['Questions']?.current_page > response['Questions']?.last_page ? response['Questions']?.last_page : response['Questions']?.current_page;
        this.lastPage = response['Questions']?.last_page;
        this.totalItems = response['Questions']?.total;
        
        if ('page' in this.queryParams)
          this.OptimizeClienIndex(+this.queryParams['page'], +this.itemsPerPage);
        else
          this.clientIndex = 0;
      
      }).catch(
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
    });

  }
  updateStatus(pQuestionID, pStatusID) {
      console.log(this.isClicked);
    if(!this.isClicked)
    {
      this.isClicked = true;
    this.agentService.UpdateQuestionStatus(pQuestionID, pStatusID, this.queryParams).subscribe(
      response => {
        console.log(response);
        this.Values = response['Questions']?.data;
        this.currentPage = response['Questions']?.current_page > response['Questions']?.last_page ? response['Questions']?.last_page : response['Questions']?.current_page;
        if (this.queryParams['page']) {
          if (this.currentPage < this.queryParams['page']) {
            this.queryParams = { ...this.queryParams, page: this.currentPage + '' };
            this.router.navigate(
              ['/questions'],
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
    this.isClicked = false;
    }
  }
  getURL() {
    console.log('GetURL', this.router.url);
  }

  GetSearchAttributes(event) {
    if ('categoryid' in event || 'statusid' in event) {
      event = { ...event, page: null };
      if (this.isAttributesChanged(this.SearchAttr, event)) {
          this.SearchAttr = event;
          return;
      }
      this.SearchAttr = event;
      document.getElementById('loadPrev').style.display = "";

      this.router.navigate(
        ['/questions'],
        {
          queryParams: event,
          queryParamsHandling: 'merge'
        }
      );
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
             ( !SearchAttr && this.router.url.indexOf('?') !== -1))) ;
}

  NextPage(event) {
    this.router.navigate(
      ['/questions'],
      {
        queryParams: { page: event },
        queryParamsHandling: 'merge'
      }
    );
  }

  OptimizeClienIndex(page: number, perPage: number) {
    let pageIndex = page - 1;
    if (pageIndex === 0)
      this.clientIndex = 0;
    else
      this.clientIndex = pageIndex * perPage;
  }


}
