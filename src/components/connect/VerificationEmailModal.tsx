import React, { useCallback, useEffect, useState } from "react";
import { BaseModal } from "components";
import { Button, ModalFooter } from "@chakra-ui/react";
import { useStore } from "store";
import api from "api";
import { useUserInfoStore } from "store/userInfoStore";

export function VerificationEmailModal() {
  const { openVerificationEmailModal, setOpenVerificationEmailModal, email } =
    useStore();
  const { setEmail } = useUserInfoStore();
  const [timeLeft, setTimeLeft] = useState<number>(10);
  const [text, setText] = useState("Resend");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(
      () => setTimeLeft((prevTimeLeft) => prevTimeLeft - 1),
      1000
    );
    return () => clearInterval(interval);
  }, []);

  const handleResend = useCallback(async () => {
    setIsLoading(true);
    try {
      const result: any = await api.post(`/api/auth/sendEmail`, {
	email,
      });
      if (result.code === 200) {
	setTimeLeft(60);
	setIsLoading(false);
      }
      setIsLoading(false);
      setTimeLeft(60);
    } catch (error) {
      setIsLoading(false);
    }
  }, [email]);

  const getEmailStatus = async () => {
    const res: any = await api.get(`/api/auth`);
    if (res?.code === 200) {
      setEmail(res?.data?.email);
    }
  };

  return (
    <BaseModal
      size="md"
      closeOnOverlayClick={false}
      isOpen={openVerificationEmailModal}
      onClose={() => {
	getEmailStatus();
	setOpenVerificationEmailModal(false);
	setTimeLeft(60);
      }}
      title="Emall verification"
      footer={
	<ModalFooter>
	  <Button
	    isDisabled={isLoading || timeLeft > 0}
	    variant="blackPrimary"
	    size="sm"
	    borderRadius="base"
	    isLoading={isLoading}
	    loadingText="submitting..."
	    onClick={() => {
	      if (timeLeft > 0) return;
	      handleResend();
	    }}
	  >
	    {timeLeft > 0 ? `Email Sent (${timeLeft})` : text}
	  </Button>
	</ModalFooter>
      }
      isCentered={true}
    >
      <span>
	Please click on the link you received in the email{" "}
	<span className="font-medium">{email}</span>,the link is valid for 30
    mintes{" "}
      </span>
    </BaseModal>
  );
}
