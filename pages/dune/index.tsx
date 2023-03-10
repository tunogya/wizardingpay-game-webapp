import Head from 'next/head'
import {Avatar, Button, HStack, Spacer, Stack, Text} from "@chakra-ui/react";
import {ChevronRightIcon} from "@chakra-ui/icons";
import {useRouter} from "next/router";
import {useCallback, useEffect, useState} from "react";
import axios from "axios";
import useTelegramUser from "../../hooks/useTelegramUser";

// telegram webapp
export default function Home() {
  const router = useRouter();

  const [state, setState] = useState<{ balance: number, level: number, }>({balance: 0, level: 1});
  const {userId} = router.query;
  const {user} = useTelegramUser(userId)

  const getUserInfo = useCallback(async () => {
    if (!userId) {
      return
    }
    try {
      const res = await axios({
        method: 'get',
        url: `/api/users/${userId}/address`,
      })
      if (res.data) {
        setState({
          balance: res.data.balance,
          level: res.data.level,
        })
      }
    } catch (e) {
      console.log(e)
    }
  }, [userId])

  useEffect(() => {
    getUserInfo();
  }, [getUserInfo])

  return (
    <Stack maxW={'container.sm'} w={'full'}>
      <Head>
        <title>Arrakis Dune</title>
        <meta name="description" content="Arrakis Dune"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="icon" href={"/favicon.ico"}/>
      </Head>
      <Stack p={3}>
        <HStack justifyContent={"space-between"}>
          <HStack spacing={3} borderRadius={'full'} bg={'#E9F9F7'}>
            <Avatar border={'2px solid white'} name={user.username || user.first_name || user.last_name || '-'}
                    boxShadow={"rgba(0,0,0,0.1) 0px 4px 12px 0px"} src={user.avatar_url}/>
            <Stack spacing={0} pr={8}>
              <Text fontSize={'14px'} fontWeight={'bold'}>{user.username ? `@${user.username}` : '-'}</Text>
              <Text fontSize={'12px'}>Level {state.level}</Text>
            </Stack>
          </HStack>
          <HStack spacing={3} borderRadius={'full'} bg={'#E9F9F7'}>
            <Stack w={'44px'} h={'44px'}></Stack>
            <Stack spacing={0} pr={8}>
              <Text fontSize={'14px'} fontWeight={'bold'}>Spice</Text>
              <Text fontSize={'12px'}>{state.balance}g</Text>
            </Stack>
          </HStack>
        </HStack>
        <Stack h={'700px'} w={'full'}>
          <Stack position={'relative'} top={'50px'} left={'240px'} spacing={0} borderRadius={'full'} bg={'#BFD5A3'}
                 w={'48px'} h={'48px'} alignItems={"center"} justify={"center"} boxShadow={"rgba(0,0,0,0.1) 0px 4px 12px 0px"}>
            <Text fontSize={'10px'}>Left</Text>
            <Text fontSize={'10px'} fontWeight={'semibold'}>23:12</Text>
          </Stack>
        </Stack>
      </Stack>
      {/*<Heading fontSize={'20px'}>News</Heading>*/}

      <Stack p={3}>
        <HStack justifyContent={"space-between"}>
          <Text fontSize={'16px'} fontWeight={'bold'}>Latest</Text>
          <Text>All <ChevronRightIcon/></Text>
        </HStack>
        <HStack justifyContent={'space-between'} p={3}>
          <HStack>
            <Stack spacing={-2} textAlign={"center"}>
              <Text fontSize={'16px'} fontWeight={'semibold'}>Today</Text>
              <Text fontSize={'14px'}>receive</Text>
            </Stack>
            <Text fontSize={'24px'} fontWeight={'semibold'}>300g</Text>
          </HStack>
          <Text fontSize={'12px'}>Collect friends: 188g</Text>
          <Text fontSize={'12px'}>Be charged: 46g</Text>
        </HStack>
        <HStack>
          <Avatar border={'2px solid white'} name='Dan Abrahmov' src='https://bit.ly/dan-abramov'/>
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
          <Text fontSize={'16px'} fontWeight={'bold'}>State</Text>
          <Spacer/>
          <HStack fontSize={'12px'}>
            <Text>Day</Text>
            <Text>Week</Text>
            <Text>Total</Text>
          </HStack>
        </HStack>
        <HStack>
          <Avatar border={'2px solid white'} name='Dan Abrahmov' src='https://bit.ly/dan-abramov'/>
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
