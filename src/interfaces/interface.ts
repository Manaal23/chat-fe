import React, { KeyboardEvent } from 'react';

export interface InputProps {
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  type?: string;
  name?: string;
  value: string | null;
  id?: string;
  placeholder?: string;
  labelPlaceholder?: string;
  required?: boolean;
  labelText?: string;
  labelHtmlFor?: string;
  maxLength?: number;
  floatLabel?: boolean;
  hasMsgIcon?: boolean;
  state?: string;
  variant?: string;
  errorMsg?: string;
  password?: boolean;
  togglePassword?: () => void;
  // icon;
  handleMsg?: (e: React.MouseEvent<HTMLInputElement>) => void;
  onKeyPress?: (e: KeyboardEvent<HTMLInputElement>) => void;
  isMandatory?: boolean;
  hideReqdError?: boolean;
  reqdErrorMsg?: string;
  ariaLabel?: string;
  inputStyles?: React.CSSProperties;
  wrapperStyles?: React.CSSProperties;
}

export interface RadioBtnProps {
  changed: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  id?: string;
  value?: string;
  isSelected?: boolean;
  label?: string;
  icon?: string;
  isDisable?: boolean;
  children?: React.ReactNode;
  radioLabel?: boolean;
  name?: string;
  activeOnSelect?: boolean;
  buttonAlignment?: string;
  readOnly?: boolean;
  alignment?: string;
  filledRadioColor?: string;
  parentStyles?: React.CSSProperties;
  className?: string;
  labelStyle?: React.CSSProperties;
  hideRadio?: boolean;
  labelColor?: string;
  radioIconColor?: string;
  radioIconPosition?: string;
  childStyles?: React.CSSProperties;
}
