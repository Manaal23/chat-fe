import React from 'react';
import styled from 'styled-components';
import { SpaceProps } from 'styled-system';
import { InputProps } from '../../interfaces/interface';

const noop = (): void => {};

interface CustomProps {
  state?: string;
  floatLabel?: boolean;
  value?: string;
  labelText?: string;
}

const InputField = React.forwardRef(
  (props: InputProps, ref: React.Ref<HTMLInputElement>) => {
    const {
      onChange,
      type = 'text',
      name = '',
      value = null,
      id = '',
      placeholder = '',
      labelPlaceholder = '',
      required = true,
      labelText = '',
      labelHtmlFor = '',
      maxLength,
      floatLabel = false,
      state = 'normal',
      errorMsg,
      password = false,
      hasMsgIcon = false,
      togglePassword = noop,
      handleMsg = noop,
      onKeyPress = noop,
      // icon,
      isMandatory = true,
      // hideReqdError = false,
      // reqdErrorMsg = ' Cannot be empty',
      ariaLabel = 'This is input field',
      inputStyles,
      wrapperStyles,
      ...rest
    } = props;

    const onValueChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
      onChange(e);
    };

    const inputAriaLabel = (): string =>
      ariaLabel || `${labelText}${isMandatory ? '*' : ''}`;

    return (
      <InputWrapper style={wrapperStyles} mb="16px">
        <InputDom
          onKeyUp={onKeyPress}
          ref={ref}
          id={id}
          type={type}
          name={name}
          // required={required}
          placeholder={placeholder}
          labelText={labelText}
          value={value}
          {...rest}
          onChange={onValueChange}
          state={state}
          floatLabel={floatLabel}
          aria-label={ariaLabel}
          style={inputStyles}
        />
        {labelText && (
          <LabelDom
            htmlFor={labelHtmlFor}
            color="ambience.10"
            placeholder={labelPlaceholder}
            floatLabel={floatLabel}
            value={value}
            aria-label={inputAriaLabel()}
          >
            {`${labelText}${isMandatory ? '*' : ''}`}
          </LabelDom>
        )}
        {password && value && value.length > 0 && (
          <ToggleShowPassword onClick={togglePassword}>
            <svg className="icon">
              <use />
            </svg>
          </ToggleShowPassword>
        )}
        {hasMsgIcon && (
          <i
            onClick={handleMsg}
            style={{
              fontSize: '24px',
              position: 'absolute',
              top: '20px',
              right: '40px',
              zIndex: 1,
              cursor: 'pointer',
            }}
            className="fa fa-send"
          />
        )}
        {state === 'error' && <InputError>{errorMsg}</InputError>}
      </InputWrapper>
    );
  }
);

const InputWrapper = styled.div<SpaceProps>`
  width: 100%;
  position: relative;
  border: 1px solid transparent;
  border-radius: 8px;
  font-family: 'Noto Sans', sans-serif;
  background: transparent;
`;
const InputDom = styled.input<CustomProps>`
  margin-bottom: 16px;
  color: ${({ theme }) => theme.colors.ambienceGrey[9]};
  width: 100%;
  outline: none;
  padding: 10px 15px;
  font-style: normal;
  font-size: 16px;
  line-height: 1.2;
  height: 60px;
  border-radius: 8px;
  transition: all 0.2s ease-in-out;
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  font-family: 'Noto Sans', sans-serif;
  appearance: none;
  background: transparent;
  border: 1.5px solid #d9e3e4;
  &:focus + label {
    font-size: 12px;
    top: 0;
    background: transparent;
    color: ${({ theme }) => theme.colors.ambience[13]};
    transition: 0.2s ease-in-out;
  }
  ${({ theme, value, labelText }) =>
    value !== '' &&
    labelText !== '' &&
    `
    padding-top:22px;
    padding-bottom: 8px;
    box-shadow: 0 20px 40px rgba(0, 143, 233, 0.07);
    + label{
      font-size:12px;
      top:0;
      background: transparent;
      color: ${theme.colors.ambience[13]};
      transition: 0.2s ease-in-out;
    }
  `}
  ${({ labelText }) =>
    labelText !== '' &&
    `&:focus {
    padding-top: 22px;
    padding-bottom: 8px;
    box-shadow: 0 20px 40px rgba(0, 143, 233, 0.07);
  }`}
  &::placeholder {
    color: ${(props) => props.theme.colors.ambience[13]};
  }
  ${({ floatLabel, theme }) =>
    floatLabel === true &&
    `
    padding-top: 22px;
    padding-bottom: 8px;
    &:focus + label{
      top:5px;
      color: ${theme.colors.ambienceGrey[13]};
    }
    `}
  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100% !important;
  }
`;
const LabelDom = styled.label<CustomProps>`
  position: absolute;
  left: 0px;
  text-align: left;
  transition: all 0.2s ease-in-out 0s;
  font-weight: normal;
  font-size: 16px;
  cursor: text;
  font-family: 'Noto Sans', sans-serif;
  bottom: 0px;
  padding: 8px 15px;
  width: 100%;
  word-break: break-word;
  z-index: 1;
  pointer-events: none;
  top: 10px;
  color: ${({ theme }) => theme.colors.ambience[10]};
`;
const InputError = styled.span`
  color: ${({ theme }) => theme.colors.semantic[1]};
  font-size: 12px;
  position: relative;
  top: -17px;
  left: 3px;
`;
const ToggleShowPassword = styled.span`
  position: absolute;
  top: 20px;
  right: 10px;
  z-index: 1;
  cursor: pointer;
  .icon {
    width: 24px;
    height: 24px;
    fill: ${({ theme }) => theme.colors.ambience[13]};
  }
  &:focus {
    outline: none;
  }
  &:focus-visible {
    outline: solid;
  }
`;
export default InputField;
