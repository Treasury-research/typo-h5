import { Box, Image, Flex, Icon, HStack } from "@chakra-ui/react";
import { BiCamera, BiCopy } from "react-icons/bi";
import { MdPhotoCamera } from "react-icons/md";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { useUserInfoStore } from "store/userInfoStore";
import { Upload } from "antd";
import { useStore } from "store";
import { useEffect, useState } from "react";
import { baseURL } from "api";

const getBase64 = (img: any, callback: (url: string) => void) => {
  if (!img) {
    return;
  }
  try {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result as string));
    reader.readAsDataURL(img);
  } catch (error) {}
};

export const Avatar = ({
  w,
  showUpload,
}: {
  w?: number;
  showUpload?: boolean;
}) => {
  const { account, avatar, setAvatarFile, avatarFile } = useUserInfoStore();
  const { showToast } = useStore();
  // const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const beforeUpload = (file: any) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      showToast("You can only upload JPG/PNG file!", "warning");
    }
    const isLt500k = file.size / 1024 < 500;
    if (!isLt500k) {
      showToast("Image must smaller than 500K!", "warning");
      return
    }

    setAvatarFile(file);
    return isJpgOrPng && isLt500k;
  };

  useEffect(() => {
    getBase64(avatarFile, (url) => {
      console.log("imageUrl:", url);
      setImageUrl(url);
    });
  }, [avatarFile]);

  return (
    <Box
      w={`${w || 60}px`}
      h={`${w || 60}px`}
      overflow="hidden"
      borderRadius="full"
      pos="relative"
      shadow="md"
    >
      {imageUrl && showUpload ? (
        <Image src={imageUrl} w="full" h="full" alt="" />
      ) : (
        <Box>
          {avatar ? (
            <Image src={avatar} w="full" h="full" alt="" />
          ) : (
            <Jazzicon diameter={w || 60} seed={jsNumberForAddress(account)} />
          )}
        </Box>
      )}
      {showUpload && (
        <Flex
          justify="center"
          alignItems="center"
          pos="absolute"
          bottom="0"
          h="20px"
          w="full"
          bg="blackAlpha.600"
          cursor="pointer"
          overflow="hidden"
          className="upload-avatar"
        >
          <Upload
            name="file"
            listType="picture-circle"
            className="avatar-uploader"
            showUploadList={false}
            // action={`${baseURL}api/auth/upload`}
            beforeUpload={beforeUpload}
            // onChange={handleChange}
          >
            <Icon as={MdPhotoCamera} color="whiteAlpha.800" />
          </Upload>
        </Flex>
      )}
    </Box>
  );
};
