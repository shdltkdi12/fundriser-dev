import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService, UserDetails } from '@core';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'passport-register-result',
  templateUrl: './register-result.component.html',
})
export class UserRegisterResultComponent {
  params = { email: '' };
  email = '';
  constructor(private auth: AuthenticationService, route: ActivatedRoute, public msg: NzMessageService) {
    this.params.email = this.email = localStorage.getItem('email');
  }
}
