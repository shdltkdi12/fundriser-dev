import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccountSettingsBaseComponent } from './account/settings/base/base.component';
import { AccountSettingsBindingComponent } from './account/settings/binding/binding.component';
import { AccountSettingsNotificationComponent } from './account/settings/notification/notification.component';
import { AccountSettingsSecurityComponent } from './account/settings/security/security.component';
import { AccountSettingsComponent } from './account/settings/settings.component';
import { DonationListComponent } from './list/donation-list/donation-list.component';
import { SupporterListComponent } from './list/supporter-list/supporter-list.component';

const routes: Routes = [
  {
    path: 'list',
    children: [
      { path: 'donations', component: DonationListComponent },
      { path: 'supporters', component: SupporterListComponent },
    ],
  },
  {
    path: 'account',
    children: [
      {
        path: 'settings',
        component: AccountSettingsComponent,
        children: [
          { path: '', redirectTo: 'base', pathMatch: 'full' },
          {
            path: 'base',
            component: AccountSettingsBaseComponent,
            data: { titleI18n: 'pro-account-settings' },
          },
          {
            path: 'security',
            component: AccountSettingsSecurityComponent,
            data: { titleI18n: 'pro-account-settings' },
          },
          {
            path: 'binding',
            component: AccountSettingsBindingComponent,
            data: { titleI18n: 'pro-account-settings' },
          },
          {
            path: 'notification',
            component: AccountSettingsNotificationComponent,
            data: { titleI18n: 'pro-account-settings' },
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProRoutingModule {}
