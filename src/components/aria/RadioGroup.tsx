import React, { ReactNode } from 'react';
import { Radio as RACRadio, RadioGroup as RACRadioGroup, RadioGroupProps as RACRadioGroupProps, RadioProps, ValidationResult } from 'react-aria-components';
import { tv } from 'tailwind-variants';
import { Description, FieldError, Label } from './Field';
import { composeTailwindRenderProps, focusRing } from './utils';

export interface RadioGroupProps extends Omit<RACRadioGroupProps, 'children'> {
  label?: string,
  children?: ReactNode,
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export function RadioGroup(props: RadioGroupProps) {
  return (
    <RACRadioGroup {...props} className={composeTailwindRenderProps(props.className, 'group flex flex-col gap-2')}>
      <Label>{props.label}</Label>
      <div className="flex group-orientation-vertical:flex-col h-4 overflow-hidden gap-4 group-orientation-horizontal:gap-4">
        {props.children}
      </div>
      {props.description && <Description>{props.description}</Description>}
      <FieldError>{props.errorMessage}</FieldError>
    </RACRadioGroup>
  );
}

const styles = tv({
  extend: focusRing,
  base: 'w-3 h-3 rounded-full bg-neutral-700  transition-all',
  variants: {
    isSelected: {
      false: '',
      true: 'bg-indigo-500 group-pressed:border-indigo-500'
    },
    isInvalid: {
      true: 'border-red-700 dark:border-red-600 group-pressed:border-red-800 dark:group-pressed:border-red-700 forced-colors:!border-[Mark]'
    },
    isDisabled: {
      true: 'border-gray-200 dark:border-zinc-700 forced-colors:!border-[GrayText]'
    }
  }
});

export function Radio(props: RadioProps) {
  return (
    <RACRadio {...props} className={composeTailwindRenderProps(props.className, 'flex gap-2 items-center group text-neutral-300 text-xs disabled:text-gray-300 dark:text-zinc-200 dark:disabled:text-zinc-600 forced-colors:disabled:text-[GrayText] transition')}>
      {renderProps => <>
        <div className={styles(renderProps)} />
        {props.children}
      </>}
    </RACRadio>
  );
}
