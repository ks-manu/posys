import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { LocalStorageService } from 'ng2-webstorage';

import { ApplicationSettingsService } from '../../services/settings.service';

import { PointOfSalePageComponent } from '../pointofsale/pointofsale';
import { PromotionsPageComponent } from '../promotions/promotions';
import { InventoryPageComponent } from '../inventory/inventory';
import { ReportingPageComponent } from '../reporting/reporting';
import { InvoicesPageComponent } from '../invoices/invoices';
import { SettingsPageComponent } from '../settings/settings';

@Component({
  selector: 'my-page-home',
  templateUrl: 'home.html'
})
export class HomePageComponent {

  constructor(public navCtrl: NavController, public settings: ApplicationSettingsService, public storage: LocalStorageService) {}

  isInvalidSetup() {
    return !this.settings.isValidConfiguration() || !this.storage.retrieve('terminalId');
  }

  goToInventory() {
    this.navCtrl.push(InventoryPageComponent);
  }

  goToReporting() {
    this.navCtrl.push(ReportingPageComponent);
  }

  goToInvoices() {
    this.navCtrl.push(InvoicesPageComponent);
  }

  goToPromotions() {
    this.navCtrl.push(PromotionsPageComponent);
  }

  goToSettings() {
    this.navCtrl.push(SettingsPageComponent);
  }

  goToPointOfSale() {
    this.navCtrl.push(PointOfSalePageComponent);
  }

}
