import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, UserDetails } from '@core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
  selector: 'app-account-settings-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountSettingsBaseComponent implements OnInit {
  data: UserDetails = {
    email: '',
    campaignName: '',
    userName: '',
  };
  userName: any;
  constructor(
    private auth: AuthenticationService,
    private http: _HttpClient,
    private cdr: ChangeDetectorRef,
    private msg: NzMessageService,
    private router: Router,
  ) {
    this.data = this.auth.getUserDetails();
    this.userName = localStorage.getItem('userName');
  }
  avatar = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
  userLoading = true;
  user: any;

  // #region geo

  provinces: any[] = [];
  cities: any[] = [];

  ngOnInit(): void {
    this.userLoading = false;
    this.user = { email: this.data.email };
  }

  choProvince(pid: string, cleanCity = true) {
    this.http.get(`/geo/${pid}`).subscribe((res: any) => {
      this.cities = res;
      if (cleanCity) {
        this.user.geographic.city.key = '';
      }
      this.cdr.detectChanges();
    });
  }

  // #endregion

  save() {
    this.http.post('users/change', this.user).subscribe((res: any) => {
      if (res.err === 'Already taken') {
        this.msg.error('That Campaign name is taken, choose a different name');
      } else {
        this.msg.success('Successfully committed changes, please log in back');
        this.router.navigateByUrl('/passport/login');
      }
    });
    return false;
  }
}
