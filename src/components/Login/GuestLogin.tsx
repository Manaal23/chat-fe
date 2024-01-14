import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { SpaceProps, space } from 'styled-system';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ThreeDots } from 'react-loader-spinner';
import { debounce } from 'lodash';
import InputField from '../../atoms/Input/Input';
import { ageData } from '../../utils/constants';
import RadioButton from '../../atoms/RadioButton/RadioButton';
import useAxiosFetch from '../../common/useApiCall';
import { EndPoints } from '../../constants/endpoints';
import { setAuthUser } from '../../store/slices/authSlice';
import PrivateRoute from '../../common/privateRoutes';

interface GuestData {
  name: string;
  gender: string;
  age: number;
  country: string;
}

interface ErrorState {
  name?: {
    status: boolean;
    msg: string;
  };
  gender?: {
    status: boolean;
    msg: string;
  };
  age?: {
    status: boolean;
    msg: string;
  };
  country?: {
    status: boolean;
    msg: string;
  };
}

interface CustomProps {
  status?: boolean;
}

interface IUser {
  age: string;
  country: string;
  gender: string;
  name: string;
  token: string;
}

function GuestLogin() {
  const [guestDetails, setGuestDetails] = useState<GuestData>();
  const [errorMap, setErrorMap] = useState<ErrorState>();
  const [isBtnDisabled, setIsBtnDisabled] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [countryData, setCountry] = useState([]);
  useEffect(() => {
    (async () => {
      const da = await fetchData({
        method: 'GET',
        url: 'https://restcountries.com/v3.1/all?fields=name',
      });
      const result = [];
      da.map((_val) => {
        result.push(_val.name.common);
      });
      setCountry(result);
    })();
  }, []);

  const [data, error, loading, fetchData] = useAxiosFetch();

  const debouncedSearch = React.useRef(
    debounce(async (criteria: string) => {
      const result = await fetchData({
        method: 'GET',
        url: EndPoints.user.UNIQUE_NAME + `?value=${criteria}`,
        // headers: {
        //   Authorization: `Bearer ${localStorage.getItem('token')}`,
        // },
      });

      if (!result?.success) {
        setIsBtnDisabled(true);
        updateErrorMap('name', {
          status: true,
          msg: `${'Please enter unique name'}`,
        });
      } else {
        setIsBtnDisabled(false);
      }
    }, 500)
  ).current;

  const updateErrorMap = (
    key: string,
    value: { status?: boolean; msg?: string }
  ): void => {
    setErrorMap((preValue) => ({
      ...preValue,
      [key]: value,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    if (e.target.name === 'name') debouncedSearch(e.target.value);
    const { name, value } = e.target;
    setGuestDetails({ ...guestDetails, [name]: value });
    updateErrorMap(name, { status: false });
  };
  const validateGuestData = (): boolean => {
    let isValid: boolean = true;
    const regexString = /^[A-Za-z0-9]/;
    const mandatoryFields = ['name', 'gender', 'age', 'country'];
    mandatoryFields.forEach((key) => {
      if (!guestDetails || !guestDetails[key] || guestDetails[key] === '') {
        isValid = false;
        updateErrorMap(key, {
          status: true,
          msg: `${
            key === 'name'
              ? `${key} cannot not be empty.`
              : 'Please select the option.'
          }`,
        });
      }
      if (guestDetails && guestDetails?.name) {
        if (guestDetails?.name.length < 3 || guestDetails?.name.length > 12) {
          isValid = false;
          updateErrorMap('name', {
            status: true,
            msg: 'The name field must be at least 3 and atmost 12 characters in length.',
          });
        } else if (!regexString.test(guestDetails?.name)) {
          isValid = false;
          updateErrorMap('name', {
            status: true,
            msg: 'name should contains alphanumeric and underscore.',
          });
        }
      }
    });
    return isValid;
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (validateGuestData()) {
      setIsBtnDisabled(true);

      const userInfo = (await fetchData(
        {
          method: 'POST',
          url: EndPoints.auth.SIGNUP,
          data: {
            ...guestDetails,
          },
        },
        setAuthUser
      )) as unknown as string;
      setIsBtnDisabled(false);

      if (userInfo) {
        localStorage.setItem('token', userInfo);
        router.push('/preferences');
      }
    }
  };

  return (
    // <PrivateRoute>
    <Container>
      <Wrapper>
        <GuestLoginForm>
          <Heading mb="24px">Anonymous Registration</Heading>
          <InputField
            ref={inputRef}
            onChange={handleChange}
            name="name"
            value={guestDetails?.name || ''}
            id="name"
            labelPlaceholder="Choose your name"
            labelText="Choose your name"
            labelHtmlFor="name"
            placeholder=""
            required={false}
            maxLength={0}
            state={errorMap?.name?.status ? 'error' : 'normal'}
            errorMsg={errorMap?.name && errorMap?.name?.msg}
            ariaLabel={
              errorMap?.name?.status
                ? 'name Cannot be empty'
                : 'name, Mandotary Field'
            }
          />
          <GenderBox status={errorMap?.gender?.status}>
            <RadioButton
              changed={handleChange}
              id="Female"
              value="Female"
              isSelected={guestDetails?.gender === 'Female'}
              label=""
              name="gender"
              activeOnSelect
              alignment="top"
              radioLabel={false}
              parentStyles={{
                border: '1.5px solid #d9e3e4',
                borderRadius: '8px',
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                marginBottom: '0',
              }}
              childStyles={{
                display: 'flex',
                width: '100%',
                padding: '0',
              }}
            >
              <RadioLabel>
                Female
                <Image
                  src="/femaleAvatar.svg"
                  height={32}
                  width={32}
                  alt="female"
                />
              </RadioLabel>
            </RadioButton>
            <RadioButton
              changed={handleChange}
              id="Male"
              value="Male"
              isSelected={guestDetails?.gender === 'Male'}
              label=""
              name="gender"
              activeOnSelect
              alignment="top"
              radioLabel={false}
              parentStyles={{
                border: '1.5px solid #d9e3e4',
                borderRadius: '8px',
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                marginBottom: '0',
              }}
              childStyles={{
                display: 'flex',
                width: '100%',
                padding: '0',
              }}
            >
              <RadioLabel>
                Male
                <Image
                  src="/maleAvatar.svg"
                  height={32}
                  width={32}
                  alt="male"
                />
              </RadioLabel>
            </RadioButton>
            {errorMap?.gender?.status && (
              <InputError>{errorMap?.gender?.msg}</InputError>
            )}
          </GenderBox>
          <DropDown status={errorMap?.age?.status || errorMap?.country?.status}>
            <DropDownWrapper>
              <LabelText>Your age*</LabelText>
              <Arrow />
              <Select name="age" onChange={handleChange}>
                <option selected disabled hidden>
                  Select age
                </option>
                {ageData.map((_val) => (
                  <option key={_val} value={_val}>
                    {_val}
                  </option>
                ))}
              </Select>
              {errorMap?.age?.status && (
                <InputError>{errorMap?.age?.msg}</InputError>
              )}
            </DropDownWrapper>
            <DropDownWrapper>
              <LabelText>Country*</LabelText>
              <Arrow />
              <Select name="country" onChange={handleChange}>
                <option selected disabled hidden>
                  Select country
                </option>
                {countryData.map((_val) => (
                  <option key={_val} value={_val}>
                    {_val}
                  </option>
                ))}
              </Select>
              {errorMap?.country?.status && (
                <InputError>{errorMap?.country?.msg}</InputError>
              )}
            </DropDownWrapper>
          </DropDown>
          <SubmitBtn
            type="submit"
            disabled={isBtnDisabled}
            onClick={handleSubmit}
          >
            {loading ? (
              <ThreeDots
                height="50"
                width="50"
                radius="7"
                color="black"
                ariaLabel="three-dots-loading"
                visible
              />
            ) : (
              'Continue'
            )}
          </SubmitBtn>
        </GuestLoginForm>
      </Wrapper>
    </Container>
    // </PrivateRoute>
  );
}

export default GuestLogin;

const Container = styled.div`
  margin-bottom: 48px;
  width: 100%;
  // display: flex;
  // align-items: center;
  // justify-content: center;
`;
const GuestLoginForm = styled.div`
  padding: 20px 29px;
  margin: 0 auto;
  width: 470px;
  border: 1.5px solid #d9e3e4;
  box-sizing: border-box;
  box-shadow: 0 20px 40px rgba(0, 143, 233, 0.07);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  @media screen and (max-width: 640px) {
    width: 100%;
    border: none;
    box-shadow: none;
  }
`;

const Wrapper = styled.div`
  margin-top: 100px;
  @media screen and (max-width: 640px) {
    margin-top: 50px;
  }
`;

const Heading = styled.p<SpaceProps>`
  ${space}
  font-family: 'Noto Sans', sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 22px;
  line-height: 30px;
  text-align: center;
`;
const GenderBox = styled.div<CustomProps>`
  width: 100%;
  margin-bottom: ${({ status }) => (status ? '40px' : '16px')};
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: 'Noto Sans', sans-serif;
  gap: 1rem;
`;
const RadioLabel = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-left: 35px;
`;
const DropDown = styled.div<CustomProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
  position: relative;
  font-family: 'Noto Sans', sans-serif;
  margin-bottom: ${({ status }) => (status ? '40px' : '16px')};
`;
const DropDownWrapper = styled.div`
  position: relative;
  width: 100%;
  option {
    max-height: 300px;
    bottom: 100%;
  }
`;
const LabelText = styled.span`
  position: absolute;
  top: 4px;
  left: 12px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.ambience[13]};
  font-family: 'Noto Sans', sans-serif;
`;
const Arrow = styled.span`
  z-index: 1;
  position: absolute;
  top: 21px;
  right: 15px;
  box-sizing: border-box;
  height: 8px;
  width: 8px;
  border-style: solid;
  border-color: #475965;
  border-width: 0px 2px 2px 0px;
  cursor: pointer;
  transform: rotate(45deg);
  transition: border-width 150ms ease-in-out;
  @media screen and (max-width: 640px) {
    .arrow1 {
      left: 100;
    }
  }
`;
const Select = styled.select`
  font-family: 'Noto Sans', sans-serif;
  color: black;
  width: 100%;
  border-radius: 8px;
  border: 1.5px solid #d9e3e4;
  height: 55px;
  box-shadow: none;
  padding: 20px 28px 12px 12px;
  font-size: 14px;
  line-height: 1.5;
  transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
  appearance: none;
  cursor: pointer;
  background: transparent;
  &:focus {
    box-shadow: 0 20px 40px rgba(0, 143, 233, 0.07);
  }
  &:focus-visible {
    outline: none;
  }
`;

export const SubmitBtn = styled.button`
  color: white;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 14px 5px;
  font-style: normal;
  font-size: 16px;
  font-weight: 600;
  line-height: 125%;
  height: 50px;
  background: #008fe9;
  border: 1px solid transparent;
  border-radius: 8px;
  transition: all 0.3s ease 0s;
  cursor: pointer;
  position: relative;
  font-family: 'Noto Sans', sans-serif;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  &:focus-visible {
    outline: none;
  }
`;
const InputError = styled.span`
  color: ${({ theme }) => theme.colors.semantic[1]};
  font-size: 12px;
  position: absolute;
  bottom: -20px;
  left: 3px;
`;
