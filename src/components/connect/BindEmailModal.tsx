import React, { useCallback, useEffect, useState } from "react";
import { BaseModal } from "components";
import {
  Button,
  Input,
  InputGroup,
  InputLeftAddon,
  ModalFooter,
} from "@chakra-ui/react";
import { useStore } from "store";
import * as EmailValidator from "email-validator";
import api from "api";
import { useUserInfoStore } from "store/userInfoStore";

export function BindEmailModal() {
  const {
    openBindEmailModal,
    setOpenBindEmailModal,
    setOpenVerificationEmailModal,
    setEmail,
    email,
  } = useStore();
  const { showToast } = useStore();
  const [invalidEmail, setInvalidEmail] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleResend = useCallback(async () => {
    setIsLoading(true);
    try {
      const result: any = await api.post(`/api/auth/sendEmail`, {
	email,
      });
      if (result.code === 200) {
	setOpenBindEmailModal(false);
	setOpenVerificationEmailModal(true);
      } else {
	showToast(result.data?.errorMsg || "Bind error!", "danger");
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }, [email, setOpenBindEmailModal, setOpenVerificationEmailModal]);

  useEffect(() => {
    if (!email) return;
    const isValid = EmailValidator.validate(email);
    setInvalidEmail(!isValid);
  }, [email]);

  return (
    <BaseModal
      size="xl"
      isOpen={openBindEmailModal}
      onClose={() => {
	setOpenBindEmailModal(false);
      }}
      closeOnOverlayClick={false}
      title="Verify Email"
      footer={
	<ModalFooter>
	  <Button
	    variant="blackPrimary"
	    isLoading={isLoading}
	    loadingText="submitting..."
	    isDisabled={!email || invalidEmail}
	    size="sm"
	    borderRadius="base"
	    onClick={() => {
	      handleResend();
	    }}
	  >
	    Submit
	  </Button>
	</ModalFooter>
      }
      isCentered={true}
    >
      <>
	<InputGroup mt={2}>
	  <InputLeftAddon
	    w="70px"
	    height="40px"
	    bg="#fff"
	    border="1px solid #C7C9D8"
	    justifyContent="center"
	  >
	    Email
	  </InputLeftAddon>
	  <Input
	  type="email"
	  placeholder="Please enter your email"
	  height="40px"
	  onChange={(e) => {
	    setEmail(e.target.value);
	  }}
	  />
	</InputGroup>
	{invalidEmail ? (
	  <div className="text-[#FF0000] text-xs font-swiss mt-2">
	    Invalid email address. Only use numbers, letters, or +-_ characters.
	  </div>
	) : null}
      </>
    </BaseModal>
  );
}
