import Wallet from '../utils/wallet'
import {PermissionsAndroid, Text} from "react-native";
import {Toast} from "@ant-design/react-native";
import React from "react";

const haveThisWallet = (arr, name) => {
  let have = [];
  arr.forEach(u => {
    have.push(u.name)
  })
  return have.includes(name)
}
const writeToArr = (arr, wallet_name, symbol, address, keyid, required_sign) => {
  arr.forEach(u => {
    if (u.name === symbol) {
      u.arr.push({wallet_name, address, keyid, required_sign})
    }
  })
}
const delSame = (arr, key) => {
  if (key.length > 0) {
    const i = key[0].hash || key[0].txHash;
    let arrs = [];
    arr.forEach(u => {
      const ui = u.hash || u.txHash;
      arrs.push(ui)
    })
    return !arrs.includes(i)
  }
}
export default {
  namespace: 'home',
  state: {
    walletNickName: '',
    setNickName: '',
    //  是否备份
    isIdentity: false,
    //  显示获取权限
    visible: false,
    PERMISSIONS: [],
    Wallet: Wallet,
    //  创建表单
    createUserForm: {
      username: '',
      password: '',
      passwordTwo: ''
    },
    //  恢复表单
    RestoreUserForm: {
      username: '',
      mnemonicWord: '',
      password: '',
      passwordTwo: ''
    },
    //  钱包配置 --//  创建钱包--普通钱包
    walletConfig: {
      walletName: '',
      cointype:　''
    },
    //  多重签名
    MultiSignature: {
      cointype: '',
      wallet_name: '',
      nKeys: 4,
      nRequired: 2,
    },
    //  加入分享
    joinShare: {
      barcode: ''
    },
    //  备份助记词
    mnemonic: '',
    mnemonics: [],
    copyM: [],
    //  密码进入
    enterPassword: '',
    //  币种type
    coinTypes: [],
    //  钱包首页列表
    walletArr: [],
    //  钱包首页的loading
    homeLoading: false,
    //  钱包详情的loading: false
    detailLoading: false,
    detailLoading1: false,
    //  钱包的分页
    walletDetail: {
      deposit: {}, withdraw: {}
    },
    //  充值
    depositArr: [],
    //  提现
    withdrawArr: [],
    activeTab: 0,
    //  多重签名状态
    MultiSignatureStatus: {
      join_barcode: '',
      number_of_multisign: 4,
      required_sign: 2,
      status: []
    },
    //  余额
    assets: [],
    //  转账
    feemode: 'MIDDLE',
    address: '',
    amount: '',
    //  交易详情
    transactionData: {},
    //  钱包数据
    walletItem: {},
    getBlance_loading: false,
    coin: {},
    identity: '',
    //  备份
    NextText: '下一步',
    haveMnemonic: false,
  },
  effects: {
    * getWalletList ({payload}, {call, put, select}) {
      yield put({
        type: 'updateState',
        payload: {
          homeLoading: true,
        }
      });
      const {coinTypes} = yield select(state => state.home);
      const res = yield call(Wallet.list_wallets);
      let arr = [];
      if (!Array.isArray(res.wallets)) {
        const msg = res.errmsg ? `, ${res.errmsg}` : '';
        Toast.fail('查询列表失败' + msg, 2)
      }
      for(let i = 0; i < res.wallets.length; i++) {
        coinTypes.forEach(t => {
          //  把地址写入钱包
          if (res.wallets[i].cointype === t.type) {
            const {wallet_name, address, keyid, required_sign} = res.wallets[i];
            //  先要判断是否有这个钱包
            if (haveThisWallet(arr, t.symbol)) {
              //  写入arr
              writeToArr(arr, wallet_name, t.symbol, address, keyid, required_sign)
            } else {
              arr.push({
                name: t.symbol,
                show: false,
                arr: [{
                  wallet_name, address, keyid, required_sign
                }]
              })
            }
          }
        })
      }
      yield put({
        type: 'updateState',
        payload: {
          walletArr: arr,
          homeLoading: false,
        }
      });
    },
    * getPERMISSIONS ({payload}, {call, put, select}) {
      const WRITE = yield call(PermissionsAndroid.check, PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
      const READ = yield call(PermissionsAndroid.check, PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
      const CAMERA = yield call(PermissionsAndroid.check, PermissionsAndroid.PERMISSIONS.CAMERA);
      yield put({
        type: 'updateState',
        payload: {
          PERMISSIONS: [
            {icon: 'camera', til: '相机授权', load: CAMERA ? 'duihao' : ''},
            {icon: 'edit', til: '写外部存储器授权', load: WRITE ? 'duihao' : ''},
            {icon: 'snippets', til: '读取外部存储器授权', load: READ ? 'duihao' : ''},
          ],
          visible: !(WRITE && READ && CAMERA),
        }
      });
    },
    * getWalletDetail ({payload}, {call, put, select}) {
      const {coinid, wallet, obj, isRefresh} = payload;
      const loadingObj = isRefresh ? {detailLoading1: true,} : {detailLoading: true,}
      const loadingObj1 = isRefresh ? {detailLoading1: false,} : {detailLoading: false,}
      yield put({
        type: 'updateState',
        payload: {
          walletDetail: obj,
          ...loadingObj
        }
      });
      const {Wallet, depositArr, withdrawArr, activeTab} = yield select(state => state.home);
      let copyDepositArr = [];
      let copyWithdrawArr = [];
      copyDepositArr = isRefresh ? [] : depositArr;
      copyWithdrawArr = isRefresh ? [] : withdrawArr;
      const res = yield call(Wallet.get_deposit_history, {coinid, wallet, ...obj.deposit});
      if (res.success) {
        if (res.tx.length === 0) {
          obj.deposit.pagenum === 0 && activeTab === 0 && Toast.info('转入无数据', 1);
          copyDepositArr.length > 0 && Toast.info('您已经刷到底了...');
        } else {
          if (delSame(copyDepositArr, res.tx)) {
            yield put({
              type: 'updateState',
              payload: {
                depositArr: copyDepositArr.concat(res.tx),
              }
            })
          }
        }
      } else {
        Toast.fail('请求转入错误', 2)
      }
      const resW = yield call(Wallet.get_withdraw_history, {coinid, wallet, ...obj.withdraw});
      if (resW.success) {
        if (resW.tx.length === 0) {
          obj.withdraw.pagenum === 0 && activeTab === 1 && Toast.info('转出无数据', 1);
          copyWithdrawArr.length > 0 && Toast.info('您已经刷到底了...', 2);
        } else {
          if (delSame(copyWithdrawArr, resW.tx)) {
            yield put({
              type: 'updateState',
              payload: {
                withdrawArr: copyWithdrawArr.concat(resW.tx)
              }
            })
          }
        }
      } else {
        Toast.fail('请求转出错误', 2)
      }
      yield put({
        type: 'updateState',
        payload: {
          ...loadingObj1
        }
      });
    },
    * getMultiSignatureStatus ({payload}, {call, put, select}) {
      const {Wallet, MultiSignature} = yield select(state => state.home);
      const res = yield call(Wallet.join_status, payload.res.join_barcode);
      if (!res.success) {
        const msg = res.errmsg ? `, ${res.errmsg}` : '';
        // alert('getMultiSignatureStatus')
        Toast.fail('获取多重签名status失败' + msg, 2)
        return
      }
      yield put({
        type: 'updateState',
        payload: {
          MultiSignatureStatus: {
            join_barcode: payload.res.join_barcode,
            number_of_multisign: payload.res.number_of_multisign,
            required_sign: payload.res.required_sign,
            status: res.status
          }
        }
      });
      payload.navigation.navigate('getWalletName', {name: payload.res});
    },
    * getMultiSignatureStatus2 ({payload}, {call, put, select}) {
      const {Wallet} = yield select(state => state.home);
      const res = yield call(Wallet.join_status, payload.wallet);
      if (!res.success) {
        const msg = res.errmsg ? `, ${res.errmsg}` : '';
        // alert('getMultiSignatureStatus2');
        Toast.fail('获取多重签名status失败' + msg, 2);
        return
      }
      yield put({
        type: 'updateState',
        payload: {
          MultiSignatureStatus: {
            join_barcode: res.join_barcode,
            number_of_multisign: res.number_of_multisign,
            required_sign: res.required_sign,
            status: res.status
          }
        }
      });
      !payload.notGoGet && payload.navigation && payload.navigation.navigate('getWalletName', {name: payload.wallet});
    },
    * getCoinTypes ({payload}, {call, put, select}) {
      const {Wallet} = yield select(state => state.home);
      const res = yield call(Wallet.get_supported_coin_type, '');
      if (res.cointype) {
        yield put({
          type: "updateState",
          payload: {
            coinTypes: res.cointype
          }
        })
      } else {
        const msg = res.errmsg ? `, ${res.errmsg}` : '';
        Toast.fail('获取货币失败' + msg, 2)
      }
    },
    * getWithdrawDetail ({payload}, {call, put, select}) {
      const {Wallet} = yield select(state => state.home);
      const res = yield call(Wallet.get_withdraw_detail, payload);
      if (!res.success) {
        const msg = res.errmsg ? `, ${res.errmsg}` : '';
        Toast.fail('获取交易详情失败' + msg, 2)
      } else {
        yield put({
          type: 'updateState',
          payload: {
            transactionData: res.detail
          }
        });
      }
    },
    * get_balance({payload}, {call, put, select}) {
      const {Wallet, walletItem} = yield select(state => state.home);
      yield put({
        type: 'updateState',
        payload: {getBlance_loading: true, assets: []}
      })
      const res = yield call(Wallet.get_balance, walletItem);
      if (res.success) {
        yield put({
          type: 'updateState',
          payload: {assets:res.info, getBlance_loading: false}
        })
      } else {
        const msg = res.errmsg ? `, ${res.errmsg}` : '';
        Toast.fail('钱包数据请求失败' + msg, 2)
      }
    },
    * getThisWalletBlance({payload}, {call, put, select}) {
      const {Wallet, walletItem, coin} = yield select(state => state.home);
      const res = yield call(Wallet.get_balance, walletItem);
      res && res.info && res.info.length > 0 && res.info.forEach(u => {
        if (u.coinId === coin.coinId) {
          coin.availableAmount = u.availableAmount
        }
      })
      yield put({
        type: 'updateState',
        payload: {coin}
      })
    }
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },
}
