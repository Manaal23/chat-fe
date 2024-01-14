import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { RotatingLines } from 'react-loader-spinner';
import RadioButton from '../../atoms/RadioButton/RadioButton';
import { ageData } from '../../utils/constants';
import { EndPoints } from '../../constants/endpoints';
import useAxiosFetch from '../../common/useApiCall';
import { setUsersList } from '../../store/slices/authSlice';
import PrivateRoute from '../../common/privateRoutes';

interface PreferedData {
  gender: string;
  country: string;
  age: number;
}

export default function Preferences() {
  const [preferedData, setPreferedData] = useState<PreferedData>();
  const [data, error, loading, fetchData] = useAxiosFetch();
  const { usersList } = useSelector((state: any) => state.auth);
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
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setPreferedData({ ...preferedData, [name]: value });
  };

  const handleClick = async () => {
    await fetchData(
      {
        method: 'POST',
        url: EndPoints.user.SET_PREFERENCES,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        data: {
          ...preferedData,
        },
        // params: `page=${2}?limit=${10}`,
      },
      setUsersList
    );
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferences', JSON.stringify(preferedData));
      router.push('/dashboard');
    }
  };

  // useEffect(() => {
  //   if (usersList?.length) {
  //     router.push('/dashboard');
  //   }
  // }, [usersList]);

  return (
    <PrivateRoute>
      <WrapperContainer>
        {loading ? (
          <RotatingLines
            strokeColor="grey"
            strokeWidth="5"
            animationDuration="1.50"
            width="96"
            visible
          />
        ) : (
          <MainContainer>
            <QuestionHead>Whom you are looking for!</QuestionHead>
            {!preferedData?.gender && (
              <FieldBox>
                <RadioButton
                  changed={handleChange}
                  id="Female"
                  value="Female"
                  isSelected={preferedData?.gender === 'Female'}
                  label=""
                  name="gender"
                  activeOnSelect
                  alignment="top"
                  radioLabel={false}
                  hideRadio
                  parentStyles={{
                    border: 'none',
                    marginBottom: '0',
                  }}
                  childStyles={{
                    display: 'flex',
                    width: '100%',
                    padding: '0',
                  }}
                >
                  <RadioLabel>
                    <Image
                      src="/femaleAvatar.svg"
                      height={preferedData?.gender === 'Female' ? 55 : 50}
                      width={preferedData?.gender === 'Female' ? 55 : 50}
                      alt="female"
                    />
                  </RadioLabel>
                </RadioButton>
                <RadioButton
                  changed={handleChange}
                  id="Male"
                  value="Male"
                  isSelected={preferedData?.gender === 'Male'}
                  label=""
                  name="gender"
                  activeOnSelect
                  alignment="top"
                  radioLabel={false}
                  hideRadio
                  parentStyles={{
                    border: 'none',
                    marginBottom: '0',
                  }}
                  childStyles={{
                    display: 'flex',
                    width: '100%',
                    padding: '0',
                  }}
                >
                  <RadioLabel>
                    <Image
                      src="/maleAvatar.svg"
                      height={preferedData?.gender === 'Male' ? 55 : 50}
                      width={preferedData?.gender === 'Male' ? 55 : 50}
                      alt="male"
                    />
                  </RadioLabel>
                </RadioButton>
              </FieldBox>
            )}
            {preferedData?.gender && (
              <FieldBox style={{ gap: '1rem' }}>
                <DropDownWrapper>
                  <LabelText>Age*</LabelText>
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
                </DropDownWrapper>
              </FieldBox>
            )}
            {preferedData?.gender && (
              <PrimaryBtn onClick={handleClick}>Continue</PrimaryBtn>
            )}
          </MainContainer>
        )}
      </WrapperContainer>
    </PrivateRoute>
  );
}

const WrapperContainer = styled.div`
  width: 100%;
  background: url(chatting1.jpg);
  background-repeat: no-repeat;
  // min-height: 100vh;
  height: 90vh;
  overflow-y: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: 100% 100%;
  @media screen and (max-device-width: ${({ theme }) => theme.breakpoints.sm}) {
    background: url(chatting1-small.jpg);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    height: 78vh;
    margin-bottom: 16px;
  }
`;
const MainContainer = styled.div`
  width: 400px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 40px;
  border-radius: 8px;
`;
const RadioLabel = styled.span`
  width: 100%;
  padding: 12px;
  border-radius: 40px;
  background-color: rgba(255, 255, 255, 0.4);
`;
const QuestionHead = styled.h2`
  font-family: 'Noto Sans', sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 22px;
  line-height: 30px;
  color: white;
  text-align: center;
  margin: 0;
`;
const FieldBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3rem;
`;
const DropDownWrapper = styled.div`
  position: relative;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.4);
  border-radius: 8px;
  option {
    max-height: 300px;
    bottom: 100%;
  }
`;
const Select = styled.select`
  font-family: 'Noto Sans', sans-serif;
  color: black;
  width: 100%;
  border: none;
  height: 55px;
  box-shadow: none;
  padding: 20px 28px 12px 12px;
  font-size: 14px;
  line-height: 1.5;
  font-weight: 600;
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
const LabelText = styled.span`
  position: absolute;
  top: 4px;
  left: 12px;
  font-size: 12px;
  font-weight: 550;
  color: ${({ theme }) => theme.colors.ambienceGrey[15]};
  font-family: 'Noto Sans', sans-serif;
`;
const Arrow = styled.span`
  // z-index: 2;
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
const PrimaryBtn = styled.button`
  color: white;
  width: 100%;
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
