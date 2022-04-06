import { SuperComponent, wxComponent } from '../common/src/index';
import { getRect, requestAnimationFrame } from '../common/utils';
import config from '../common/config';

const { prefix } = config;
const name = `${prefix}-notice-bar`;

@wxComponent()
export default class NoticeBar extends SuperComponent {
  externalClasses = ['t-class', 't-class-content', 't-class-left-icon', 't-class-right-icon'];

  options = {
    styleIsolation: 'apply-shared' as const,
    multipleSlots: true,
  };

  properties = {
    // ...props,
    /** 内容的对齐方式，默认居中对齐。可选项：top/middle/bottom */
    align: {
      type: String,
      value: 'middle',
    },

    /** 用于自定义消息内容 */
    content: {
      type: String,
    },

    /** 跑马灯效果。speed 指速度控制；loop 指循环播放次数，值为 -1 表示循环播放，值为 0 表示不循环播放；delay 表示延迟多久开始播放 */
    marquee: {
      type: Boolean,
      optionalTypes: [Object],
      value: false,
    },

    /** 公告栏组件风格。  可选项：'info' | 'success' | 'warning' | 'error' */
    theme: {
      type: String,
      value: 'info',
    },

    /** 是否显示，隐藏时默认销毁组件 */
    visible: {
      type: Boolean,
      value: false,
    },

    /** 元素层级，样式默认为 5000 */
    zIndex: {
      type: Number,
    },

    /** 左侧icon */
    leftIcon: {
      type: String,
      optionalTypes: [Boolean],
      value: true,
    },

    /** 通知栏模式，可选值为 closeable link */
    mode: {
      type: String,
      value: '',
    },

    /** 通知栏模式，可选值为 closeable link */
    url: {
      type: String,
      value: '',
    },

    /** 通知栏模式，可选值为 closeable link */
    openType: {
      type: String,
      value: 'navigate',
    },

    /** 是否开启文本换行，只在禁用marquee时生效 */
    wrapable: {
      type: Boolean,
      value: false,
    },

    /** 默认文本为‘详情’, 可自定义 */
    showDetail: {
      type: String,
      optionalTypes: [Boolean],
      value: false,
    },
  };

  data = {
    prefix,
    classPrefix: name,
    icon: '',
    loop: -1,
  };

  observers = {
    marquee(val) {
      if (JSON.stringify(val) === '{}') {
        this.setData({
          marquee: {
            speed: 50,
            loop: -1,
            delay: 5000,
          },
        });
      }
    },
  };

  ready() {
    this.setIcon();
    this.initAnimation();
  }

  created() {
    this.resetAnimation = wx.createAnimation({
      duration: 0,
      timingFunction: 'linear',
    });
  }

  detached() {
    this.clearNoticeBarAnimation();
  }

  methods = {
    initAnimation() {
      if (!this.properties.marquee) {
        return;
      }

      this.setData({ loop: this.properties.marquee.loop });

      // 获取外部容器和滚动内容的宽度
      const warpID = `.${name}__content-wrap`;
      const nodeID = `.${name}__content`;
      requestAnimationFrame(() => {
        Promise.all([getRect(this, nodeID), getRect(this, warpID)]).then(([nodeRect, wrapRect]) => {
          const { marquee } = this.properties;
          const speeding = marquee.speed;

          if (nodeRect == null || wrapRect == null || !nodeRect.width || !wrapRect.width) {
            return;
          }

          const duration = ((wrapRect.width + nodeRect.width) / speeding) * 1000;
          const firstDuration = (nodeRect.width / speeding) * 1000;

          this.setData({
            wrapWidth: Number(wrapRect.width),
            contentWidth: Number(nodeRect.width),
            duration: duration,
            firstDuration: firstDuration,
          });

          // todo: 首次滚动 存在有点问题～～this.startScrollAnimation(true);
          // 首次滚动初始位置和动画持续时间为 0 & firstDuration，其于为 wrapWidth & duration
          this.startScrollAnimation();
        });
      });
    },

    startScrollAnimation(isFirst = false) {
      this.clearNoticeBarAnimation();
      const { wrapWidth, contentWidth, firstDuration, duration } = this.data;

      // 滚动内容: 初始位置。
      const durationTime = isFirst ? firstDuration : duration;
      this.setData({
        animationData: this.resetAnimation
          .translateX(isFirst ? 0 : wrapWidth)
          .step()
          .export(),
      });

      requestAnimationFrame(() => {
        // 滚动内容: 最终位置
        this.setData({
          animationData: wx.createAnimation({ duration: durationTime }).translateX(-contentWidth).step().export(),
        });
      });

      // 滚动一次完成, 开启下一次的滚动
      this.timer = setTimeout(() => {
        if (this.data.loop === 0) {
          // 动画回到初始位置
          this.setData({ animationData: this.resetAnimation.translateX(0).step().export() });
        } else {
          this.startScrollAnimation();
        }
      }, durationTime);
    },

    /** 清除动画 */
    clearNoticeBarAnimation() {
      this.timer && clearTimeout(this.timer);
      this.timer = null;
    },

    /** icon 值设置 */
    setIcon(leftIcon = this.properties.leftIcon) {
      // 使用空值
      if (!leftIcon) {
        this.setData({ icon: '' });
        return;
      }
      // 固定值
      if (typeof leftIcon === 'string') {
        this.setData({
          icon: `${leftIcon}`,
        });
        return;
      }

      // 使用默认值
      if (leftIcon) {
        let nextValue = 'notification';
        const { theme } = this.properties;
        const themeMessage = {
          info: 'error-circle-filled',
          success: 'check-circle-filled',
          warning: 'error-circle-filled',
          error: 'close-circle-filled',
        };
        nextValue = themeMessage[theme];
        this.setData({ icon: nextValue });
      }
    },

    handleClose(event) {
      if (this.data.mode === 'closeable') {
        this.clearNoticeBarAnimation();
        this.setData({ visible: false });
      }
      this.triggerEvent('close', event.detail);
    },

    handleDetail() {
      this.triggerEvent('detail', { self: this });
    },
  };
}
