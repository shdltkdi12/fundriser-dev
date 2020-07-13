import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AuthenticationService, UserDetails } from '@core';
import { STChange, STColumn, STComponent, STData } from '@delon/abc/st';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-table-list',
  templateUrl: './donation-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DonationListComponent implements OnInit {
  q: any = {
    pi: 1,
    ps: 10,
    sorter: '',
    status: null,
    statusList: [],
    list: [],
  };
  data: any[] = [];
  loading = false;
  status = [
    { index: 0, checked: false },
    { index: 1, checked: true },
  ];
  @ViewChild('st', { static: true })
  st: STComponent;
  columns: STColumn[] = [
    { title: '', index: 'row_num', type: 'checkbox' },
    { title: 'Date', index: 'date', sort: { compare: (a: any, b: any) => (a.date = b.date) } },
    {
      title: 'Donation',
      index: 'amount',
      className: 'text-center',
      format: (item: any) => ` $${item.amount}`,
    },
    /* Recurring icon area
    {
      title: '',
      buttons: [
        {
          icon: 'clock-circle',
        },
      ],
    },
    */
    {
      title: 'Fee Covered',
      index: 'isFeeCovered',
      type: 'yn',
      className: 'text-center',
    },
    {
      title: 'Supporter',
      index: 'name',
      sort: {
        compare: (a: any, b: any) => a.name - b.name,
      },
    },
    {
      title: 'Campaign Name',
      index: 'campaign_name',
      sort: {
        compare: (a: any, b: any) => a.campaignName - b.campaign_name,
      },
    },
  ];
  selectedRows: STData[] = [];
  email = '';
  totalCallNo = 0;
  expandForm = false;
  userDetails: UserDetails = {
    email: '',
    campaignName: '',
    userName: '',
  };
  constructor(
    private auth: AuthenticationService,
    private http: _HttpClient,
    public msg: NzMessageService,
    private modalSrv: NzModalService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.userDetails = this.auth.getUserDetails();
    if (this.userDetails.email === 'admin') {
      this.http
        .get('admin/donations')
        .pipe(
          map((list: any[]) =>
            list.map((i) => {
              i.isFeeCovered = Boolean(i.isFeeCovered);
              return i;
            }),
          ),
        )
        .subscribe((res: any) => {
          this.data = res;
          this.cdr.detectChanges();
        });
    } else {
      this.http
        .get('users/donations', { body: { email: this.userDetails.email } })
        .pipe(
          map((list: any[]) =>
            list.map((i) => {
              i.isFeeCovered = Boolean(i.isFeeCovered);
              return i;
            }),
          ),
        )
        .subscribe((res: any) => {
          this.data = res;
          this.cdr.detectChanges();
        });
    }
  }

  getData() {
    this.loading = true;
    this.q.statusList = this.status.filter((w) => w.checked).map((item) => item.index);
    if (this.q.status !== null && this.q.status > -1) {
      this.q.statusList.push(this.q.status);
    }
    this.http
      .get('/rule', this.q)
      .pipe(
        map((list: any[]) =>
          list.map((i) => {
            const statusItem = this.status[i.isFeeCovered];
            i.statusText = statusItem.checked;
            return i;
          }),
        ),
        tap(() => (this.loading = false)),
      )
      .subscribe((res) => {
        this.data = res;
        console.log(this.data);
        this.cdr.detectChanges();
      });
  }

  stChange(e: STChange) {
    switch (e.type) {
      case 'checkbox':
        this.selectedRows = e.checkbox;
        this.totalCallNo = this.selectedRows.reduce((total, cv) => total + cv.total_donations, 0);
        this.cdr.detectChanges();
        break;
      case 'filter':
        this.getData();
        break;
    }
  }

  remove() {
    this.http.delete('/rule', { nos: this.selectedRows.map((i) => i.fullname).join(',') }).subscribe(() => {
      this.getData();
      this.st.clearCheck();
    });
  }

  approval() {
    this.msg.success(`审批了 ${this.selectedRows.length} 笔`);
  }

  add(tpl: TemplateRef<{}>) {
    this.modalSrv.create({
      nzTitle: '新建规则',
      nzContent: tpl,
      nzOnOk: () => {
        this.loading = true;
        this.http.post('/rule', { email: this.email }).subscribe(() => this.getData());
      },
    });
  }

  reset() {
    // wait form reset updated finished
    setTimeout(() => this.getData());
  }
}
