import WalletModule from './rnwallet';

let module_inited = false;
console.log('WalletModule starting')

const test_server = 'https://customer-test.chainspay.com/';
const server = 'https://customer.chainspay.com/';
const local_test = 'http://192.168.0.57:8081/';

WalletModule.init_library(server, () => {
    console.log('WalletModule inited');
    module_inited = true;
});

async function nano_sleep()
{
    return new Promise( (resolve, reject)=>{
        setTimeout(() => {
            resolve();
        }, 16);
    });
}

async function rn_invoke_cpp_method(cppmethod, param) {
    param.method = cppmethod;

    while (!module_inited)
        await nano_sleep();


    const body = await WalletModule.invoke_cpp_method(cppmethod, JSON.stringify(param));

    let r = JSON.parse(body);

    r.errmsg = r.msg;
    return r;
}

export default {

    KEY_TYPE_BTC: 0x0000000,
    KEY_TYPE_LTC: 0x0000002,
    KEY_TYPE_DOGE: 0x0000003,
    KEY_TYPE_DASH: 0x0000005,
    KEY_TYPE_ETH: 0x000003c,
    KEY_TYPE_BCH: 0x0000091,
    KEY_TYPE_EOS: 0x00000c2,
    KEY_TYPE_BHD: 0x050194a,
    KEY_TYPE_RCOIN: 0x5f566ff,
    KEY_TYPE_ECOIN: 0x5f588ff,

    async get_supported_coin_type() {
        return await rn_invoke_cpp_method('get_supported_coin_type', {});
    },
    async is_identity_exist() {
        return await rn_invoke_cpp_method('is_identity_exist', {});
    },
    async destroy_identity() {
        return await rn_invoke_cpp_method('destroy_identity', {});
    },
    async createIdentity({ username, password }) {
        return await rn_invoke_cpp_method('createIdentity', { nick: username, passphase: password });
    },
    async openIdentity({ password }) {
        return await rn_invoke_cpp_method('openIdentity', { passphase: password });
    },
    async recoverIdentity({ username, mnemonic, password }) {
        return await rn_invoke_cpp_method('recoverIdentity', { nick: username, mnemonic: mnemonic, passphase: password });
    },
    async rename_identity(newnick) {
        return await rn_invoke_cpp_method('rename_identity', { newnick: newnick });
    },
    async delete_identity(newnick) {
        return await rn_invoke_cpp_method('delete_identity', {});
    },    // 标记已经备份
    async clear_mnemonic() {
        return await rn_invoke_cpp_method('clear_mnemonic', {});
    },

    /**
     * return { wallets: [ wallets ]}
     */
    async list_wallets() {
        return await rn_invoke_cpp_method('list_wallets', {});
    },
    async create_wallet({ cointype, wallet_name }) {
        return await rn_invoke_cpp_method('create_wallet', { cointype: cointype, wallet_name: wallet_name });
    },
    async create_shared_wallet({ cointype, wallet_name, nKeys, nRequired }) {
        return await rn_invoke_cpp_method('create_shared_wallet', { cointype: cointype, wallet_name: wallet_name, nKeys: nKeys, nRequired: nRequired });
    },
    async join_shared_wallet(barcode) {
        return await rn_invoke_cpp_method('join_shared_wallet', { barcode: barcode });
    },
    async delete_shared_wallet(barcode) {
        return await rn_invoke_cpp_method('delete_shared_wallet', { barcode: barcode });
    },
    async delete_shared_wallet2(wallet) {
        return await rn_invoke_cpp_method('delete_shared_wallet', { keyid: wallet.keyid });
    },
    /**
     * return { success: true, status: ['abc', 'def'],
      number_of_multisign: 2,
      required_sign: 1,
      join_barcode: barcode,
      wallet_name: 'abc',
     }
     *
     */
    async join_status(barcode_or_wallet) {
        if (typeof barcode_or_wallet == 'string') {
            barcode = barcode_or_wallet;
            return await rn_invoke_cpp_method('join_status', { barcode: barcode });
        } else {
            wallet = barcode_or_wallet;
            return await rn_invoke_cpp_method('join_status', { keyid: wallet.keyid });
        }
    },


    /**
     * return { info : [  { coinname: 'BTC, confirmAmount: 11,
    unConfirmAmount: 2,
    availableAmount: 123,
    freezeAmount: 0, } ] }
     */
    async get_balance(wallet) {
        return await rn_invoke_cpp_method('get_balance', { keyid: wallet.keyid });
    },
    /*
     返回值为 {
          success : true
          tx : [ 数组]
     }
    */
    async get_deposit_history({ wallet, coinid, pagenum, pagesize }) {
        return await rn_invoke_cpp_method('get_deposit_history', { keyid: wallet.keyid, coinid: coinid, pagenum: pagenum, pagesize: pagesize });
    },
    /*
     返回值为 {
          success : true
          tx : [ 数组]
     }
    */
    async get_withdraw_history({ wallet, coinid, pagenum, pagesize }) {
        return await rn_invoke_cpp_method('get_withdraw_history', { keyid: wallet.keyid, coinid: coinid, pagenum: pagenum, pagesize: pagesize });
    },
    /*
     返回值为 {
          success : true
          tx : [ 数组]
     }
    */
    async get_pledge_loan_history({ wallet, coinid, pagenum, pagesize }) {
        return await rn_invoke_cpp_method('get_pledge_loan_history', { keyid: wallet.keyid, coinid: coinid, pagenum: pagenum, pagesize: pagesize });
    },
    /*
    return { success: true }
    feemode = "FAST"
    */
    async create_transfer({ wallet, coinId, address, amount, feemode }) {
        return await rn_invoke_cpp_method('create_transfer', { keyid: wallet.keyid, coinId: coinId, address: address, amount: amount, feemode: feemode });
    },
    async create_pledge_loan({ wallet, coinId, address, amount, feemode }) {
        return await rn_invoke_cpp_method('create_pledge_loan', { keyid: wallet.keyid, coinId: coinId, address: address, amount: amount, feemode: feemode });
    },
    async revoke_pledge_loan({ wallet, withdraw_history_item} ) {
        return await rn_invoke_cpp_method('revoke_pledge_loan', { keyid: wallet.keyid, withdraw_history_item: withdraw_history_item });
    },
    /*
        create_transfer 会自动签名, sign_transfer 是在未签名列表里
    */
    async sign_transfer({ wallet, withdraw_history_item }) {

        return await rn_invoke_cpp_method('sign_transfer', { keyid: wallet.keyid, withdraw_history_item: withdraw_history_item });
    },
    async cancel_transfer(withdraw_history_item) {
        return await rn_invoke_cpp_method('cancel_transfer', { withdraw_history_item: withdraw_history_item });
    }
};
