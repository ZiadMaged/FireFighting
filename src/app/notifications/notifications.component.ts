import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AgentService } from 'app/agent-service.service';

declare var $: any;

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  private questionID = '';
  private queryParams = null;
  public Values = null;
  public StatusList = null;
  public Question = null;
  public href = '';
  public itemsPerPage = null;
  public lastPage = null;
  public currentPage = null;
  public totalItems = null;
  public answerIndex: number = 0;
  public screenPage = 'Answers';
  public SearchAttr = null;

  constructor(private activatedRoute: ActivatedRoute, private agentService: AgentService, private router: Router) {
    this.href = router.url;
    console.log(this.href);
  }

  ngOnInit() {
    this.questionID = this.activatedRoute.snapshot.paramMap.get('questionID');
    if (this.questionID)
    {
      this.activatedRoute.queryParams.subscribe(queryParams => {
        this.Values = null;
        this.href = this.router.url.split('?')[0] ?? this.router.url;
        this.queryParams = queryParams;
        this.agentService.GetAnswers(this.questionID,this.queryParams).then(response => {
          console.warn('Response Search', response);
          if (document.getElementById('loadPrev'))
            document.getElementById('loadPrev').style.display = "";

          this.Values = response['Answers']?.data;
          this.Question = response['Question'];
          this.itemsPerPage = response['Answers']?.per_page;
          this.currentPage = response['Answers']?.current_page > response['Answers']?.last_page ? 
                            response['Answers']?.last_page : response['Answers']?.current_page;
          this.lastPage = response['Answers']?.last_page;
          this.totalItems = response['Answers']?.total;
          
          if ('page' in this.queryParams)
            this.OptimizeClienIndex(+this.queryParams['page'], +this.itemsPerPage);  
          
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
    // {
    //   this.agentService.GetAnswers(this.questionID).subscribe(
    //     response => {
    //       console.log('Answers', response);
    //       this.Values = response['Answers'];
    //       this.Question = response['Question'];
    //         // this.itemsPerPage = response['Clients']?.per_page;
    //         //       this.currentPage = response['Clients']?.current_page;
    //         //       this.lastPage = response['Clients']?.last_page;
    //         //       this.totalItems = response['Clients']?.total;
    //         //       this.Clients = response['Clients']?.data;                
    //         //       if('page' in this.queryParams)
    //         //           this.OptimizeClienIndex(+this.queryParams['page'] , +this.itemsPerPage);
    //     },
    //     error => {
    //       console.error('Errorr', error.error);
    //     }
    //   );
    // }
  }
  showNotification(from, align) {
    const type = ['', 'info', 'success', 'warning', 'danger'];

    var color = Math.floor((Math.random() * 4) + 1);
    $.notify({
      icon: "pe-7s-gift",
      message: "Welcome to <b>Light Bootstrap Dashboard</b> - a beautiful freebie for every web developer."
    }, {
      type: type[color],
      timer: 1000,
      placement: {
        from: from,
        align: align
      }
    });
  }

  GetSearchAttributes(event) {
    if ('categoryid' in event || 'statusid' in event) {
      if (this.isAttributesChanged(this.SearchAttr, event)) {
        this.SearchAttr = event;
        return;
    }
    this.SearchAttr = event;
    document.getElementById('loadPrev').style.display = "";
  
    this.router.navigate(
        [this.href],
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


  updateStatus(pQuestionID, pAnswerID, pStatusID) {
    this.agentService.UpdateAnswerStatus(pQuestionID ,pAnswerID, pStatusID).subscribe(
      response => {
        console.log(response);
        this.Values = response['Answers']?.data;
      },
      error => {
        console.error(error.error);
      }
    );
  }

  OptimizeClienIndex(page: number, perPage: number) {
    let pageIndex = page - 1;
    if (pageIndex === 0)
      this.answerIndex = 0;
    else
      this.answerIndex = pageIndex * perPage;
  }

  NextPage(event) {
    this.router.navigate(
      [this.href],
      {
        queryParams: { page: event },
        queryParamsHandling: 'merge'
      }
    );
  }

}
