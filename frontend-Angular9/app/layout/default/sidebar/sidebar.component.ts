import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthenticationService, UserDetails } from '@core';
import { SettingsService } from '@delon/theme';

@Component({
  selector: 'layout-sidebar',
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  data: UserDetails = {
    email: '',
    campaignName: '',
    userName: '',
  };
  userName: any;
  constructor(private auth: AuthenticationService, public settings: SettingsService) {
    this.data = this.auth.getUserDetails();
  }
}
