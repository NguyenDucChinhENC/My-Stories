import { Subject, Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { IStory, IStep } from '../shared/story.model';
import { Http, Response, RequestOptions } from '@angular/http';
import { URL } from '../../app.routes';

@Injectable()
export class FollowService {
  private apiURL;
  constructor(private http: Http) {
    this.apiURL = URL + 'api/stories/';
  }

  createFollow(id: number, token: string): Observable<any> {
    const link = this.apiURL + id + '/relationship_stories';
    const headers: any = {'MS-AUTH-TOKEN': token };
    const options = new RequestOptions({headers: headers});
    return this.http.post(link, id, options).map(response => response.json());
  }

  destroyFollow(relastionship_id:number, id: number, token: string): Observable<any> {
    const link = this.apiURL + id + '/relationship_stories/' +  relastionship_id;
    const headers: any = {'MS-AUTH-TOKEN': token };
    const options = new RequestOptions({headers: headers});
    return this.http.delete(link, options).map(response => response.json());
  }
}
