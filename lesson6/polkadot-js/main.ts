import{ApiPromise, WsProvider, Keyring}from "@polkadot/api";
import '@polkadot/api-augment';
import type { FrameSystemAccountInfo}from "@polkadot/types/lookup";
import{ KeyringPair }from '@polkadot/keyring/types'

const sleep = (ms: number) => new Promise(r => setTimeout(r,ms));

const WEB_SOCKET = 'ws://127.0.0.1:9944';
const connect=async()=>{
    const wsProvider = new WsProvider(WEB_SOCKET);
    const api = await ApiPromise.create({provider: wsProvider, types:{}});
    await api.isReady;
    return api;

}

const getMetaData = async (api:ApiPromise) => {
    const metaData = await api.rpc.state.getMetadata();
    return metaData.toString();
}

const subscribe = async (api: ApiPromise) => {
    await api.query.system.events(events => {
        events.forEach( function (event) {
            // console.log("event index: ", event["event"]["index"].toHuman());
            // console.log("event data: ", event["event"]["data"].toHuman());
            console.log(event);
            
        }
        );
    })
}

// 订阅something值
const subscribeSomethingValue =async (api: ApiPromise) => {
    await api.query.templateModule.something((value: string) => {
        console.log("something value is ", value);
      });
}


// 订阅SomethingStored事件
const subscribeSomethingStored = async (api: ApiPromise) => {
    await api.query.system.events((events) => {
        events.forEach(({ event }) => {
          if (api.events.templateModule.SomethingStored.is(event)) {
            console.log("something event is ", event);
          }
        });
      });
    }



const main = async() => {
    const api = await connect();
    const keyring = new Keyring({type:'sr25519'});
    const alice = keyring.addFromUri('//Alice');
    const bob = keyring.addFromUri('//Bob');

    await subscribeSomethingStored(api);
    await subscribeSomethingValue(api);
    await sleep(50000);

    console.log('main function');

}

main()
.then(() => {
    console.log("exits with success");
    process.exit(0);
})
.catch(err => {
    console.log("err is ", err);
    process.exit(1);

})