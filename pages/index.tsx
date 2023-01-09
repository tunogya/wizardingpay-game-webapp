import Head from 'next/head'
import {Avatar, Button, Heading, HStack, Spacer, Stack, Text} from "@chakra-ui/react";
import {ChevronRightIcon} from "@chakra-ui/icons";

export default function Home() {
  return (
    <Stack maxW={'container.sm'} w={'full'}>
      <Head>
        <title>Arrakis Dune</title>
        <meta name="description" content="Arrakis Dune" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Stack p={3}>
        <Heading fontSize={'16px'}>Arrakis Dune</Heading>
        <HStack justifyContent={"space-between"}>
          <HStack spacing={3} borderRadius={'full'} bg={'#E9F9F7'}>
            <Avatar border={'2px solid white'} name='Dan Abrahmov' src='https://bit.ly/dan-abramov' />
            <Stack spacing={0} pr={8}>
              <Text fontSize={'14px'} fontWeight={'bold'}>tunogya</Text>
              <Text fontSize={'12px'}>Level 6</Text>
            </Stack>
          </HStack>
          <HStack spacing={3} borderRadius={'full'} bg={'#E9F9F7'}>
            <Avatar border={'2px solid white'} name='Dan Abrahmov' src='https://bit.ly/dan-abramov' />
            <Stack spacing={0} pr={8}>
              <Text fontSize={'14px'} fontWeight={'bold'}>Spice</Text>
              <Text fontSize={'12px'}>277g</Text>
            </Stack>
          </HStack>
        </HStack>
        <Stack h={'700px'} w={'full'}>
          <Stack position={'relative'} top={'50px'} left={'240px'} spacing={0} borderRadius={'full'} bg={'#BFD5A3'} w={'48px'} h={'48px'} alignItems={"center"} justify={"center"}>
            <Text fontSize={'10px'}>Left</Text>
            <Text fontSize={'10px'} fontWeight={'semibold'}>23:12</Text>
          </Stack>
        </Stack>
      </Stack>
      {/*<Heading fontSize={'20px'}>News</Heading>*/}

      <Stack p={3}>
        <HStack justifyContent={"space-between"}>
          <Heading fontSize={'16px'}>Latest</Heading>
          <Text>All <ChevronRightIcon/></Text>
        </HStack>
        <HStack justifyContent={'space-between'}>
          <HStack>
            <Stack spacing={-2} textAlign={"center"}>
              <Text fontSize={'18px'} fontWeight={'semibold'}>Today</Text>
              <Text fontSize={'14px'}>receive</Text>
            </Stack>
            <Text fontSize={'24px'} fontWeight={'semibold'}>300g</Text>
          </HStack>
          <Text fontSize={'12px'}>Collect friends: 188g</Text>
          <Text fontSize={'12px'}>Be charged: 46g</Text>
        </HStack>
        <HStack>
          <Avatar border={'2px solid white'} name='Dan Abrahmov' src='https://bit.ly/dan-abramov' />
          <Stack spacing={0}>
            <Text fontSize={'14px'}>tunogya was charged 32g by you</Text>
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            <Text fontSize={'10px'}>today's generous </Text>
          </Stack>
          <Spacer/>
          <Button size={'sm'}>
            Thx
          </Button>
        </HStack>
      </Stack>

      <Stack p={3}>
        <HStack>
          <Heading fontSize={'16px'}>State</Heading>
          <Spacer/>
          <HStack fontSize={'12px'}>
            <Text>Day</Text>
            <Text>Week</Text>
            <Text>Total</Text>
          </HStack>
        </HStack>
        <HStack>
          <Avatar border={'2px solid white'} name='Dan Abrahmov' src='https://bit.ly/dan-abramov' />
          <Stack spacing={0}>
            <Text fontSize={'14px'}>tunogya</Text>
            <Text fontSize={'12px'}>Level 6</Text>
          </Stack>
          <Spacer/>
          <Text fontSize={'14px'}>343g</Text>
        </HStack>
      </Stack>

    </Stack>
  )
}