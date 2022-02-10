<script lang="ts">
import classnames from 'classnames';

type ButtonType = 'primary' | 'default' | 'danger' | 'link';

export let className = '';
export let style = '';

export let type: ButtonType = 'default';
export let htmlType = '';
export let onClick: (e: Event) => any = () => false;

const classes = classnames('ssc-button', className, {
  [`ssc-button-${type}`]: type,
});
</script>

<button
  class={classes}
  type={htmlType}
  style={style}
  on:click={onClick}
>
  <slot />
</button>

<style lang="less">
@import '../_styles/base.less';

.ssc-button {
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  height: @size-height-medium;
  line-height: @size-height-medium - 2;
  padding: 0 @size-padding-medium;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  white-space: nowrap;
  cursor: pointer;
  background: @color-white;
  border: 1px solid @color-gray-divider;
  border-radius: 4px;
  color: @color-text;
  outline: none;
  box-sizing: border-box;
  user-select: none;
  vertical-align: middle;
  transition: background 0.3s, border 0.3s, color 0.3s, padding 0.3s;

  &:hover,
  &:focus {
    background: @color-alpha-hover;
    border-color: darken(@color-gray-divider, 4%);
  }

  &:active {
    background: @color-alpha-active;
    border-color: darken(@color-gray-divider, 8%);
  }

  &-disabled {
    cursor: not-allowed;
    &:hover,
    &:focus {
      background: inherit;
      border-color: @color-gray-divider;
    }
    & > * {
      opacity: 0.5;
    }
  }

  &-loading {
    cursor: progress;
  }

  &-dashed {
    border-style: dashed;
  }

  &-circle {
    border-radius: @size-height-medium / 2;
    min-width: @size-height-medium;
    .ssc-button-icon {
      margin-right: 0;
    }
  }

  &-empty {
    vertical-align: middle;
    padding: 0;
  }

  &-icon {
    display: inline-flex;
    width: 16px;
    height: 16px;
    margin-right: 8px;
    .ssc-icon {
      width: 16px;
      height: 16px;
    }
  }

  &-has-icon:not(&-empty) {
    padding-left: @size-padding-medium * 2;
  }

  &-block {
    // display: block;
    width: 100%;
  }

  &-link {
    background: none;
    border: none;
    color: @color-normal;
    display: inline-flex;
    padding: 0;
    &:hover {
      background: none;
      color: @color-normal-hover;
      text-decoration: underline;
    }
    &:active {
      background: none;
      color: @color-normal-active;
      text-decoration: underline;
    }
    &:focus {
      background: none;
      color: @color-normal-active;
    }
    &.ssc-button-disabled:hover,
    &.ssc-button-disabled:active {
      color: @color-normal;
      text-decoration: none;
    }
  }

  &-ghost {
    background: transparent;
    color: @color-white;
    &:hover,
    &:focus {
      background: inherit;
    }

    &.ssc-button-primary {
      background: transparent;
      border-color: @color-primary;
      color: @color-primary;
      &:hover,
      &:focus {
        background: transparent;
      }
    }

    &.ssc-button-danger {
      background: transparent;
      border-color: @color-danger;
      color: @color-danger;
      &:hover,
      &:focus {
        background: transparent;
      }
    }
  }

  &-primary {
    background: @color-primary;
    border-color: @color-primary;
    color: @color-white;

    &:hover,
    &:focus {
      background: @color-primary-hover;
      border-color: @color-primary-hover;
    }

    &:active {
      background: @color-primary-active;
      border-color: @color-primary-active;
    }

    &.ssc-button-disabled,
    &.ssc-button-disabled:hover {
      background: @color-primary;
      border-color: @color-primary;
      color: @color-white;
      opacity: 0.5;

      & > * {
        opacity: 1;
      }
    }

    &.ssc-button-ghost {
      &.ssc-button-disabled,
      &.ssc-button-disabled:hover {
        background: transparent;
        color: @color-primary;
      }
    }
  }

  &-danger {
    background: @color-danger;
    border-color: @color-danger;
    color: @color-white;

    &:hover,
    &:focus {
      background: @color-danger-hover;
      border-color: @color-danger-hover;
    }

    &:active {
      background: @color-danger-active;
      border-color: @color-danger-active;
    }

    &.ssc-button-disabled,
    &.ssc-button-disabled:hover {
      background: @color-danger;
      border-color: @color-danger;
      color: @color-white;
      opacity: 0.5;

      & > * {
        opacity: 1;
      }
    }

    &.ssc-button-ghost {
      &.ssc-button-disabled,
      &.ssc-button-disabled:hover {
        background: transparent;
        color: @color-danger;
      }
    }
  }

  &-small {
    height: @size-height-small;
    line-height: @size-height-small - 2;
    padding: 0 @size-padding-small;
    font-size: 12px;

    &.ssc-button-circle {
      border-radius: @size-height-small / 2;
      min-width: @size-height-small;
      padding: 0;
    }

    &.ssc-button-has-icon:not(.ssc-button-empty) {
      padding-left: @size-padding-small * 2;
    }
  }

  &-large {
    height: @size-height-large;
    line-height: @size-height-large - 2;
    padding: 0 @size-padding-large;
    font-size: 16px;

    &.ssc-button-circle {
      border-radius: @size-height-large / 2;
      min-width: @size-height-large;
      padding: 0;
    }

    &.ssc-button-has-icon:not(.ssc-button-empty) {
      padding-left: @size-padding-large * 2;
    }
  }

  & + &,
  & + .ssc-dropdown {
    margin-left: 16px;
  }
}
</style>
