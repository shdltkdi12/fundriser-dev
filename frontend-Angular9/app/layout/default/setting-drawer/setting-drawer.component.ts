import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, NgZone } from '@angular/core';
import { SettingsService } from '@delon/theme';
import { copy, deepCopy, LazyService } from '@delon/util';
import { NzMessageService } from 'ng-zorro-antd/message';

const ALAINDEFAULTVAR = 'alain-default-vars';
const DEFAULT_COLORS = [
  {
    key: 'dust',
    color: '#F5222D',
  },
  {
    key: 'volcano',
    color: '#FA541C',
  },
  {
    key: 'sunset',
    color: '#FAAD14',
  },
  {
    key: 'cyan',
    color: '#13C2C2',
  },
  {
    key: 'green',
    color: '#52C41A',
  },
  {
    key: 'daybreak',
    color: '#1890ff',
  },
  {
    key: 'geekblue',
    color: '#2F54EB',
  },
  {
    key: 'purple',
    color: '#722ED1',
  },
  {
    key: 'black',
    color: '#001529',
  },
];
const DEFAULT_VARS = {
  'primary-color': { label: '主颜色', type: 'color', default: '#1890ff' }
};

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'setting-drawer',
  templateUrl: './setting-drawer.component.html',
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    '[class.setting-drawer]': 'true',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingDrawerComponent {
  private loadedLess = false;

  collapse = false;
  get layout() {
    return this.settingSrv.layout;
  }
  data: any = {};
  color: string;
  colors = DEFAULT_COLORS;

  constructor(
    private cdr: ChangeDetectorRef,
    private msg: NzMessageService,
    private settingSrv: SettingsService,
    private lazy: LazyService,
    private zone: NgZone,
    @Inject(DOCUMENT) private doc: any,
  ) {
    this.color = this.cachedData['@primary-color'] || this.DEFAULT_PRIMARY;
    this.resetData(this.cachedData, false);
  }

  private get cachedData() {
    return this.settingSrv.layout[ALAINDEFAULTVAR] || {};
  }

  private get DEFAULT_PRIMARY() {
    return DEFAULT_VARS['primary-color'].default;
  }

  private loadLess(): Promise<void> {
    if (this.loadedLess) {
      return Promise.resolve();
    }
    return this.lazy
      .loadStyle('./assets/alain-default.less', 'stylesheet/less')
      .then(() => {
        const lessConfigNode = this.doc.createElement('script');
        lessConfigNode.innerHTML = `
          window.less = {
            async: true,
            env: 'production',
            javascriptEnabled: true
          };
        `;
        this.doc.body.appendChild(lessConfigNode);
      })
      .then(() => this.lazy.loadScript('https://gw.alipayobjects.com/os/lib/less.js/3.8.1/less.min.js'))
      .then(() => {
        this.loadedLess = true;
      });
  }

  private genVars() {
    const { data, color } = this;
    const vars: any = {
      [`@primary-color`]: color,
    };
    this.setLayout(ALAINDEFAULTVAR, vars);
    return vars;
  }

  private runLess() {
    const { zone, msg, cdr } = this;
    const msgId = msg.loading(`Processing`, { nzDuration: 0 }).messageId;
    setTimeout(() => {
      zone.runOutsideAngular(() => {
        this.loadLess().then(() => {
          (window as any).less.modifyVars(this.genVars()).then(() => {
            msg.success('Changed Color Succesfully');
            msg.remove(msgId);
            zone.run(() => cdr.detectChanges());
          });
        });
      });
    }, 200);
  }

  toggle() {
    this.collapse = !this.collapse;
  }

  changeColor(color: string) {
    this.color = color;
    Object.keys(DEFAULT_VARS)
      .filter((key) => DEFAULT_VARS[key].default === '@primary-color')
      .forEach((key) => delete this.cachedData[`@${key}`]);
    this.resetData(this.cachedData, false);
  }

  setLayout(name: string, value: any) {
    this.settingSrv.setLayout(name, value);
  }

  private resetData(nowData?: {}, run = true) {
    nowData = nowData || {};
    const data = deepCopy(DEFAULT_VARS);
    Object.keys(data).forEach((key) => {
      const value = nowData[`@${key}`] || data[key].default || '';
      data[key].value = value === `@primary-color` ? this.color : value;
    });
    this.data = data;
    if (run) {
      this.cdr.detectChanges();
      this.runLess();
    }
  }


  apply() {
    this.runLess();
  }
}
