import {
  Button,
  chakra,
  HStack,
  shouldForwardProp, Spacer,
  Stack,
  Table,
  Tbody,
  Text,
  Wrap,
  WrapItem, Link
} from "@chakra-ui/react";
import TheHeader from "../../components/TheHeader";
import HistoryBall, {ResultType} from "../../components/Baccarat/HistoryBall";
import {useEffect, useMemo, useState} from "react";
import {isValidMotionProp, motion} from 'framer-motion'
import Cheque, {BaccaratBetType} from "../../components/Baccarat/Cheque";
import PickTokenModal from "../../components/Baccarat/PickTokenModal";
import {useRecoilState} from "recoil";
import {baccaratChequeAtom, ChequeType} from "../../state";
import {
  Address,
  useAccount,
  useBalance,
  useContractRead,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite, useWaitForTransaction
} from "wagmi";
import {AddressZero} from "@ethersproject/constants";
import ApproveERC20Button from "../../components/ApproveERC20Button";
import {BACCARAT_ADDRESS} from "../../constant/address";
import {BigNumber, ethers} from "ethers";
import {BACCARAT_ABI} from "../../constant/abi";
import LayoutItem from "../../components/Baccarat/LayoutItem";

const ChakraBox = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop),
})

const Baccarat = () => {
  const {chain} = useNetwork()
  const {address} = useAccount()
  const [pickedCheque, setPickedCheque] = useState(0);
  const [betType, setBetType] = useState<BaccaratBetType | null>(null);
  const [value, setValue] = useState(BigNumber.from(0));
  const [cheque, setCheque] = useState<ChequeType | undefined>(undefined)
  const {data: balanceData} = useBalance({
    chainId: chain?.id,
    address: address,
    token: cheque?.address === AddressZero ? undefined : cheque?.address,
    watch: true,
  });
  const [balanceAndCheques, setBalanceAndCheques] = useState(BigNumber.from(0));
  const [chequeTokenData] = useRecoilState(baccaratChequeAtom);
  const baccaratContract = {
    address: BACCARAT_ADDRESS[chain?.id || 5],
    abi: BACCARAT_ABI
  }
  const {data: chequesData} = useContractRead({
    ...baccaratContract,
    functionName: 'chequesOf',
    args: [address, cheque?.address],
    watch: true,
  })
  const {data: layoutData} = useContractRead({
    ...baccaratContract,
    functionName: 'layout',
    watch: true,
  })
  const {data: resultsData} = useContractRead({
    ...baccaratContract,
    functionName: 'results',
    watch: true,
  })
  const [layout, setLayout] = useState([])
  const [canSettle, setCanSettle] = useState(false)
  const [results, setResults] = useState<ResultType[]>([])

  useEffect(() => {
    if (resultsData) {
      // @ts-ignore
      setResults(resultsData)
    }
  }, [resultsData])

  useEffect(() => {
    if (chequeTokenData && chain) {
      if (chequeTokenData.chainId === chain.id) {
        setCheque(chequeTokenData)
      } else {
        setCheque({
          chainId: chain.id,
          address: AddressZero,
          decimals: chain.nativeCurrency.decimals,
          name: chain.nativeCurrency.name,
          symbol: chain.nativeCurrency.symbol,
        })
      }
    }
  }, [chequeTokenData, chain])

  useEffect(() => {
    if (layoutData) {
      // @ts-ignore
      setLayout(layoutData)
      // @ts-ignore
      setCanSettle(layoutData.length >= 2)
    }
  }, [layoutData])

  const _betType = useMemo(() => {
    switch (betType) {
      case BaccaratBetType.Banker:
        return 0;
      case BaccaratBetType.Player:
        return 1;
      case BaccaratBetType.Tie:
        return 2;
      case BaccaratBetType.BankerPair:
        return 3;
      case BaccaratBetType.PlayerPair:
        return 4;
      case BaccaratBetType.SuperSix:
        return 5;
      default:
        return 0;
    }
  }, [betType])
  const {config: actionConfig} = usePrepareContractWrite({
    ...baccaratContract,
    functionName: 'action',
    args: [cheque?.address, value, _betType],
    overrides: {
      value: cheque?.address === AddressZero ? BigNumber.from(value).sub(BigNumber.from(chequesData || 0)) : 0,
      gasLimit: BigNumber.from(200_000),
    },
  })
  const {data: actionData, write: actionWrite, status: actionStatus} = useContractWrite(actionConfig)
  const {status: actionStatus2} = useWaitForTransaction({
    hash: actionData?.hash,
  })
  const randomNumber = useMemo(() => {
    const randomBytes = ethers.utils.randomBytes(32)
    return BigNumber.from(randomBytes)
  }, [])
  const {config: settleConfig} = usePrepareContractWrite({
    ...baccaratContract,
    functionName: 'settle',
    args: [randomNumber],
    overrides: {
      gasLimit: BigNumber.from(1_000_000),
    }
  })
  const {data: settleData, write: settleWrite, status: settleStatus} = useContractWrite(settleConfig)
  const {status: settleStatus2} = useWaitForTransaction({
    hash: settleData?.hash,
  })
  const [contractLink, setContractLink] = useState('')

  useEffect(() => {
    if (actionStatus2 === 'success') {
      setBetType(null)
      setValue(BigNumber.from(0))
    }
  }, [actionStatus2])

  useEffect(() => {
    if (chain) {
      setContractLink(`${chain?.blockExplorers?.default.url}/address/${BACCARAT_ADDRESS[chain?.id || 5]}`)
    }
  }, [chain])

  useEffect(() => {
    if (balanceData && chequesData) {
      setBalanceAndCheques(BigNumber.from(balanceData.value).add(BigNumber.from(chequesData)))
    }
  }, [balanceData, cheque?.decimals, chequesData])

  const colors = ['#81E6D9', 'purple', 'orange', '#22543D', '#E53E3E']

  const cheques = useMemo(() => {
    if (cheque) {
      const all = [
        {
          label: '0.01', value: BigNumber.from(1).mul(BigNumber.from(10).pow(BigNumber.from(cheque.decimals - 2)))
        },
        {
          label: '0.1', value: BigNumber.from(1).mul(BigNumber.from(10).pow(BigNumber.from(cheque.decimals - 1)))
        },
        {
          label: '1', value: BigNumber.from(1).mul(BigNumber.from(10).pow(BigNumber.from(cheque.decimals)))
        },
        {
          label: '10', value: BigNumber.from(1).mul(BigNumber.from(10).pow(BigNumber.from(cheque.decimals + 1)))
        },
        {
          label: '100', value: BigNumber.from(1).mul(BigNumber.from(10).pow(BigNumber.from(cheque.decimals + 2)))
        },
        {
          label: '1K', value: BigNumber.from(1).mul(BigNumber.from(10).pow(BigNumber.from(cheque.decimals + 3)))
        },
        {
          label: '10K', value: BigNumber.from(1).mul(BigNumber.from(10).pow(BigNumber.from(cheque.decimals + 4)))
        },
        {
          label: '100K', value: BigNumber.from(1).mul(BigNumber.from(10).pow(BigNumber.from(cheque.decimals + 5)))
        },
        {
          label: '1M', value: BigNumber.from(1).mul(BigNumber.from(10).pow(BigNumber.from(cheque.decimals + 6)))
        },
        {
          label: '10M', value: BigNumber.from(1).mul(BigNumber.from(10).pow(BigNumber.from(cheque.decimals + 7)))
        },
        {
          label: '100M', value: BigNumber.from(1).mul(BigNumber.from(10).pow(BigNumber.from(cheque.decimals + 8)))
        },
        {
          label: '1B', value: BigNumber.from(1).mul(BigNumber.from(10).pow(BigNumber.from(cheque.decimals + 9)))
        }
      ]
      return all.filter((item) => {
        if (BigNumber.from(balanceAndCheques).gt(0)) {
          return BigNumber.from(item.value).lte(BigNumber.from(balanceAndCheques))
        }
        return false
      }).slice(-5)
    }
    return []
  }, [balanceAndCheques, cheque])

  const deal = (a: BaccaratBetType) => {
    if (!balanceData) {
      return;
    }

    if (betType === null) {
      if (BigNumber.from(balanceData.value).gte(BigNumber.from(value).add(BigNumber.from(cheques[pickedCheque].value)))) {
        setBetType(a);
        setValue(BigNumber.from(value).add(BigNumber.from(cheques[pickedCheque].value)));
      }
      return
    }
    if (betType === a) {
      if (BigNumber.from(balanceData.value).gte(BigNumber.from(value).add(BigNumber.from(cheques[pickedCheque].value)))) {
        setValue(BigNumber.from(value).add(BigNumber.from(cheques[pickedCheque].value)));
      }
    }
  }

  const formatValue = useMemo(() => {
    if (cheque) {
      return BigNumber.from(value).div(BigNumber.from(10).pow(cheque.decimals - 6)).toNumber() / 1_000_000
    }
    return 0
  }, [cheque, value])

  const getLayout = () => {
    return (
      <Stack w={'full'} border={'2px solid white'} spacing={0}>
        <HStack borderBottom={'1px solid white'} h={'80px'} spacing={0}>
          <Stack w={'70%'} h={'full'} borderRight={'1px solid white'} textAlign={"center"} justify={"center"}
                 cursor={'pointer'} userSelect={'none'} spacing={0} onClick={() => deal(BaccaratBetType.Tie)}>
            {betType === BaccaratBetType.Tie ? (
              <Cheque value={formatValue} odds={9}/>
            ) : (
              <>
                <Text color={'blue.200'} fontWeight={'bold'} fontSize={'3xl'}>T</Text>
                <Text color={'blue.200'} fontSize={'sm'}>1:8</Text>
              </>
            )}
          </Stack>
          <Stack w={'30%'} h={'full'} textAlign={"center"} justify={"center"} spacing={0}
                 cursor={'pointer'} userSelect={'none'} onClick={() => deal(BaccaratBetType.SuperSix)}>
            {betType === BaccaratBetType.SuperSix ? (
              <Cheque value={formatValue} odds={13}/>
            ) : (
              <>
                <Text color={'blue.200'} fontWeight={'bold'} fontSize={'3xl'}>6</Text>
                <Text color={'blue.200'} fontSize={'sm'}>1:12</Text>
              </>
            )}
          </Stack>
        </HStack>
        <HStack borderBottom={'1px solid white'} h={'160px'} spacing={0}>
          <Stack w={'70%'} h={'full'} borderRight={'1px solid white'} textAlign={"center"} justify={"center"}
                 cursor={'pointer'} userSelect={'none'} onClick={() => deal(BaccaratBetType.Banker)}
                 spacing={0}>
            {
              betType === BaccaratBetType.Banker ? (
                <Cheque value={formatValue} odds={1.95}/>
              ) : (
                <>
                  <Text color={'red.200'} fontWeight={'bold'} fontSize={'3xl'}>B</Text>
                  <Text color={'red.200'} fontSize={'sm'}>1:0.95</Text>
                </>
              )
            }
          </Stack>
          <Stack w={'30%'} h={'full'} textAlign={"center"} justify={"center"} spacing={0}
                 cursor={'pointer'} userSelect={'none'} onClick={() => deal(BaccaratBetType.BankerPair)}>
            {betType === BaccaratBetType.BankerPair ? (
              <Cheque value={formatValue} odds={12}/>
            ) : (
              <>
                <Text color={'red.200'} fontWeight={'bold'} fontSize={'3xl'} lineHeight={'34px'}>B PAIR</Text>
                <Text color={'red.200'} fontSize={'sm'}>1:11</Text>
              </>
            )}
          </Stack>
        </HStack>
        <HStack h={'160px'} borderBottom={'1px solid white'} spacing={0}>
          <Stack w={'70%'} h={'full'} borderRight={'1px solid white'} textAlign={"center"} justify={"center"}
                 cursor={'pointer'} userSelect={'none'} onClick={() => deal(BaccaratBetType.Player)}
                 spacing={0}>
            {betType === BaccaratBetType.Player ? (
              <Cheque value={formatValue} odds={2}/>
            ) : (
              <>
                <Text color={'blue.200'} fontWeight={'bold'} fontSize={'3xl'}>P</Text>
                <Text color={'blue.200'} fontSize={'sm'}>1:1</Text>
              </>
            )}
          </Stack>
          <Stack w={'30%'} h={'full'} textAlign={"center"} justify={"center"} spacing={0}
                 cursor={'pointer'} userSelect={'none'} onClick={() => deal(BaccaratBetType.PlayerPair)}>
            {betType === BaccaratBetType.PlayerPair ? (
              <Cheque value={formatValue} odds={12}/>
            ) : (
              <>
                <Text color={'blue.200'} fontWeight={'bold'} fontSize={'3xl'} lineHeight={'34px'}>P PAIR</Text>
                <Text color={'blue.200'} fontSize={'sm'}>1:11</Text>
              </>
            )}
          </Stack>
        </HStack>
        <Stack px={2} h={'320px'} alignItems={"center"} p={2}>
          <HStack justifyContent={"space-between"} w={'full'} spacing={0}>
            <Text fontWeight={'bold'} color={'blue.200'}>My Cheques</Text>
            <PickTokenModal/>
          </HStack>
          <Stack alignItems={"center"} justify={"center"} h={'full'}>
            <HStack spacing={'20px'}>
              {
                cheques.map((item, index) => (
                  <ChakraBox
                    key={index}
                    dragConstraints={{
                      top: -100,
                      left: -100,
                      right: 100,
                      bottom: 100,
                    }}
                    whileHover={{scale: 1.2, transition: {duration: 0.2}}}
                    whileTap={{scale: 0.9}}
                    whileDrag={{scale: 1.2}}
                    onDragEnd={
                      (event, info) => console.log(info.point.x, info.point.y)
                    }
                    drag={true}
                    bg={'white'}
                    w={'44px'}
                    h={'44px'}
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    border={`4px dashed ${colors[index % 5]}`}
                    borderRadius={'full'}
                    userSelect={'none'}
                    cursor={"pointer"}
                    boxShadow={'md'}
                    onClick={() => {
                      setPickedCheque(index)
                    }}
                  >
                    <Text fontWeight={'bold'} textDecoration={pickedCheque === index ? 'underline' : ''}
                          color={colors[index % 5]}>{item.label}</Text>
                  </ChakraBox>
                ))
              }
            </HStack>
            <Text fontSize={'2xl'} color={'blue.200'} fontWeight={'bold'} cursor={'pointer'}>
              {(BigNumber.from(balanceAndCheques).div(BigNumber.from(10).pow(cheque ? cheque.decimals - 6 : 0)).toNumber() / 1_000_000).toLocaleString()} {BigNumber.from(value).gt(0) && `- ${formatValue.toLocaleString()}`}
              {cheque && cheque.symbol}
            </Text>
          </Stack>
          <Spacer/>
          <HStack>
            {chain && cheque && cheque?.address !== AddressZero && address && (
              <ApproveERC20Button token={cheque?.address} owner={address} spender={BACCARAT_ADDRESS[chain.id]}
                                  spendAmount={value}/>
            )}
            {BigNumber.from(value).gt(0) && (
              <Button variant={"solid"} colorScheme={'blue'}
                      isLoading={actionStatus === 'loading' || actionStatus2 === 'loading'}
                      loadingText={'Pending...'}
                      onClick={() => actionWrite?.()}>
                Action
              </Button>
            )}
            {BigNumber.from(value).gt(0) && (
              <Button variant={"solid"} colorScheme={'red'}
                      onClick={() => {
                        setBetType(null)
                        setValue(BigNumber.from(0))
                      }}>
                Clear
              </Button>
            )}
          </HStack>
        </Stack>
      </Stack>
    )
  }

  const getActions = () => {
    return (
      <Stack w={'full'} border={'2px solid white'} overflow={'scroll'}>
        {
          layout?.length > 0 ? (
            <Table variant='striped' colorScheme='blackAlpha'>
              <Tbody>
                {
                  layout?.map((item: {
                    amount: BigNumber,
                    betType: BigNumber,
                    player: Address,
                    token: Address
                  }, index: number) => (
                    <LayoutItem key={index} index={index + 1} amount={item.amount} betType={item.betType}
                                player={item.player} token={item.token}/>
                  )).reverse()
                }
              </Tbody>
            </Table>
          ) : (
            <Text color={'blue.200'} fontWeight={'bold'} p={2}>No actions.</Text>
          )
        }
      </Stack>
    )
  }

  const getHistory = () => {
    return (
      <Wrap w={'full'} border={'2px solid white'} p={2}>
        {
          results.length > 0 ? results.map((item, index) => (
            <WrapItem key={index}>
              <HistoryBall index={index} result={item}/>
            </WrapItem>
          )).reverse() : (
            <Text color={'blue.200'} fontWeight={'bold'}>No history.</Text>
          )
        }
      </Wrap>
    )
  }

  const suttleButton = () => {
    return (
      <Button variant={"solid"} w={'120px'} colorScheme={'blue'}
              isLoading={settleStatus === 'loading' || settleStatus2 === 'loading'}
              loadingText={'Pending...'} disabled={!canSettle}
              onClick={() => settleWrite?.()}>
        Settle
      </Button>
    )
  }

  // @ts-ignore
  return (
    <Stack w={'full'} minH={'100vh'} spacing={0} overflow={'scroll'} bg={"blue.600"} align={"center"}>
      <TheHeader/>
      <Stack p={[2, 4, 6, 8]} w={['full', 'container.sm']} spacing={4} justify={"center"} align={"center"}>
        <HStack maxW={'container.sm'} w={'full'} justify={'space-between'}>
          <Text color={'white'} fontWeight={'bold'} fontSize={['md', 'xl', '2xl']}>
            Baccarat
          </Text>
          {suttleButton()}
        </HStack>
        {getActions()}
        {getLayout()}
        {getHistory()}
        <Text color={'blue.200'} fontSize={'xs'}>Contract: <Link isExternal textDecoration={'underline'}
                                                                 href={contractLink}>
          {BACCARAT_ADDRESS[chain?.id || 5]}
        </Link></Text>
        <Stack h={4}/>
      </Stack>
    </Stack>
  )
}

export default Baccarat