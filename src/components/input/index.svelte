<script lang="ts">
import classnames from 'classnames';

type InputSize = 'small' | 'default' | 'large';

export let className = '';
export let style = '';

export let value: string = '';
export let onChange: (e: Event) => any = () => false;
export let placeholder = 'Please Input';
export let readOnly = false;
export let size: InputSize = 'default';
export let autoFocus = true;

const classes = classnames('ssc-input', className, {
  [`ssc-input-${size}`]: size,
  'ssc-input-disabled': readOnly,
});
</script>

<div class={classes} style={style}>
  <span>
    <input
      value={value}
      on:input={onChange}
      placeholder={placeholder}
      autofocus={autoFocus}
      readonly={readOnly}
    />
  </span>
</div>

<style lang="less">
@import '../_styles/base.less';

@input-prefix-cls: ~'.@{prefix}-input';

@{input-prefix-cls} {
  box-sizing: border-box;
  display: inline-block;
  vertical-align: middle;
  & > * {
    box-sizing: border-box;
    line-height: 1;
  }
  & > span {
    border: 1px @color-gray-he solid;
    border-radius: 4px;
    display: inline-flex;
    width: 100%;
    transition: all 0.3s;
    &:hover {
      border-color: @color-gray-hb;
      @{input-prefix-cls}-clear {
        opacity: 1;
      }
    }
    & > input {
      // flex: 1;
      padding: 0 12px;
      border: none;
      border-radius: 4px;
      outline: none;
      font-size: 14px;
      color: @color-text;
      width: 100%;
      min-width: 50px;
      box-sizing: border-box;
      &::placeholder {
        color: @color-gray-hb;
      }
    }
    & > span {
      display: flex;
      & > span {
        font-size: 14px;
        color: @color-gray-h9;
        height: 16px;
        align-self: center;
      }
    }
  }
  &-prefix > span {
    padding-left: 12px;
    padding-right: 8px;
    border-right: 1px @color-gray-he solid;
  }
  &-suffix > span {
    padding-right: 12px;
    padding-left: 8px;
    border-left: 1px @color-gray-he solid;
  }
  &-search {
    padding-right: 12px;
    cursor: pointer;
  }
  &-clear {
    padding-right: @size-padding-small;
    cursor: pointer;
    opacity: 0;
  }
  &-help-text {
    word-break: break-word;
    margin-top: 4px;
    color: @color-gray-h6;
    font-size: 14px;
  }
  &-textlength {
    font-size: 14px;
    color: @color-gray-h9;
    align-self: center;
    padding-right: 12px;
  }
  &.ssc-input-default > span {
    height: @size-height-medium;
  }
  &.ssc-input-large > span {
    height: @size-height-large;
  }
  &.ssc-input-small > span {
    height: @size-height-small;
  }
  &.ssc-input-disabled > span {
    background: @color-gray-hf;
    border-color: @color-gray-he;
    &:hover,
    &:focus {
      background: @color-gray-hf;
      border-color: @color-gray-he;
    }
    & > * {
      opacity: 0.5;
    }
  }
  &.ssc-input-ellipsis {
    & > span {
      & > input {
        // flex-grow: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  &.ssc-input-disabled * {
    cursor: not-allowed;
  }
  &:focus-within > span {
    border-color: @color-gray-h9;
  }
  &-password {
    & > span .ssc-input-suffix > span {
      border-left: none;
    }
    &-icon {
      color: @color-alpha-mask;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        color: rgba(@color-black, 0.85);
      }
    }
  }
}
</style>
