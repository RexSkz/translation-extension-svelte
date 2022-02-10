<script lang="ts">
import classnames from 'classnames';

type TagColor = '' | 'pink' | 'red' | 'green' | 'yellow' | 'blue' | 'gray' | 'white';

export let className = '';
export let style = '';

export let color: TagColor = '';

const classes = classnames('ssc-tag', className, {
  [`ssc-tag-${color}`]: color,
});
</script>

<div class={classes} style={style}>
  <slot />
</div>

<style lang="less">
@import '../_styles/base.less';

.ssc-tag {
  position: relative;
  display: inline-block;
  height: 20px;
  line-height: 20px;
  padding: 0 4px;
  font-size: 12px;
  font-weight: 500;
  vertical-align: middle;
  border-radius: 2px;
  box-sizing: border-box;

  & + .ssc-tag {
    margin-left: 4px;
  }

  &-pink {
    color: #EE4D2D;
    background-color: #FFF5F0;
  }

  &-red {
    color: #F32345;
    background-color: #FFF0F0;
  }

  &-green {
    color: #1CC461;
    background-color: #ECFFF1;
  }

  &-yellow {
    color: #FFB014;
    background-color: #FFF8DB;
  }

  &-blue {
    color: #3274F7;
    background-color: #F0F7FF;
  }

  &-gray {
    color: #646B76;
    background-color: #F5F6F9;
  }
  &-white {
    color: #000;
    background-color: #FFF;
  }
}
.ssc-tag__process(@color) {
  display: inline-flex;
  align-items: center;
  font-size: 14px;
  font-weight: 400;
  margin-right: 16px;
  margin-bottom: 16px;
  &:before {
    content: '';
    position: absolute;
    width: 6px;
    height: 6px;
    border-radius: 9px;
    background-color: @color;
    left: -8px;
  }
}
.ssc-tag__process__info {
  .ssc-tag__process(#3274F7);
}
.ssc-tag__process__success {
  .ssc-tag__process(#1CC461);
}
.ssc-tag__process__warn {
  .ssc-tag__process(#FFB014);
}
.ssc-tag__process__error {
  .ssc-tag__process(#F32345);
}
.ssc-tag__process__invalid {
  .ssc-tag__process(#B4BBC6);
}
</style>
