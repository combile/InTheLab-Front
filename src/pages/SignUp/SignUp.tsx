import React, { useState } from "react";
import { Platform, TouchableOpacity, View, ScrollView, Alert } from "react-native";
import styled from "styled-components/native";
import { InputField } from "../../components/Field";
import { DefaultButton } from "../../components";
import { Text } from "../../components";
import { Container } from "../../components";
import { NavigationBar } from "../../components/NavigationBar";
import { theme } from "../../styles/theme";
import Svg, { Path } from "react-native-svg";

const SignUpContainer = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`;

const HeaderContainer = styled.View`
  padding-top: 60px;
  padding-bottom: ${props => props.theme.spacing.md}px;
`;

const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-left: ${props => props.theme.spacing.md}px;
  padding-right: ${props => props.theme.spacing.md}px;
`;

const BackButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
`;

const HeaderContent = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const ProgressContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const ScrollContent = styled(ScrollView)`
  flex: 1;
`;

const ContentWrapper = styled.View`
  flex: 1;
  padding-top: ${props => props.theme.spacing.xl}px;
  padding-bottom: ${props => props.theme.spacing.xl}px;
  padding-left: ${props => props.theme.spacing.lg}px;
  padding-right: ${props => props.theme.spacing.lg}px;
`;

const Title = styled(Text)`
  font-size: ${props => props.theme.fontSize.xxl}px;
  font-weight: bold;
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.xl}px;
  font-family: ${props => props.theme.fonts.bold};
`;

const FormContainer = styled.View`
  flex-shrink: 1;
`;

const InputWrapper = styled.View`
  margin-bottom: ${props => props.theme.spacing.lg}px;
`;

const ButtonWrapper = styled.View`
  margin-top: ${props => props.theme.spacing.xl}px;
  margin-bottom: ${props => props.theme.spacing.md}px;
`;

const TermsContainer = styled.View`
  margin-top: ${props => props.theme.spacing.md}px;
`;

const TermsItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding-top: ${props => props.theme.spacing.md}px;
  padding-bottom: ${props => props.theme.spacing.md}px;
  padding-left: ${props => props.theme.spacing.sm}px;
  padding-right: ${props => props.theme.spacing.sm}px;
`;

const CheckboxContainer = styled.View<{ checked: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border-width: 2px;
  border-color: ${props => (props.checked ? props.theme.colors.primary : props.theme.colors.border)};
  background-color: ${props => (props.checked ? props.theme.colors.primary : "transparent")};
  align-items: center;
  justify-content: center;
  margin-right: ${props => props.theme.spacing.md}px;
`;

const TermsText = styled(Text)`
  flex: 1;
  font-size: ${props => props.theme.fontSize.md}px;
  color: ${props => props.theme.colors.text.primary};
`;

const ArrowIcon = styled.View`
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
`;

interface SignUpProps {
  onNavigateBack?: () => void;
  onSignUpSuccess?: () => void;
}

interface AccountInfo {
  id: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface PersonalInfo {
  name: string;
  phone: string;
  birthDate: string;
}

interface TermsAgreement {
  allAgreed: boolean;
  serviceTerms: boolean;
  privacyPolicy: boolean;
  locationService: boolean;
  age14: boolean;
  marketing: boolean;
}

export const SignUp = ({ onNavigateBack, onSignUpSuccess }: SignUpProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [accountInfo, setAccountInfo] = useState<AccountInfo>({
    id: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: "",
    phone: "",
    birthDate: "",
  });
  const [terms, setTerms] = useState<TermsAgreement>({
    allAgreed: false,
    serviceTerms: false,
    privacyPolicy: false,
    locationService: false,
    age14: false,
    marketing: false,
  });
  const [errors, setErrors] = useState<{
    account?: Partial<AccountInfo>;
    personal?: Partial<PersonalInfo>;
    terms?: string;
  }>({});
  const [validation, setValidation] = useState<{
    idAvailable?: boolean;
    emailAvailable?: boolean;
    passwordMatch?: boolean;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const formatPhoneNumber = (text: string) => {
    const numbers = text.replace(/[^\d]/g, "");
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  const formatBirthDate = (text: string) => {
    const numbers = text.replace(/[^\d]/g, "");
    if (numbers.length <= 4) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `${numbers.slice(0, 4)}-${numbers.slice(4)}`;
    } else {
      return `${numbers.slice(0, 4)}-${numbers.slice(4, 6)}-${numbers.slice(6, 8)}`;
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else if (onNavigateBack) {
      onNavigateBack();
    }
  };

  const validateStep1 = () => {
    const newErrors: Partial<AccountInfo> = {};
    let isValid = true;

    if (!accountInfo.id.trim()) {
      newErrors.id = "아이디를 입력해주세요";
      isValid = false;
    }

    if (!accountInfo.email.trim()) {
      newErrors.email = "이메일을 입력해주세요";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(accountInfo.email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다";
      isValid = false;
    }

    if (!accountInfo.password.trim()) {
      newErrors.password = "비밀번호를 입력해주세요";
      isValid = false;
    } else if (accountInfo.password.length < 8) {
      newErrors.password = "비밀번호는 8자 이상이어야 합니다";
      isValid = false;
    }

    if (!accountInfo.confirmPassword.trim()) {
      newErrors.confirmPassword = "비밀번호 확인을 입력해주세요";
      isValid = false;
    } else if (accountInfo.password !== accountInfo.confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다";
      isValid = false;
    }

    setErrors({ account: newErrors });
    return isValid;
  };

  const validateStep2 = () => {
    const newErrors: Partial<PersonalInfo> = {};
    let isValid = true;

    if (!personalInfo.name.trim()) {
      newErrors.name = "이름을 입력해주세요";
      isValid = false;
    }

    if (!personalInfo.phone.trim()) {
      newErrors.phone = "전화번호를 입력해주세요";
      isValid = false;
    }

    if (!personalInfo.birthDate.trim()) {
      newErrors.birthDate = "생년월일을 입력해주세요";
      isValid = false;
    }

    setErrors({ personal: newErrors });
    return isValid;
  };

  const validateStep3 = () => {
    if (!terms.serviceTerms || !terms.privacyPolicy || !terms.locationService || !terms.age14) {
      setErrors(prev => ({
        ...prev,
        terms: "필수 약관에 모두 동의해주세요",
      }));
      return false;
    }

    setErrors(prev => ({ ...prev, terms: undefined }));
    return true;
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      if (validateStep2()) {
        setCurrentStep(3);
      }
    } else if (currentStep === 3) {
      if (validateStep3()) {
        setIsLoading(true);
        // TODO: API 연동 후 회원가입 처리
        setTimeout(() => {
          setIsLoading(false);
          Alert.alert("회원가입 성공", "회원가입이 완료되었습니다.", [{ text: "확인", onPress: onSignUpSuccess }]);
        }, 1000);
      }
    }
  };

  const handleAllAgree = () => {
    const newValue = !terms.allAgreed;
    setTerms({
      allAgreed: newValue,
      serviceTerms: newValue,
      privacyPolicy: newValue,
      locationService: newValue,
      age14: newValue,
      marketing: newValue,
    });
  };

  const handleTermToggle = (key: keyof TermsAgreement) => {
    setTerms(prev => {
      const newTerms = { ...prev, [key]: !prev[key] };
      newTerms.allAgreed =
        newTerms.serviceTerms && newTerms.privacyPolicy && newTerms.locationService && newTerms.age14;
      return newTerms;
    });
  };

  const checkIdAvailability = async (id: string) => {
    if (id.length >= 3) {
      // TODO: API 연동 후 아이디 중복 확인
      // 임시로 사용 가능하다고 표시 (API 연동 후 실제 응답으로 교체)
      setValidation(prev => ({ ...prev, idAvailable: true }));
    } else {
      setValidation(prev => ({ ...prev, idAvailable: false }));
    }
  };

  const checkEmailAvailability = async (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
      // TODO: API 연동 후 이메일 중복 확인
      // 임시로 사용 가능하다고 표시 (API 연동 후 실제 응답으로 교체)
      setValidation(prev => ({ ...prev, emailAvailable: true }));
    } else {
      setValidation(prev => ({ ...prev, emailAvailable: false }));
    }
  };

  const checkPasswordMatch = (password: string, confirmPassword: string) => {
    if (confirmPassword.length > 0) {
      setValidation(prev => ({
        ...prev,
        passwordMatch: password === confirmPassword,
      }));
    } else {
      setValidation(prev => ({ ...prev, passwordMatch: undefined }));
    }
  };

  const renderStep1 = () => (
    <>
      <Title>계정 정보를 입력해 주세요</Title>
      <FormContainer>
        <InputWrapper>
          <InputField
            label="아이디"
            labelColor="rgba(25, 28, 50, 0.69)"
            placeholder="아이디를 입력해주세요"
            value={accountInfo.id}
            onChangeText={text => {
              setAccountInfo(prev => ({ ...prev, id: text }));
              if (text.length > 0) {
                checkIdAvailability(text);
              } else {
                setValidation(prev => ({ ...prev, idAvailable: undefined }));
              }
              if (errors.account?.id) {
                setErrors(prev => ({
                  ...prev,
                  account: { ...prev.account, id: undefined },
                }));
              }
            }}
            errorText={
              validation.idAvailable === false && accountInfo.id.length > 0
                ? "이미 사용 중인 아이디입니다"
                : errors.account?.id
            }
            successText={
              validation.idAvailable === true && accountInfo.id.length > 0 ? "사용 가능한 아이디입니다" : undefined
            }
            autoCapitalize="none"
            autoCorrect={false}
          />
        </InputWrapper>
        <InputWrapper>
          <InputField
            label="이메일"
            labelColor="rgba(25, 28, 50, 0.69)"
            placeholder="이메일을 입력해주세요"
            value={accountInfo.email}
            onChangeText={text => {
              setAccountInfo(prev => ({ ...prev, email: text }));
              if (text.length > 0) {
                checkEmailAvailability(text);
              } else {
                setValidation(prev => ({
                  ...prev,
                  emailAvailable: undefined,
                }));
              }
              if (errors.account?.email) {
                setErrors(prev => ({
                  ...prev,
                  account: { ...prev.account, email: undefined },
                }));
              }
            }}
            errorText={
              validation.emailAvailable === false && accountInfo.email.length > 0
                ? "이미 사용 중인 이메일입니다"
                : errors.account?.email
            }
            successText={
              validation.emailAvailable === true && accountInfo.email.length > 0
                ? "사용 가능한 이메일입니다"
                : undefined
            }
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </InputWrapper>
        <InputWrapper>
          <InputField
            label="비밀번호"
            labelColor="rgba(25, 28, 50, 0.69)"
            placeholder="비밀번호를 입력해주세요"
            value={accountInfo.password}
            onChangeText={text => {
              setAccountInfo(prev => ({ ...prev, password: text }));
              checkPasswordMatch(text, accountInfo.confirmPassword);
              if (errors.account?.password) {
                setErrors(prev => ({
                  ...prev,
                  account: { ...prev.account, password: undefined },
                }));
              }
            }}
            errorText={errors.account?.password}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
        </InputWrapper>
        <InputWrapper>
          <InputField
            label="비밀번호 확인"
            labelColor="rgba(25, 28, 50, 0.69)"
            placeholder="비밀번호를 다시 입력해주세요"
            value={accountInfo.confirmPassword}
            onChangeText={text => {
              setAccountInfo(prev => ({ ...prev, confirmPassword: text }));
              checkPasswordMatch(accountInfo.password, text);
              if (errors.account?.confirmPassword) {
                setErrors(prev => ({
                  ...prev,
                  account: { ...prev.account, confirmPassword: undefined },
                }));
              }
            }}
            errorText={
              validation.passwordMatch === false && accountInfo.confirmPassword.length > 0
                ? "비밀번호가 일치하지 않습니다"
                : errors.account?.confirmPassword
            }
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
        </InputWrapper>
      </FormContainer>
    </>
  );

  const renderStep2 = () => (
    <>
      <Title>개인 정보를 입력해 주세요</Title>
      <FormContainer>
        <InputWrapper>
          <InputField
            label="이름"
            labelColor="rgba(25, 28, 50, 0.69)"
            placeholder="이름을 입력해주세요"
            value={personalInfo.name}
            onChangeText={text => {
              setPersonalInfo(prev => ({ ...prev, name: text }));
              if (errors.personal?.name) {
                setErrors(prev => ({
                  ...prev,
                  personal: { ...prev.personal, name: undefined },
                }));
              }
            }}
            errorText={errors.personal?.name}
          />
        </InputWrapper>
        <InputWrapper>
          <InputField
            label="전화번호"
            labelColor="rgba(25, 28, 50, 0.69)"
            placeholder="전화번호를 입력해주세요"
            value={personalInfo.phone}
            onChangeText={text => {
              const formatted = formatPhoneNumber(text);
              setPersonalInfo(prev => ({ ...prev, phone: formatted }));
              if (errors.personal?.phone) {
                setErrors(prev => ({
                  ...prev,
                  personal: { ...prev.personal, phone: undefined },
                }));
              }
            }}
            errorText={errors.personal?.phone}
            keyboardType="phone-pad"
            maxLength={13}
          />
        </InputWrapper>
        <InputWrapper>
          <InputField
            label="생년월일"
            labelColor="rgba(25, 28, 50, 0.69)"
            placeholder="생년월일을 입력해주세요"
            value={personalInfo.birthDate}
            onChangeText={text => {
              const formatted = formatBirthDate(text);
              setPersonalInfo(prev => ({ ...prev, birthDate: formatted }));
              if (errors.personal?.birthDate) {
                setErrors(prev => ({
                  ...prev,
                  personal: { ...prev.personal, birthDate: undefined },
                }));
              }
            }}
            errorText={errors.personal?.birthDate}
            keyboardType="numeric"
            maxLength={10}
          />
        </InputWrapper>
      </FormContainer>
    </>
  );

  const renderStep3 = () => (
    <>
      <Title>원활한 서비스 이용을 위해{`\n`}필수 약관 동의가 필요해요</Title>
      <FormContainer>
        <TermsContainer>
          <TermsItem onPress={handleAllAgree}>
            <CheckboxContainer checked={terms.allAgreed}>
              {terms.allAgreed && (
                <Svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <Path
                    d="M13.3333 4L6 11.3333L2.66667 8"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              )}
            </CheckboxContainer>
            <TermsText weight="bold">모두 동의합니다.</TermsText>
          </TermsItem>
          <TermsItem onPress={() => handleTermToggle("serviceTerms")}>
            <CheckboxContainer checked={terms.serviceTerms}>
              {terms.serviceTerms && (
                <Svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <Path
                    d="M13.3333 4L6 11.3333L2.66667 8"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              )}
            </CheckboxContainer>
            <TermsText>(필수) 서비스 이용약관에 동의합니다.</TermsText>
            <ArrowIcon>
              <Svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <Path
                  d="M9 18L15 12L9 6"
                  stroke={theme.colors.text.secondary}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </ArrowIcon>
          </TermsItem>
          <TermsItem onPress={() => handleTermToggle("privacyPolicy")}>
            <CheckboxContainer checked={terms.privacyPolicy}>
              {terms.privacyPolicy && (
                <Svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <Path
                    d="M13.3333 4L6 11.3333L2.66667 8"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              )}
            </CheckboxContainer>
            <TermsText>(필수) 개인정보 처리방침에 동의합니다.</TermsText>
            <ArrowIcon>
              <Svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <Path
                  d="M9 18L15 12L9 6"
                  stroke={theme.colors.text.secondary}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </ArrowIcon>
          </TermsItem>
          <TermsItem onPress={() => handleTermToggle("locationService")}>
            <CheckboxContainer checked={terms.locationService}>
              {terms.locationService && (
                <Svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <Path
                    d="M13.3333 4L6 11.3333L2.66667 8"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              )}
            </CheckboxContainer>
            <TermsText>(필수) 위치기반 서비스 이용약관에 동의합니다.</TermsText>
            <ArrowIcon>
              <Svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <Path
                  d="M9 18L15 12L9 6"
                  stroke={theme.colors.text.secondary}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </ArrowIcon>
          </TermsItem>
          <TermsItem onPress={() => handleTermToggle("age14")}>
            <CheckboxContainer checked={terms.age14}>
              {terms.age14 && (
                <Svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <Path
                    d="M13.3333 4L6 11.3333L2.66667 8"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              )}
            </CheckboxContainer>
            <TermsText>(필수) 만 14세 이상입니다.</TermsText>
          </TermsItem>
          <TermsItem onPress={() => handleTermToggle("marketing")}>
            <CheckboxContainer checked={terms.marketing}>
              {terms.marketing && (
                <Svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <Path
                    d="M13.3333 4L6 11.3333L2.66667 8"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              )}
            </CheckboxContainer>
            <TermsText>(선택) 마케팅 정보 수신에 동의합니다.</TermsText>
          </TermsItem>
        </TermsContainer>
        {errors.terms && (
          <Text
            size={theme.fontSize.sm}
            color={theme.colors.status.error}
            style={{ marginTop: theme.spacing.sm }}
          >
            {errors.terms}
          </Text>
        )}
      </FormContainer>
    </>
  );

  return (
    <Container
      padding={0}
      backgroundColor={theme.colors.background}
    >
      <SignUpContainer>
        <HeaderContainer>
          <HeaderRow>
            <HeaderContent>
              <BackButton onPress={handleBack}>
                <Svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <Path
                    d="M15 18L9 12L15 6"
                    stroke={theme.colors.text.primary}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </BackButton>
              <ProgressContainer>
                <NavigationBar
                  currentStep={currentStep}
                  totalSteps={3}
                />
              </ProgressContainer>
              <View style={{ width: 40 }} />
            </HeaderContent>
          </HeaderRow>
        </HeaderContainer>
        <ScrollContent
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <ContentWrapper>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            <ButtonWrapper
              style={
                Platform.OS === "ios"
                  ? {
                      shadowColor: "rgba(104, 208, 198, 0.3)",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.1,
                      shadowRadius: 1,
                    }
                  : { elevation: 2 }
              }
            >
              <DefaultButton
                onPress={handleNext}
                fullWidth
                loading={isLoading}
                disabled={isLoading}
              >
                {currentStep === 3 ? "완료" : "다음"}
              </DefaultButton>
            </ButtonWrapper>
          </ContentWrapper>
        </ScrollContent>
      </SignUpContainer>
    </Container>
  );
};
