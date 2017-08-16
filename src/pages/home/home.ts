import { Component } from '@angular/core';
import {IonicPage, Loading, LoadingController, ModalController, NavController, NavParams} from 'ionic-angular';
import {ApiProvider} from "../../providers/api-provider";
import {DetailPage} from "../detail-page/detail-page";
import {Storage} from '@ionic/storage';
import {DomSanitizer} from "@angular/platform-browser";
import * as moment from "moment";
import {FirebaseAnalytics} from "@ionic-native/firebase-analytics";

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [ApiProvider]
})
export class HomePage {
  public events:any = null;
  public loading:any;

  constructor(public navCtrl: NavController,
              public navparams: NavParams,
              public service: ApiProvider,
              public modalCtrl: ModalController,
              private storage: Storage,
              public loadingCtrl: LoadingController,
              private firebaseAnalytics: FirebaseAnalytics,
              public domSanitizer: DomSanitizer) {

    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
    this.getEvents();
    this.service.storeAllData();
  }

  getEvents(){
    try {
      this.service.getEvents()
        .subscribe(
          data => {
            this.events = data;
            this.storage.set('events', data).then(
              () => console.log("Stored Data"),
              error => console.error('Failed to store Data')
            );
            if(this.loading){
              this.loading.dismiss();
              this.loading = null;
            }
          }
        );

      if(this.events===null) {
        this.storage.get('events').then((data) => {
          console.log("Getting Data");
          this.events = data;
          if(this.loading){
            this.loading.dismiss();
            this.loading = null;
          }
        }).catch(error=>{
          alert("No Network");
          if(this.loading){
            this.loading.dismiss();
            this.loading = null;
          }
        });
      }

    } catch (e){
      console.error("Something went wrong with event data. Error was", e);
    }
  }
  doRefresh(refresher) {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    // this.loading.present();
    this.getEvents();

    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

  formatDate(event) {

    try {
      return moment(event.at).format('dddd MMMM Do');
    } catch (e) {
      console.error(event.page.title + " does not have a date");
    }

  }

  openUrl(path) {
    window.open(path, '_system');
  }

  openDetailPage(data) {
    this.firebaseAnalytics.logEvent('page_view',data.page.title);
    this.navCtrl.push(DetailPage,{event:data});
  }

}
