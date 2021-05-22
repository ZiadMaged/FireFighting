import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AgentService } from 'app/agent-service.service';

@Component({
  selector: 'app-icons',
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.css']
})
export class IconsComponent implements OnInit {
  private answerID = '';
  public Values = null;
  public Answer = null;
  public StatusList = null;
  public params = null;
  public href = '';
  public questionID = '';
  public pReply = '';
  private months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
  constructor(private agentService: AgentService, private router: Router, private activatedRoute: ActivatedRoute) {
  }

  diff_hours(dt2, dt1) {

    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= (60 * 60);
    return Math.abs(Math.round(diff));

  }
  
  diff_days(dt2, dt1) {

    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= (60 * 60 * 24);
    return Math.abs(Math.round(diff));

  }
  
  diff_minutes(dt2, dt1) {

    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));

  }
  
  diff_weeks(dt2, dt1) {

    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= (60 * 60 * 24 * 7);
    return Math.abs(Math.round(diff));

  }
  
  diff_months(dt2, dt1) {

    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= (60 * 60 * 24 * 7 * 4);
    return Math.abs(Math.round(diff));

  }
  
  diff_years(dt2, dt1) {

    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= (60 * 60 * 24);
    return Math.abs(Math.round(diff / 365.25));

  }
  ngOnInit() {
    this.answerID = this.activatedRoute.snapshot.paramMap.get('answerID');
    this.questionID = this.activatedRoute.snapshot.paramMap.get('questionID');
    this.href = this.router.url;
    this.params = this.activatedRoute.snapshot.queryParams;
    if (this.answerID) {
      this.agentService.GetReplies(this.answerID).subscribe(
        response => {
          console.log('Answers', response);
          this.Values = response['Replies'];
          this.Answer = response['Answer'];
          this.StatusList = response['Status'];
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
        }
      );
    }
  }

  getReplyTime(pDate) {
    let time = this.diff_minutes(new Date(), new Date(pDate))
    if (time <= 60)
        return time + 'm';
    
    time = this.diff_hours(new Date(), new Date(pDate));
    if (time <= 24) 
       return time + ' h';  
    
    time = this.diff_days(new Date(), new Date(pDate));
    if (time <= 7)
      return time + 'd';
       
    time = this.diff_months(new Date(), new Date(pDate));
    console.log(pDate, new Date(pDate).getDate(), this.months[new Date(pDate).getMonth()] +" " + new Date(pDate).getDay() +", " +
    new Date(pDate).getFullYear());
    if (time <= 12) 
      return this.months[new Date(pDate).getMonth()] +" " + new Date(pDate).getDate();
    else 
    return this.months[new Date(pDate).getMonth()] +" " + new Date(pDate).getDate() +", " +
    new Date(pDate).getFullYear();  

  }

  getPicture(isAdmin) {
    return isAdmin ? 'assets/img/admin.png' : 'assets/img/user.png';
  }

  getPullCard(isAdmin) {
    return isAdmin ? 'pull-right' : 'pull-left';
  }

  getPullClock(isAdmin) {
    return isAdmin ? 'pull-left' : 'pull-right';
  }

  getFloatCard(isAdmin) {
    return isAdmin ? 'right' : 'left';
  }

  updateStatus(pStatusID) {
    this.agentService.UpdateAnswerStatus(this.questionID, this.answerID, pStatusID).subscribe(
      response => {
        console.log(response);
      },
      error => {
        console.error(error.error);
      }
    );
  }

  AddReply() {
    this.agentService.AddReply(this.answerID, this.pReply).subscribe(
      response => {
        console.log(response);
        this.Values = response['Replies'];
      },
      error => {
        console.error(error.error);
      }
    );
    this.pReply = '';
  }

}
