/**
 * Created by chengjiabing on 17/8/7.
 * 处理与服务器的消息处理
 */
const root = require('./proto.js');
const g_version = 200;
const g_headsize = 16;
let sequence = 1;
let buffer = new ArrayBuffer(100000);
let  bodybuffer;
let bytelen = 0;
function packWithData(cmd, seq, data){
    let headlen = g_headsize;
    let packsize = headlen + data.length;
    let buffer = new ArrayBuffer(packsize);
    let dv = new DataView(buffer);
    dv.setUint16(0, 0xaa55, false);
    dv.setUint16(2, packsize, false);
    dv.setUint32(4, seq, false);
    dv.setInt32(8, cmd, false);
    dv.setUint32(12, g_version, false);
    let dataArray = new Uint8Array(buffer,headlen);
    dataArray.set(data);
    return buffer;

}
function packNoData(cmd, seq){
    let packsize = g_headsize;
    let buffer = new ArrayBuffer(packsize);
    let dv = new DataView(buffer);
    dv.setUint16(0, 0xaa55, false);
    dv.setUint16(2, packsize, false);
    dv.setUint32(4, seq, false);
    dv.setInt32(8, cmd, false);
    dv.setUint32(12, g_version, false);
    return buffer;
}

let callbacks = {};
callbacks[0x38101] = function(cmd, seq, version, body, bodylen, callback){ //解析登陆返回
    try {
        let bodyArray = new Uint8Array(body);
        let loginResponse = root.com.kabao.login.proto.LoginResponse.decode(bodyArray, bodylen);
        callback(loginResponse);
    } catch (e) {
        if (true) {
            // e.instance holds the so far decoded message with missing required fields
            throw e;
        } else {
            throw e;
        }
    }
};
callbacks[0x60701] = function(cmd, seq, version, body, bodylen, respcallback){ //收到服务器 ,给服务发个 返回
    // protobuf.load("../../common/Apis/proto/chat.proto",function(err, root){
    //     if(err)
    //         throw err;
    //     var SendMessageRequest = root.lookupType("com.kabao.chat.proto.SendMessageRequest");
    //     var sendMessageRequest = SendMessageRequest.decode(bodyArray);
    //     alert("recv msg:"+sendMessageRequest.msg);//弹出收到的信息
    //     var SendMessageResponse = root.lookupType("com.kabao.chat.proto.SendMessageResponse");
    //     var sendMessageResponse = SendMessageResponse.create({
    //         status:SendMessageResponse.Error['ERR_OK'],
    //         recvtime:sendMessageRequest.recvtime,
    //         sequence:seq
    //     });
    //     var buffer = SendMessageResponse.encode(sendMessageResponse).finish();
    //     var bb = packWithData(cmd|0x00008000, seq, buffer); //给服务器一个响应
    //
    //     respcallback(bb);
    // });

    try {
        let bodyArray = new Uint8Array(body);
        let sendMessageRequest = root.com.kabao.chat.proto.SendMessageRequest.decode(bodyArray, bodylen);

        let sendReq = root.com.kabao.chat.proto.SendMessageResponse.create({
            status:0,
            recvtime:(new Date()).getTime(),
            sequence:seq,
        });
        let buffer = root.com.kabao.chat.proto.SendMessageResponse.encode(sendReq).finish();
        let pack = packWithData(cmd|0x00008000,seq, buffer);

        respcallback(sendMessageRequest,pack)

    } catch (e) {
        if (true) {//e instanceof protobuf.util.ProtocolError
            // e.instance holds the so far decoded message with missing required fields
            throw e;
        } else {
            throw e;
        }
    }


};

callbacks[0x68701] = function(cmd, seq, version, body, bodylen,callBack){//发数据给服务器,服务器给的 返回
    try {
        let bodyArray = new Uint8Array(body);
        let sendMessageResponse = root.com.kabao.chat.proto.SendMessageResponse.decode(bodyArray, bodylen);
        callBack(sendMessageResponse);
    } catch (e) {
        if (true) {//e instanceof protobuf.util.ProtocolError
            // e.instance holds the so far decoded message with missing required fields
            throw e;
        } else {
            throw e;
        }
    }
};
export const decodeWithData=(evt,callBack)=>{
    let reader = new FileReader();
    reader.onload = function () {
        let sourceArray = new Uint8Array(reader.result);
        let targetArray = new Uint8Array(buffer,bytelen);
        targetArray.set(sourceArray);
        bytelen += reader.result.byteLength;
        if (bytelen < 16) {
            console.log("data length:"+bytelen+" < 16");
            return ;
        }
        while(bytelen>0){
            let dv = new DataView(buffer);
            let sync = dv.getUint16(0);
            if(sync !== 0xaa55){
                console.log("sync:"+sync+" !== 0xaa55");
                ws.close();
                return;
            }
            let datalen = dv.getUint16(2);
            if(datalen>buffer.length)
                break;
            let seq = dv.getUint32(4);
            let cmd = dv.getInt32(8);
            let version = dv.getUint32(12);
            console.log("cmd:"+cmd+",seq:"+seq+",version:"+version);
            let bodylen = datalen-g_headsize
            if(bodylen>0){
                bodybuffer = buffer.slice(g_headsize, datalen);
            }
            switch(cmd){
                case 0x38101://登陆 响应
                    callbacks[0x38101](cmd, seq, version, bodybuffer, bodylen, function(loginRes){
                        callBack({data:loginRes,type:1,seq:seq})
                    });
                    break;
                case 0x60701:// 收到数据 在发出去
                    callbacks[0x60701](cmd, seq, version, bodybuffer, bodylen, function(sendMessageResponse,pack){
                        callBack({
                            data:sendMessageResponse,
                            pack:pack,
                            type:3,
                            seq:seq
                        })
                    });
                    break;
                case 0x68701:// 发送数据的响应
                    callbacks[0x68701](cmd, seq, version, bodybuffer, bodylen,function(respData) {
                        callBack({data:respData,type:2,seq:seq})
                    });
                    break;
                case 0x28000://心跳包返回
                    console.log(cmd+","+seq+","+version);
                    callBack({data:null,type:4,seq:seq});
                    break;

            }

            if(bytelen - datalen>0){
                let tarArr = new Uint8Array(buffer);
                let srcArr = new Uint8Array(buffer,datalen);
                tarArr.set(srcArr);
            }
            bytelen -= datalen;
        }

    };
    reader.onerror = function (e) {
        console.log('读取文件错误')
        console.log(e)
    }
    reader.onabort = function (e) {
        console.log('读取文件中断')
        console.log(e)
    }



    reader.readAsArrayBuffer(evt.data);
}

export const encodeWithLoginData=(uuid,token='88888888')=>{//对登陆的请求数据 序列化
    let loginreq = root.com.kabao.login.proto.LoginRequest.create({
        uuid:uuid,
        token:token
    });
    let reqbuf = root.com.kabao.login.proto.LoginRequest.encode(loginreq).finish();
    let pack =  packWithData(0x30101,sequence, reqbuf);
    return {
        pack:pack,
        seq:sequence++
    };
}
export const encodeWithMsgData=(destid,srcid,msgtype,msg,groupid,recvtime)=>{//对发送数据进行 序列化
    // groupid :3,recvtime :4,
    // TEXT_MESSAGE                        = 0;
    // IMAGE_MESSAGE                       = 1;
    // AUDIO_MESSAGE                       = 2;
    // VIDEO_MESSAGE                       = 3;
    // EXPRESSION_MESSAGE                  = 4;
    // POSITION_MESSAGE                    = 5;
    // SYSTEM_MESSAGE                      = 6;
    // NULL_MESSAGE                        = 7;
    // TRANSFER_COLLECTION_MESSAGE         = 8;

    let sendReq = root.com.kabao.chat.proto.SendMessageRequest.create({
        destid:destid,
        srcid: srcid,
        msgtype :msgtype,
        msg :msg,
    });
    let buffer = root.com.kabao.chat.proto.SendMessageRequest.encode(sendReq).finish();
    let pack = packWithData(0x60701,sequence, buffer);
    console.log('set seq is  '+sequence+'destid= '+destid+' srcId = '+srcid)
    return {
        pack:pack,
        seq:sequence++
    };
}
export const encodeWithHeartData=()=>{//发送心跳包
    let heartBuf = packNoData(0x20000,99999);
    return {
        pack:heartBuf,
        seq:99999
    };
}



