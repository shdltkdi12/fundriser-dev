import { HttpHeaders } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthenticationService, UserDetails } from '@core';
import { _HttpClient } from '@delon/theme';
@Component({
  selector: 'app-dashboard-v1',
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  todoData: any[] = [];

  webSite: any[];
  salesData: any[];
  offlineChartData: any[] = [];
  oneTimeData: any;
  recurringData: any;
  data: UserDetails = {
    email: '',
    campaignName: '',
    userName: '',
  };
  constructor(private auth: AuthenticationService, private http: _HttpClient, private cdr: ChangeDetectorRef) {}
  ngOnInit() {
    this.data = this.auth.getUserDetails();
    if (this.data.email === 'admin') {
      this.http.get('admin/userdata').subscribe((res: any) => {
        this.oneTimeData = res[0];
        this.recurringData = res[1];
        this.offlineChartData = res[2];
        this.cdr.detectChanges();
      });
    } else {
      this.http.get('users/userdata', { body: { email: this.data.email } }).subscribe((res: any) => {
        this.oneTimeData = res[0];
        this.recurringData = res[1];
        this.offlineChartData = res[2];
        this.cdr.detectChanges();
      });
    }
  }
}
