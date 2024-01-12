import {
  Flex,
  Image,
  Box
} from "@chakra-ui/react";
import { useQuoteStore } from "store/quoteStore";


export function QuoteTem({
  content,
  type,
  showDeleteIcon
}: {
  content: string;
  type: string;
  showDeleteIcon: boolean;
}) {
  const { setIsShowInputQuote,setQuoteContent,setQuoteType } = useQuoteStore();
  console.log('showDeleteIcon',showDeleteIcon)
  const getQuote = () => {
    if(content){
      let str = content.replace(/<span class="click-item-1 underline text-blue-600">|<\/span>/g, '');
      str = str.replace(/<span class="click-item-2 underline text-blue-600">|<\/span>/g, '');
      str = str.replace(/<span class="click-item-1">|<\/span>/g, '');
      str = str.replace(/<span class="click-item-2">|<\/span>/g, '');
      return str.slice(0, 34)
    }else{
      return ''
    }
  }

  return (
    <>
      <Box className="w-[fit-content] bg-[#EDF2F2] p-2 pl-3 pr-10 text-[#487C7E] relative rounded-[10px]">
        <Box className="mb-1">{content ? `${getQuote()}...` : '--'}</Box>
        <Flex className="items-center">
          <Image
            className="mr-1"
            src="/images/typo-small.png"
            alt=""
          />
          <Box>{type}</Box>
        </Flex>
        {
          showDeleteIcon &&
          <Image
            className="absolute right-3 top-5 cursor-pointer hover:opacity-70"
            onClick={() => {
              setIsShowInputQuote(false)
              setQuoteContent('')
              setQuoteType('')
            }}
            src="/images/chat-delete.png"
            alt=""
          />
        }
      </Box>
    </>
  );
}
