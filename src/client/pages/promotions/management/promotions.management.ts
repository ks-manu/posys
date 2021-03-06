import * as _ from 'lodash';

import { Component, OnInit } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

import { Promotion } from '../../../models/promotion';
import { PromoItem } from '../../../models/promoitem';
import { OrganizationalUnit } from '../../../models/organizationalunit';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

import { PromotionService } from '../../../services/promotion.service';
import { OrganizationalUnitService } from '../../../services/organizationalunit.service';
import { ApplicationSettingsService } from '../../../services/settings.service';

@Component({
  templateUrl: 'promotions.management.html'
})
export class PromotionsManagerComponent implements OnInit {
  public promotion: Promotion;
  public allOU: Observable<OrganizationalUnit[]>;
  public today: string;
  public futureToday: string;

  public discountItems: string;

  public _formErrors: BehaviorSubject<any> = new BehaviorSubject({});
  public formErrors: Observable<any> = this._formErrors.asObservable();

  constructor(public viewCtrl: ViewController,
              public params: NavParams,
              public prService: PromotionService,
              public ouService: OrganizationalUnitService,
              public settings: ApplicationSettingsService) {

    this.promotion = params.get('promotion');
    this.allOU = this.ouService.getAll();
  }

  ngOnInit() {
    const today = new Date();
    this.today = this.settings.toIonicDateString(today);
    today.setFullYear(today.getFullYear() + 100);
    this.futureToday = this.settings.toIonicDateString(today);

    const dateString = this.settings.toIonicDateString(new Date());
    if(!this.promotion.startDate) { this.promotion.startDate = dateString; }
    if(!this.promotion.endDate)   { this.promotion.endDate = dateString; }
  }

  handleSingleSearchResult(result: any) {
    this.handleSearchResults({ items: [result] });
  }

  handleSearchResults(result: any) {
    if(result.items.length !== 1) { return; }

    if(!this.promotion.promoItems) { this.promotion.promoItems = []; }

    const stockitem = _.cloneDeep(result.items[0]);

    const newPromoItem = new PromoItem(stockitem);

    if(_.find(this.promotion.promoItems, { sku: newPromoItem.sku })) { return; }
    delete newPromoItem.id;
    newPromoItem.stockitemId = stockitem.id;

    this.promotion.promoItems.push(newPromoItem);

    setTimeout(() => {
      const transactionList = document.getElementById('promoitems-list');
      transactionList.scrollTop = transactionList.scrollHeight;
    });
  }

  changeReductionType() {
    if(this.promotion.itemReductionType === 'SetTo') {
      this.promotion.discountType = 'Dollar';
    }
  }

  changeDiscount() {
    if(this.promotion.discountValue > 100 && this.promotion.discountType === 'Percent') {
      this.promotion.discountValue = 100;
    }
  }

  changeGrouping() {
    if(this.promotion.discountGrouping === 'SKU') {
      delete this.promotion.organizationalunitId;
    } else {
      delete this.promotion.promoItems;
    }
  }

  dismiss(item?: Promotion) {
    this.viewCtrl.dismiss(item);
  }

  create() {
    if(this.promotion.temporary) {
      return this.dismiss(this.promotion);
    }

    this.prService
      .create(this.promotion)
      .subscribe(item => {
        this._formErrors.next({});
        this.dismiss(item);
      }, e => this._formErrors.next(e.formErrors));
  }

  update() {
    this.prService
      .update(this.promotion)
      .subscribe(() => {
        this._formErrors.next({});
        this.dismiss(this.promotion);
      }, e => this._formErrors.next(e.formErrors));
  }

  removePromoItem(item: PromoItem) {
    this.promotion.promoItems = _.reject(this.promotion.promoItems, checkItem => checkItem === item);
  }

}
