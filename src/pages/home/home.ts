import { Component } from '@angular/core';
import {IonicPage, LoadingController, ModalController, NavController, NavParams, Platform} from 'ionic-angular';
import {ApiProvider} from "../../providers/api-provider";
import {DetailPage} from "../detail-page/detail-page";
import {Storage} from '@ionic/storage';
import {DomSanitizer} from "@angular/platform-browser";
import * as moment from "moment";


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
	providers: [ApiProvider]
})
export class HomePage {
	public events:any = null;
	public shouldReorder:boolean = false;

	constructor(public navCtrl: NavController,
				public navparams: NavParams,
				public service: ApiProvider,
				public modalCtrl: ModalController,
                private storage: Storage,
				public platform: Platform,
				// private moment: Moment,
				public loadingCtrl: LoadingController,
                public domSanitizer: DomSanitizer) {

        this.platform.ready().then(() => {
            let loading = this.loadingCtrl.create({
                content: 'Please wait...'
            });


            loading.present();

            console.log("home ts");
            this.getEvents();

            loading.dismiss();

        });

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
                    }
                );

			if(this.events===null) {
                this.storage.get('events').then((data) => {
                    console.log("Getting Data");
                        this.events = data;
                });
            }

            if (this.events) {
                console.log("Yes Events")
                console.dir(this.events)
            }

        } catch (e){
			console.error("Something went wrong with event data. Error was", e);
		}
	}

	doInfinite(e) {
		this.service.getEvents()
            .subscribe(
				data => this.events.push(...data),
				err => console.log(err),
				() => e.complete()
			)
	}

	doRefresh(e) {
		this.service.getEvents()
            .subscribe(
				data => this.events.unshift(...data),
				err => console.log(err),
				() => e.complete()
			)
	}

	toggleReorder() {
		this.shouldReorder = !this.shouldReorder
	}

	pushPage(user) {
		// this.modalCtrl.create(DetailPage, user).present()
		//this.navCtrl.push(DetailPage, user)
		// this.navCtrl.setPages([
		//   {page: HomePage},
		//   {page: DetailPage, params: this.events[5]},
		//   {page: HomePage},
		//   {page: DetailPage, params: user}
		// ])
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

	openDetailPage(path) {
		this.navCtrl.push(DetailPage,{event:path});
	}

}
