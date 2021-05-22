import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AgentService } from 'app/agent-service.service';

@Component({
  selector: 'question-search-attributes',
  templateUrl: './question-search-attributes.component.html',
  styleUrls: ['./question-search-attributes.component.css']
})
export class QuestionSearchAttributesComponent implements OnInit {

  public Filters = null;
  public fromDateError = false;
  public toDateError = false;
  public fromDate ='';
  public toDate ='';
  public queryParams = {};
  @Output() change = new EventEmitter();
  @Input() screenPage: string;

  constructor(private agentService: AgentService, private router: Router, private activatedRoute: ActivatedRoute) {
    
    this.queryParams = activatedRoute.snapshot.queryParams;
    this.fromDate = activatedRoute.snapshot.queryParams['from'];
    this.toDate = activatedRoute.snapshot.queryParams['to'];
    
    
  }
  
  ngOnInit(): void {
    this.GetFilters(this.screenPage);
  }

  GetFilters(fromScreen: string)
  {
    let filterService= null;
    switch (fromScreen)
    {
      case 'Questions':
        filterService = this.agentService.GetQuestionSearchAttributes();  
        break;
      case 'Answers':
       filterService = this.agentService.GetAnswerSearchAttributes();
        break;
      case 'Clients':
        filterService = this.agentService.GetClientSearchAttributes();
        break;    
    }

    filterService?.subscribe(response => {
      console.warn('Response Search', response);
      this.Filters = response;
      this.change.emit({ statuslist: response['Status'] });
    },
      error => {
        console.error('Error While getting Search', error);
      });

    }

  AddQueryParam(event, key, value) 
  {
    value = value + '';
    let queryKey = key.toLowerCase() + 'id';
    let queryParam = '';
    queryParam = this.queryParams[queryKey] ?? null;
    console.log('before',this.queryParams, queryParam);
    if (event.target.checked)
      queryParam = queryParam ? queryParam + ',' + value : value;
    else 
    {
      let removepart = ',' + value;
      if (queryParam.indexOf(value) === 0)       
        removepart = queryParam.length > value.length ? value + ',' : value;

      queryParam = queryParam.replace(removepart, '');
    }
    this.queryParams = { ...this.queryParams, [queryKey]: queryParam };
    console.log('after',this.queryParams, queryParam);
    return this.queryParams[queryKey];
  }

  isChecked(companyName, queryBy: string) 
  {
    if (this.queryParams[queryBy.toLowerCase()])
    {
      for (let x of this.queryParams[queryBy.toLowerCase()]?.split(',')) 
      {
        if (x == companyName)
          return true;
      }
    }
    return false;
  }

  submit() 
  {
    console.log('Search submit');
    if (this.fromDate && !this.toDate)
      this.toDateError = true;
    else if (!this.fromDate && this.toDate)
      this.fromDateError = true;
    else 
    {
      this.change.emit({
        categoryid: this.queryParams['categoryid'] ? this.queryParams['categoryid'] : null,
        companyid: this.queryParams['companyid'] ? this.queryParams['companyid'] : null,
        statusid: this.queryParams['statusid'] ? this.queryParams['statusid'] : null,
        from: this.fromDate ? this.fromDate : null,
        to: this.toDate ? this.toDate : null
      });
    }
  }

}
