import { NgModule } from '@angular/core';

import { SharedModule } from '@shared';
import { ProRoutingModule } from './pro-routing.module';

import { AccountSettingsBaseComponent } from './account/settings/base/base.component';
import { AccountSettingsBindingComponent } from './account/settings/binding/binding.component';
import { AccountSettingsNotificationComponent } from './account/settings/notification/notification.component';
import { AccountSettingsSecurityComponent } from './account/settings/security/security.component';
import { AccountSettingsComponent } from './account/settings/settings.component';
import { DonationListComponent } from './list/donation-list/donation-list.component';
import { SupporterListComponent } from './list/supporter-list/supporter-list.component';

const COMPONENTS = [
  AccountSettingsBaseComponent,
  AccountSettingsBindingComponent,
  AccountSettingsNotificationComponent,
  AccountSettingsSecurityComponent,
  AccountSettingsComponent,
  DonationListComponent,
  SupporterListComponent
];

const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [SharedModule, ProRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT,
})
export class ProModule {}
