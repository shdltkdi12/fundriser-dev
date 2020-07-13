import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthenticationService, UserDetails } from '@core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-data-v-relation',
  templateUrl: './campaign-portal.component.html',
})
export class CampaignPortalComponent implements OnInit, OnDestroy {
  data: UserDetails = {
    email: '',
    campaignName: '',
    userName: '',
  };
  constructor(private auth: AuthenticationService, private http: _HttpClient) {
    this.data = this.auth.getUserDetails();
  }

  ngOnInit() {}

  ngOnDestroy(): void {}
}
