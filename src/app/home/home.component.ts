import { Component, OnInit } from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { LegendItem, ChartType } from '../lbd/lbd-chart/lbd-chart.component';
import * as Chartist from 'chartist';
import { AgentService } from 'app/agent-service.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private token = '';
  public errorMsg = '';
  private Lang = 'Ar';
  private isSuccess = false;
  public pwError = false;
  public emailError = false;
  constructor(private agentService: AgentService, private router: Router, private activatedRoute: ActivatedRoute) {
    if (sessionStorage.getItem('AgentToken') && sessionStorage.getItem('isValid') !== '0')
      this.router.navigate(['/clients']);
  }

  ngOnInit() {

  }

  Login(credentials) {
    if (!credentials.email && !credentials.password) {
      this.pwError = true;
      this.emailError = true;
    } 
    else if (!credentials.email)
      this.emailError = true;
    else if (!credentials.password)
      this.pwError = true;
    else {
      (document.getElementById('loginBtn') as HTMLInputElement).disabled = true;
      this.agentService.AgentLogin(credentials).subscribe(
        response => {
          console.log(response);
          console.log(response['AgentToken']['tokenType'] + ' ' + response['AgentToken']['accessToken']);
          this.token = response['AgentToken']['tokenType'] + ' ' + response['AgentToken']['accessToken'];
          sessionStorage.setItem('AgentToken', this.token);
          sessionStorage.setItem('isValid', '1');
          this.errorMsg = '';
          if (response['success'])
            this.router.navigateByUrl(window.history.state.redirect ?? '/clients');
        },
        error => {
          console.error(error.error);
          (document.getElementById('loginBtn') as HTMLInputElement).disabled = false;
          if (!error.error.success)
            this.errorMsg = this.Lang === "En" ? error.error.apiMsgEn : error.error.apiMsgAr;
        }
      );

    }
  }

}
