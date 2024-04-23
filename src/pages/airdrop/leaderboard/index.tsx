import { Box, HStack } from "@chakra-ui/react";
import { useState, useEffect, useRef, useMemo } from "react";

import { Router, useRouter } from "next/router";

export default function Rank() {
  const router = useRouter();

  useEffect(() => {
    router.push("/airdrop/leaderboard/1");
  }, [router]);

  return <Box></Box>;
}
