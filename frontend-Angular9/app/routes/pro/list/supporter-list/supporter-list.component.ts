import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AuthenticationService, UserDetails } from '@core';
import { STChange, STColumn, STComponent, STData } from '@delon/abc/st';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-table-sup-list',
  templateUrl: './supporter-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupporterListComponent implements OnInit {
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
    { index: 0, text: 'One-time', value: false, type: 'success', checked: false },
    { index: 1, text: 'Subscribed', value: false, type: 'processing', checked: false },
    { index: 2, text: 'Used 3rd Party', value: false, type: 'default', checked: false },
    { index: 3, text: 'Paused', value: false, type: 'error', checked: false },
  ];
  @ViewChild('st', { static: true })
  st: STComponent;
  columns: STColumn[] = [
    { title: '', index: 'row_num', type: 'checkbox' },
    { title: 'Name', index: 'fullname' },
    { title: 'Email', index: 'email', type: 'link', format: (item: any) => `${item.email}` },
    {
      title: 'Lifetime Donated',
      index: 'total_donations',
      className: 'text-center',
      format: (item: any) => `$${item.total_donations}`,
      sorter: (a: any, b: any) => a.total_donations - b.total_donations,
    },
    {
      title: 'Status',
      index: 'status',
      render: 'status',
      filter: {
        menus: this.status,
        fn: (filter: any, record: any) => record.status === filter.index,
      },
    },
    {
      title: 'First Donation',
      index: 'createdAt',
      type: 'date',
      sort: {
        compare: (a: any, b: any) => a.updatedAt - b.updatedAt,
      },
    },
    {
      title: 'Last Donation',
      index: 'updatedAt',
      type: 'date',
      sort: {
        compare: (a: any, b: any) => a.updatedAt - b.updatedAt,
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
        .get('admin/supporters')
        .pipe(
          map((list: any[]) =>
            list.map((i) => {
              const statusItem = this.status[i.status];
              i.statusText = statusItem.text;
              i.statusType = statusItem.type;
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
        .get('users/supporters', { body: { email: this.userDetails.email } })
        .pipe(
          map((list: any[]) =>
            list.map((i) => {
              const statusItem = this.status[i.status];
              i.statusText = statusItem.text;
              i.statusType = statusItem.type;
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
            const statusItem = this.status[i.status];
            i.statusText = statusItem.text;
            i.statusType = statusItem.type;
            return i;
          }),
        ),
        tap(() => (this.loading = false)),
      )
      .subscribe((res) => {
        this.data = res;
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
    this.msg.success(`审${this.selectedRows.length} 笔`);
  }

  add(tpl: TemplateRef<{}>) {
    this.modalSrv.create({
      nzTitle: '规则',
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
