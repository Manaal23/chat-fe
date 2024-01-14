import React from 'react';
import styled from 'styled-components';
import { color } from 'styled-system';
import defaultTheme from '../../theme';
import { RadioBtnProps } from '../../interfaces/interface';

interface CustomRadioProps {
  isSelected?: boolean;
  activeOnSelect?: boolean;
  buttonAlignment?: string;
  alignment?: string;
  filledRadioColor?: string;
  radioIconColor?: string;
  radioStyles?: React.CSSProperties;
  labelStyles?: React.CSSProperties;
  hideRadio?: boolean;
  radioIconPosition?: string;
}

function RadioButton(props: RadioBtnProps) {
  const {
    id,
    changed,
    value,
    isSelected = false,
    label,
    isDisable = false,
    children = null,
    radioLabel = true,
    name = '',
    activeOnSelect,
    buttonAlignment = '',
    readOnly = false,
    alignment = 'center',
    filledRadioColor,
    parentStyles = {},
    className = '',
    labelStyle = {},
    hideRadio = false,
    labelColor = 'ambience.4',
    radioIconColor,
    radioIconPosition = '',
    childStyles = {},
  } = props;

  return (
    <Radio
      className={className}
      isSelected={isSelected}
      alignment={alignment}
      activeOnSelect={activeOnSelect}
      buttonAlignment={buttonAlignment}
      filledRadioColor={filledRadioColor}
      radioStyles={parentStyles}
      labelStyles={childStyles}
      hideRadio={hideRadio}
      radioIconColor={radioIconColor}
      radioIconPosition={radioIconPosition}
    >
      <LeftCol className="LeftCol">
        <input
          id={id}
          onChange={changed}
          value={value}
          type="radio"
          checked={isSelected}
          disabled={isDisable}
          name={name}
          readOnly={readOnly}
        />
        <label className={isDisable ? 'disableStyle' : undefined} htmlFor={id}>
          {!radioLabel && label}
          {radioLabel && (
            <RadioLabel style={labelStyle || {}} color={labelColor}>
              {label}
            </RadioLabel>
          )}
          {children}
        </label>
      </LeftCol>
    </Radio>
  );
}

const Radio = styled.div<CustomRadioProps>`
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  ${({ isSelected, activeOnSelect, theme, filledRadioColor }) =>
    isSelected &&
    activeOnSelect &&
    ` 
    border: 1px solid  ${
      filledRadioColor
        ? theme.colors.accentPrimary[1]
        : theme.colors.accentPrimary[0]
    };
    
    `}

  ${(props) => `
    display: ${props?.buttonAlignment === 'bottom' ? 'block' : 'flex'};  
    `}
    input[type='radio'] {
    display: none;
    &:checked + disbaled + label:before {
      border-color: ${({ theme, filledRadioColor }) =>
        filledRadioColor
          ? theme.colors.accentPrimary[1]
          : theme.colors.accentPrimary[0]};
    }
    &:checked + disbaled + label svg {
      fill: ${({ theme, filledRadioColor }) =>
        filledRadioColor
          ? theme.colors.accentPrimary[1]
          : theme.colors.accentPrimary[0]};
    }
    &:checked + disbaled + label:after {
      transform: translateY(-50%);
      display: block;
    }
    &:checked + label:before {
      border-color: ${({ theme, filledRadioColor }) =>
        filledRadioColor
          ? theme.colors.accentPrimary[1]
          : theme.colors.accentPrimary[0]};
    }
    &:checked + label svg {
      fill: ${({ theme, filledRadioColor }) =>
        filledRadioColor
          ? theme.colors.accentPrimary[1]
          : theme.colors.accentPrimary[0]};
    }
    &:checked + label:after {
      transform: translateY(-50%);
      display: block;
    }
  }
  > p {
    font-size: ${defaultTheme.fontSizes[1]};
    color: #a8a5b6;
    padding-left: 52px;
    margin-top: 8px;
    &.disable {
      opacity: 0.4;
    }
  }

  label {
    position: relative;
    font-size: ${defaultTheme.fontSizes[3]};
    font-family: 'Noto Sans', sans-serif;
    line-height: ${defaultTheme.lineHeights[3]};
    margin-bottom: 0;
    cursor: pointer;
    vertical-align: bottom;
    padding: 0 48px;
    ${({ labelStyles }) => labelStyles && labelStyles}
    ${({ hideRadio, radioIconPosition }) =>
      !hideRadio &&
      `
    &:before,
    &:after {
        content: '';
                position: absolute;
                top: ${
                  radioIconPosition && radioIconPosition.top
                    ? radioIconPosition.top
                    : '50%'
                };
                transform: translateY(-50%);
                border-radius: 50%;
                transition: all 0.3s ease;
                transition-property: transform, border-color;
            }
            `}
    &:before {
      left: 0;
      width: 18px;
      height: 18px;
      border: 2px solid ${({ theme }) => theme.colors.ambience[6]};
      top: 4px;
      transform: translateY(0);
    }
    &:after {
      left: 5px;
      width: 10px;
      height: 10px;
      background: ${({ theme, filledRadioColor }) =>
        filledRadioColor
          ? theme.colors.accentPrimary[1]
          : theme.colors.accentPrimary[0]};
      display: none;
      top: 15px;
      transform: translateY(0);
    }
    &.disableStyle {
      color: ${({ theme }) => theme.colors.ambience[0]} !important;
      opacity: 0.2;
      pointer-events: none;
    }
  }
  ${({ radioStyles }) => radioStyles && radioStyles}
`;

const RadioLabel = styled.span<CustomRadioProps>`
  ${color}
  font-size: 16px;
  line-height: 20px;
  font-family: ${defaultTheme.fonts.medium};
  margin-bottom: 8px;
  display: block;
  max-width: 300px;
`;

const LeftCol = styled.div`
  flex: 1;
  max-width: 585px;
`;
export default RadioButton;
