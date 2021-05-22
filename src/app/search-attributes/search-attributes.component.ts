import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AgentService } from 'app/agent-service.service';
import { Console } from 'console';

@Component({
  selector: 'search-attributes',
  templateUrl: './search-attributes.component.html',
  styleUrls: ['./search-attributes.component.css']
})
export class SearchAttributesComponent implements OnInit {

  public Companies = null;
  public Status = null;
  private companyParam = '';
  private statusParam = '';
  private queryparam = '';
  public bo = false;
  @Output() change = new EventEmitter();
  constructor(private agentService: AgentService, private router: Router, private activatedRoute: ActivatedRoute) {
    console.warn('Search', this.router);
    agentService.GetClientSearchAttributes().subscribe(response => {
      console.warn('Response Search', response);
      this.Companies = response['Companies'];
      this.Status = response['Status'];
      this.change.emit({statuslist : this.Status});
    },
      error => {
        console.error('Error While getting Search', error);
      });

      this.companyParam = activatedRoute.snapshot.queryParams['companyid'];
      this.statusParam = activatedRoute.snapshot.queryParams['statusid'];
      console.warn('companyParam',this.companyParam);
      console.warn('statusParam',this.statusParam);
      
    }

  ngOnInit(): void {
    console.warn('Search init');
  }

  AddCompanyParam(event, f) {
    f= f+'';
    if (event.target.checked)
      this.companyParam = this.companyParam ? this.companyParam + ',' + f : f;
    else {
      let removepart = ',' + f;
      if (this.companyParam.indexOf(f) === 0) {
        removepart = this.companyParam.length > f.length ? f + ',' : f;
      }
      this.companyParam = this.companyParam.replace(removepart, '');
    }
    console.log(this.companyParam);
    return this.companyParam;
  }

  AddStatusParam(event, f) {
    f= f+'';
    if (event.target.checked)
      this.statusParam = this.statusParam ? this.statusParam + ',' + f : f;
    else {
      let removepart = ',' + f;
      if (this.statusParam.indexOf(f) === 0) {
        removepart = this.statusParam.length > f.length ? f + ',' : f;
      }
      this.statusParam = this.statusParam.replace(removepart, '');
    }
    console.log(this.statusParam);
    return this.statusParam;
  }

  AddFilters() {
    console.log('AddFilters');
    this.change.emit({
      companyid: this.companyParam ? this.companyParam : null,
      statusid: this.statusParam ? this.statusParam : null
    });
  }

  isChecked(companyName, queryBy: string) {
    
    let str = '';
    switch(queryBy.toLowerCase())
    {
      case 'companyid':
        str = this.companyParam + '';
        break;
      case 'statusid':
        str = this.statusParam + '';  
        break;
    }
    
    if (str) {
      for (let x of str.split(',')) {
        if (x == companyName)
          return true;
      }
    }
    return false;
  }
}
