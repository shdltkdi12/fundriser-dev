import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NoticeIconList, NoticeItem } from '@delon/abc/notice-icon';
import add from 'date-fns/add';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import parse from 'date-fns/parse';
import { NzI18nService } from 'ng-zorro-antd/i18n';
import { NzMessageService } from 'ng-zorro-antd/message';

/**
 * 菜单通知
 */
@Component({
  selector: 'header-notify',
  template: `
    <notice-icon
      [data]="data"
      [count]="count"
      [loading]="loading"
      btnClass="alain-default__nav-item"
      btnIconClass="alain-default__nav-item-icon"
      (select)="select($event)"
      (clear)="clear($event)"
      (popoverVisibleChange)="loadData()"
    ></notice-icon>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderNotifyComponent {
  data: NoticeItem[] = [
    {
      title: 'Donations',
      list: [],
      emptyText: '你已查看所有通知',
      emptyImage: 'https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg',
      clearText: 'Clear',
    },
    {
      title: 'App',
      list: [],
      emptyText: '你已完成所有待办',
      emptyImage: 'https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg',
      clearText: 'Clear',
    },
  ];
  count = 1;
  loading = false;

  constructor(private msg: NzMessageService, private nzI18n: NzI18nService) {}

  updateNoticeData(notices: NoticeIconList[]): NoticeItem[] {
    const data = this.data.slice();
    data.forEach((i) => (i.list = []));

    notices.forEach((item) => {
      const newItem = { ...item };
      if (typeof newItem.datetime === 'string') {
        newItem.datetime = parse(newItem.datetime, 'yyyy-MM-dd', new Date());
      }
      if (newItem.datetime) {
        newItem.datetime = formatDistanceToNow(newItem.datetime as Date, { locale: this.nzI18n.getDateLocale() });
      }
      if (newItem.extra && newItem.status) {
        newItem.color = ({
          todo: undefined,
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        } as { [key: string]: string | undefined })[newItem.status];
      }
      data.find((w) => w.title === newItem.type).list.push(newItem);
    });
    return data;
  }

  loadData() {
    if (this.loading) {
      return;
    }
    this.loading = false;
    setTimeout(() => {
      const now = new Date();
      this.data = this.updateNoticeData([
        {
          id: '000000004',
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png',
          title: 'You have a new recurring donation!',
          datetime: now,
          type: 'Donations',
        },
        {
          id: '00000009',
          title: 'Security',
          description: 'Remember to never share your password with anyone',
          extra: 'No Expiry',
          status: 'todo',
          type: 'App',
        },
        {
          id: '000000010',
          title: 'Session Duration',
          description: 'Your session expires in 1 hour after logging in',
          extra: '1 hour',
          status: 'doing',
          type: 'App',
        },
      ]);

      this.loading = false;
    }, 0);
  }

  clear(type: string) {
    this.msg.error(`Still in implementation`);
  }

  select(res: any) {}
}
