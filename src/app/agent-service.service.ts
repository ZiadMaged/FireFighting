import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

const BASE_URL: string = 'http://127.0.0.1:8000/api/agent';
const httpHeader = new HttpHeaders({
  Authorization: sessionStorage.getItem('AgentToken') ?? ''
});

@Injectable({
  providedIn: 'root'
})
export class AgentService {

  constructor(private http: HttpClient) {
  }

  GetClients(filterBy) {
    return this.http.get(`${BASE_URL}/clients`, {
      params: new HttpParams({
        fromObject: filterBy
      }),
      headers: new HttpHeaders({
        Authorization: sessionStorage.getItem('AgentToken') ?? ''
      })
    });
  }

  GetClientSearchAttributes() {
    return this.http.get(`${BASE_URL}/clients/attributes`, {
      headers: new HttpHeaders({
        Authorization: sessionStorage.getItem('AgentToken') ?? ''
      })
    });
  }

  GetAnswerSearchAttributes() {
    return this.http.get(`${BASE_URL}/answers/attributes`, {
      headers: new HttpHeaders({
        Authorization: sessionStorage.getItem('AgentToken') ?? ''
      })
    });
  }
  

  GetQuestionSearchAttributes() {

    return this.http.get(`${BASE_URL}/questions/attributes`, {
      params: new HttpParams({
        fromObject: {
          'Lang': 'En'
        }
      }),
      headers: new HttpHeaders({
        Authorization: sessionStorage.getItem('AgentToken') ?? ''
      })
    });
  }

  UpdateClientStatus(pClientID, pStatusID, filterBy) {
    return this.http.put(`${BASE_URL}/clients/${pClientID}`, {
      'StatusId': pStatusID
    }, {
      params: filterBy,
      headers: new HttpHeaders({
        Authorization: sessionStorage.getItem('AgentToken') ?? ''
      })
    });//.subscribe(res => console.log('Updated Client Status',res));
  }

  UpdateQuestionStatus(pQuestionID, pStatusID, filterBy) {
    filterBy = { ...filterBy, Lang: 'En' };
    return this.http.put(`${BASE_URL}/questions/${pQuestionID}`, {
      'StatusId': pStatusID
    }, {
      params: new HttpParams({
        fromObject: filterBy
      }),
      headers: new HttpHeaders({
        Authorization: sessionStorage.getItem('AgentToken') ?? ''
      })
    });//.subscribe(res => console.log('Updated Question Status',res));
  }

  UpdateAnswerStatus(pQuestionID, pAnswerID, pStatusID) {
    return this.http.put(`${BASE_URL}/answers/${pAnswerID}`, {
      'StatusId': pStatusID
    }, {
      params: {
        Lang: 'En',
        QuestionId: pQuestionID
      },
      headers: new HttpHeaders({
        Authorization: sessionStorage.getItem('AgentToken') ?? ''
      })
    });//.subscribe(res => console.log('Updated Question Status',res));
  }

  GetQuestions(filterBy)
   {
    filterBy = { ...filterBy, Lang: 'En' };

    return this.http.get(`${BASE_URL}/questions`, {
      params: new HttpParams({
        fromObject: filterBy
      }),
      headers: new HttpHeaders({
        Authorization: sessionStorage.getItem('AgentToken') ?? ''
      })
    }).toPromise();

  }

  GetAnswers(pQuestionID,filterBy) {

    filterBy = { ...filterBy, QuestionId: pQuestionID };

    return this.http.get(`${BASE_URL}/questions/answers`, {
      params: new HttpParams({
        fromObject: filterBy
      }),
      headers: new HttpHeaders({
        Authorization: sessionStorage.getItem('AgentToken') ?? ''
      })
    }).toPromise();

  }

  GetReplies(pAnswerID) 
  {
    return this.http.get(`${BASE_URL}/answers/${pAnswerID}/replies`, {
      headers: new HttpHeaders({
        Authorization: sessionStorage.getItem('AgentToken') ?? ''
      })
    });
  }

  AddReply(pAnswerID, pReply) {
    return this.http.post(`${BASE_URL}/answers/${pAnswerID}/replies`,{
      'Reply' : pReply
    }, {
      headers: new HttpHeaders({
        Authorization: sessionStorage.getItem('AgentToken') ?? ''
      })
    });

  }

  AgentLogin(pCredentials) {
    return this.http.get(`${BASE_URL}/login`, {
      params: new HttpParams({
        fromObject: pCredentials
      })
    });
  }
}
