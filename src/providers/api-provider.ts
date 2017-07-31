import { Injectable } from '@angular/core';
import {Http, RequestOptions, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import * as moment from "moment";


@Injectable()
export class ApiProvider {
  private apiHeaders: Headers = new Headers;
  private opts;
  private apiUrl = 'https://woodlandscenter.7.dev.bubbleup.com/api/v1/';
  // private apiUrl = 'https://www.woodlandscenter.org/api/v1/';
  constructor(public http: Http) {

    // TODO get the headers working.
    // this.apiHeaders.set('Content-type', 'application/json')

    this.opts = new RequestOptions({
      headers: this.apiHeaders
    })
  }

  getEvents() {
  	// debugger;
    return this.http.get(this.apiUrl + 'events',this.opts)
    .map(res => res.json())
  }

  getEventById($id) {

    return this.http.get(this.apiUrl + 'events/' + $id + '&_format=json')
        .map(res => res.json())
  }

  getPage(path=null){
    return this.http.get(this.apiUrl+'pages?path='+path).map(res => res.json());
  }

  formatDate(event) {

    try {
        return moment(event.at).format('dddd MMMM Do');
    } catch (e){
      console.error(event.page.title + " does not have a date");
    }
  }

  formatTime(event) {
      var date = new Date(event.at + ' UTC');
      try {
          return moment.utc(event.at).format('h:mm a');
      } catch (e) {
          console.error(event.page.title + " does not have a date");
      }
  }
}
