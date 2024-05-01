import React, { useCallback, useEffect, useState } from "react";
import { BaseModal, Avatar } from "components";
import {
  Box,
  Text,
  Button,
  Input,
  ModalFooter,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { useStore } from "store";
import api from "api";
import { useUserInfoStore } from "store/userInfoStore";

export function UploadAvatarModal() {
  const { setAvatarFile, avatarFile, setAvatar, setUserName, username } =
    useUserInfoStore();
  const { openUploadAvatarModal, showToast, setOpenUploadAvatarModal } =
    useStore();
  const [name, setName] = useState(username);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", avatarFile);
      const result: any = await api.post(`/api/auth/upload`, formData);
      if (result.code === 200 && result.data) {
        setAvatarFile(null);
        setAvatar(result?.data.avatar);
      }
    } catch (error) {
      showToast("Upload avatar error!", "danger");
      setIsLoading(false);
    }
  };

  const handleEdit = async () => {
    try {
      const result: any = await api.post(`/api/auth/update`, { name: name });
      if (result.code === 200) {
        setUserName(name);
        setName("");
      }
    } catch (error) {
      showToast("Edit username error!", "danger");
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    await handleUpload();
    await handleEdit();
    setOpenUploadAvatarModal(false);
    setIsLoading(false);
    showToast("Upload Success!", "success");
  };

  return (
    <BaseModal
      size="md"
      closeOnOverlayClick={false}
      isOpen={openUploadAvatarModal}
      onClose={() => {
        setOpenUploadAvatarModal(false);
      }}
      title=""
    >
      <Box w="full" alignItems="flex-start" p={3}>
        <Text w="full" align="center" fontWeight="bold" fontSize="16px" mb={7}>
          Edit Personal Information
        </Text>
        <HStack spacing={3} mb={3}>
          <Text w="60px" fontWeight="semibold">
            Avatar:
          </Text>
          <Avatar w={60} showUpload={true} />
        </HStack>
        <HStack spacing={3} mb={5}>
          <Text w="60px" fontWeight="semibold">
            Name:
          </Text>
          <Input
            w="240px"
            size="sm"
            value={name}
            maxLength={20}
            placeholder="Maximum 20 characters"
            onChange={(e) => setName(e.target.value)}
          />
        </HStack>
        <Button
          ml="72px"
          my={2}
          w="120px"
          isDisabled={isLoading || !name}
          variant="blackPrimary"
          size="sm"
          borderRadius="base"
          isLoading={isLoading}
          loadingText="Submitting..."
          onClick={handleUpdate}
        >
          Save
        </Button>
      </Box>
    </BaseModal>
  );
}
