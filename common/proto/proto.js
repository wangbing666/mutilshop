/*eslint-disable block-scoped-var, no-redeclare, no-control-regex, no-prototype-builtins*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.com = (function() {

    /**
     * Namespace com.
     * @exports com
     * @namespace
     */
    var com = {};

    com.kabao = (function() {

        /**
         * Namespace kabao.
         * @memberof com
         * @namespace
         */
        var kabao = {};

        kabao.chat = (function() {

            /**
             * Namespace chat.
             * @memberof com.kabao
             * @namespace
             */
            var chat = {};

            chat.proto = (function() {

                /**
                 * Namespace proto.
                 * @memberof com.kabao.chat
                 * @namespace
                 */
                var proto = {};

                proto.SendMessageRequest = (function() {

                    /**
                     * Properties of a SendMessageRequest.
                     * @memberof com.kabao.chat.proto
                     * @interface ISendMessageRequest
                     * @property {number|Long} destid SendMessageRequest destid
                     * @property {number|Long} srcid SendMessageRequest srcid
                     * @property {number|Long} [groupid] SendMessageRequest groupid
                     * @property {number|Long} [recvtime] SendMessageRequest recvtime
                     * @property {number} msgtype SendMessageRequest msgtype
                     * @property {string} msg SendMessageRequest msg
                     */

                    /**
                     * Constructs a new SendMessageRequest.
                     * @memberof com.kabao.chat.proto
                     * @classdesc Represents a SendMessageRequest.
                     * @constructor
                     * @param {com.kabao.chat.proto.ISendMessageRequest=} [properties] Properties to set
                     */
                    function SendMessageRequest(properties) {
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * SendMessageRequest destid.
                     * @member {number|Long}destid
                     * @memberof com.kabao.chat.proto.SendMessageRequest
                     * @instance
                     */
                    SendMessageRequest.prototype.destid = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

                    /**
                     * SendMessageRequest srcid.
                     * @member {number|Long}srcid
                     * @memberof com.kabao.chat.proto.SendMessageRequest
                     * @instance
                     */
                    SendMessageRequest.prototype.srcid = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

                    /**
                     * SendMessageRequest groupid.
                     * @member {number|Long}groupid
                     * @memberof com.kabao.chat.proto.SendMessageRequest
                     * @instance
                     */
                    SendMessageRequest.prototype.groupid = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

                    /**
                     * SendMessageRequest recvtime.
                     * @member {number|Long}recvtime
                     * @memberof com.kabao.chat.proto.SendMessageRequest
                     * @instance
                     */
                    SendMessageRequest.prototype.recvtime = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

                    /**
                     * SendMessageRequest msgtype.
                     * @member {number}msgtype
                     * @memberof com.kabao.chat.proto.SendMessageRequest
                     * @instance
                     */
                    SendMessageRequest.prototype.msgtype = 0;

                    /**
                     * SendMessageRequest msg.
                     * @member {string}msg
                     * @memberof com.kabao.chat.proto.SendMessageRequest
                     * @instance
                     */
                    SendMessageRequest.prototype.msg = "";

                    /**
                     * Creates a new SendMessageRequest instance using the specified properties.
                     * @function create
                     * @memberof com.kabao.chat.proto.SendMessageRequest
                     * @static
                     * @param {com.kabao.chat.proto.ISendMessageRequest=} [properties] Properties to set
                     * @returns {com.kabao.chat.proto.SendMessageRequest} SendMessageRequest instance
                     */
                    SendMessageRequest.create = function create(properties) {
                        return new SendMessageRequest(properties);
                    };

                    /**
                     * Encodes the specified SendMessageRequest message. Does not implicitly {@link com.kabao.chat.proto.SendMessageRequest.verify|verify} messages.
                     * @function encode
                     * @memberof com.kabao.chat.proto.SendMessageRequest
                     * @static
                     * @param {com.kabao.chat.proto.ISendMessageRequest} message SendMessageRequest message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    SendMessageRequest.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.destid);
                        writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.srcid);
                        if (message.groupid != null && message.hasOwnProperty("groupid"))
                            writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.groupid);
                        if (message.recvtime != null && message.hasOwnProperty("recvtime"))
                            writer.uint32(/* id 4, wireType 0 =*/32).uint64(message.recvtime);
                        writer.uint32(/* id 5, wireType 0 =*/40).int32(message.msgtype);
                        writer.uint32(/* id 6, wireType 2 =*/50).string(message.msg);
                        return writer;
                    };

                    /**
                     * Encodes the specified SendMessageRequest message, length delimited. Does not implicitly {@link com.kabao.chat.proto.SendMessageRequest.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof com.kabao.chat.proto.SendMessageRequest
                     * @static
                     * @param {com.kabao.chat.proto.ISendMessageRequest} message SendMessageRequest message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    SendMessageRequest.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a SendMessageRequest message from the specified reader or buffer.
                     * @function decode
                     * @memberof com.kabao.chat.proto.SendMessageRequest
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {com.kabao.chat.proto.SendMessageRequest} SendMessageRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    SendMessageRequest.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.kabao.chat.proto.SendMessageRequest();
                        while (reader.pos < end) {
                            var tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                message.destid = reader.uint64();
                                break;
                            case 2:
                                message.srcid = reader.uint64();
                                break;
                            case 3:
                                message.groupid = reader.uint64();
                                break;
                            case 4:
                                message.recvtime = reader.uint64();
                                break;
                            case 5:
                                message.msgtype = reader.int32();
                                break;
                            case 6:
                                message.msg = reader.string();
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        if (!message.hasOwnProperty("destid"))
                            throw $util.ProtocolError("missing required 'destid'", { instance: message });
                        if (!message.hasOwnProperty("srcid"))
                            throw $util.ProtocolError("missing required 'srcid'", { instance: message });
                        if (!message.hasOwnProperty("msgtype"))
                            throw $util.ProtocolError("missing required 'msgtype'", { instance: message });
                        if (!message.hasOwnProperty("msg"))
                            throw $util.ProtocolError("missing required 'msg'", { instance: message });
                        return message;
                    };

                    /**
                     * Decodes a SendMessageRequest message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof com.kabao.chat.proto.SendMessageRequest
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {com.kabao.chat.proto.SendMessageRequest} SendMessageRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    SendMessageRequest.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a SendMessageRequest message.
                     * @function verify
                     * @memberof com.kabao.chat.proto.SendMessageRequest
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    SendMessageRequest.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (!$util.isInteger(message.destid) && !(message.destid && $util.isInteger(message.destid.low) && $util.isInteger(message.destid.high)))
                            return "destid: integer|Long expected";
                        if (!$util.isInteger(message.srcid) && !(message.srcid && $util.isInteger(message.srcid.low) && $util.isInteger(message.srcid.high)))
                            return "srcid: integer|Long expected";
                        if (message.groupid != null && message.hasOwnProperty("groupid"))
                            if (!$util.isInteger(message.groupid) && !(message.groupid && $util.isInteger(message.groupid.low) && $util.isInteger(message.groupid.high)))
                                return "groupid: integer|Long expected";
                        if (message.recvtime != null && message.hasOwnProperty("recvtime"))
                            if (!$util.isInteger(message.recvtime) && !(message.recvtime && $util.isInteger(message.recvtime.low) && $util.isInteger(message.recvtime.high)))
                                return "recvtime: integer|Long expected";
                        if (!$util.isInteger(message.msgtype))
                            return "msgtype: integer expected";
                        if (!$util.isString(message.msg))
                            return "msg: string expected";
                        return null;
                    };

                    /**
                     * Creates a SendMessageRequest message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof com.kabao.chat.proto.SendMessageRequest
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {com.kabao.chat.proto.SendMessageRequest} SendMessageRequest
                     */
                    SendMessageRequest.fromObject = function fromObject(object) {
                        if (object instanceof $root.com.kabao.chat.proto.SendMessageRequest)
                            return object;
                        var message = new $root.com.kabao.chat.proto.SendMessageRequest();
                        if (object.destid != null)
                            if ($util.Long)
                                (message.destid = $util.Long.fromValue(object.destid)).unsigned = true;
                            else if (typeof object.destid === "string")
                                message.destid = parseInt(object.destid, 10);
                            else if (typeof object.destid === "number")
                                message.destid = object.destid;
                            else if (typeof object.destid === "object")
                                message.destid = new $util.LongBits(object.destid.low >>> 0, object.destid.high >>> 0).toNumber(true);
                        if (object.srcid != null)
                            if ($util.Long)
                                (message.srcid = $util.Long.fromValue(object.srcid)).unsigned = true;
                            else if (typeof object.srcid === "string")
                                message.srcid = parseInt(object.srcid, 10);
                            else if (typeof object.srcid === "number")
                                message.srcid = object.srcid;
                            else if (typeof object.srcid === "object")
                                message.srcid = new $util.LongBits(object.srcid.low >>> 0, object.srcid.high >>> 0).toNumber(true);
                        if (object.groupid != null)
                            if ($util.Long)
                                (message.groupid = $util.Long.fromValue(object.groupid)).unsigned = true;
                            else if (typeof object.groupid === "string")
                                message.groupid = parseInt(object.groupid, 10);
                            else if (typeof object.groupid === "number")
                                message.groupid = object.groupid;
                            else if (typeof object.groupid === "object")
                                message.groupid = new $util.LongBits(object.groupid.low >>> 0, object.groupid.high >>> 0).toNumber(true);
                        if (object.recvtime != null)
                            if ($util.Long)
                                (message.recvtime = $util.Long.fromValue(object.recvtime)).unsigned = true;
                            else if (typeof object.recvtime === "string")
                                message.recvtime = parseInt(object.recvtime, 10);
                            else if (typeof object.recvtime === "number")
                                message.recvtime = object.recvtime;
                            else if (typeof object.recvtime === "object")
                                message.recvtime = new $util.LongBits(object.recvtime.low >>> 0, object.recvtime.high >>> 0).toNumber(true);
                        if (object.msgtype != null)
                            message.msgtype = object.msgtype | 0;
                        if (object.msg != null)
                            message.msg = String(object.msg);
                        return message;
                    };

                    /**
                     * Creates a plain object from a SendMessageRequest message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof com.kabao.chat.proto.SendMessageRequest
                     * @static
                     * @param {com.kabao.chat.proto.SendMessageRequest} message SendMessageRequest
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    SendMessageRequest.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        var object = {};
                        if (options.defaults) {
                            if ($util.Long) {
                                var long = new $util.Long(0, 0, true);
                                object.destid = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.destid = options.longs === String ? "0" : 0;
                            if ($util.Long) {
                                var long = new $util.Long(0, 0, true);
                                object.srcid = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.srcid = options.longs === String ? "0" : 0;
                            if ($util.Long) {
                                var long = new $util.Long(0, 0, true);
                                object.groupid = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.groupid = options.longs === String ? "0" : 0;
                            if ($util.Long) {
                                var long = new $util.Long(0, 0, true);
                                object.recvtime = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.recvtime = options.longs === String ? "0" : 0;
                            object.msgtype = 0;
                            object.msg = "";
                        }
                        if (message.destid != null && message.hasOwnProperty("destid"))
                            if (typeof message.destid === "number")
                                object.destid = options.longs === String ? String(message.destid) : message.destid;
                            else
                                object.destid = options.longs === String ? $util.Long.prototype.toString.call(message.destid) : options.longs === Number ? new $util.LongBits(message.destid.low >>> 0, message.destid.high >>> 0).toNumber(true) : message.destid;
                        if (message.srcid != null && message.hasOwnProperty("srcid"))
                            if (typeof message.srcid === "number")
                                object.srcid = options.longs === String ? String(message.srcid) : message.srcid;
                            else
                                object.srcid = options.longs === String ? $util.Long.prototype.toString.call(message.srcid) : options.longs === Number ? new $util.LongBits(message.srcid.low >>> 0, message.srcid.high >>> 0).toNumber(true) : message.srcid;
                        if (message.groupid != null && message.hasOwnProperty("groupid"))
                            if (typeof message.groupid === "number")
                                object.groupid = options.longs === String ? String(message.groupid) : message.groupid;
                            else
                                object.groupid = options.longs === String ? $util.Long.prototype.toString.call(message.groupid) : options.longs === Number ? new $util.LongBits(message.groupid.low >>> 0, message.groupid.high >>> 0).toNumber(true) : message.groupid;
                        if (message.recvtime != null && message.hasOwnProperty("recvtime"))
                            if (typeof message.recvtime === "number")
                                object.recvtime = options.longs === String ? String(message.recvtime) : message.recvtime;
                            else
                                object.recvtime = options.longs === String ? $util.Long.prototype.toString.call(message.recvtime) : options.longs === Number ? new $util.LongBits(message.recvtime.low >>> 0, message.recvtime.high >>> 0).toNumber(true) : message.recvtime;
                        if (message.msgtype != null && message.hasOwnProperty("msgtype"))
                            object.msgtype = message.msgtype;
                        if (message.msg != null && message.hasOwnProperty("msg"))
                            object.msg = message.msg;
                        return object;
                    };

                    /**
                     * Converts this SendMessageRequest to JSON.
                     * @function toJSON
                     * @memberof com.kabao.chat.proto.SendMessageRequest
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    SendMessageRequest.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    /**
                     * MsgType enum.
                     * @enum {string}
                     * @property {number} TEXT_MESSAGE=0 TEXT_MESSAGE value
                     * @property {number} IMAGE_MESSAGE=1 IMAGE_MESSAGE value
                     * @property {number} AUDIO_MESSAGE=2 AUDIO_MESSAGE value
                     * @property {number} VIDEO_MESSAGE=3 VIDEO_MESSAGE value
                     * @property {number} EXPRESSION_MESSAGE=4 EXPRESSION_MESSAGE value
                     * @property {number} POSITION_MESSAGE=5 POSITION_MESSAGE value
                     * @property {number} SYSTEM_MESSAGE=6 SYSTEM_MESSAGE value
                     * @property {number} NULL_MESSAGE=7 NULL_MESSAGE value
                     * @property {number} TRANSFER_COLLECTION_MESSAGE=8 TRANSFER_COLLECTION_MESSAGE value
                     */
                    SendMessageRequest.MsgType = (function() {
                        var valuesById = {}, values = Object.create(valuesById);
                        values[valuesById[0] = "TEXT_MESSAGE"] = 0;
                        values[valuesById[1] = "IMAGE_MESSAGE"] = 1;
                        values[valuesById[2] = "AUDIO_MESSAGE"] = 2;
                        values[valuesById[3] = "VIDEO_MESSAGE"] = 3;
                        values[valuesById[4] = "EXPRESSION_MESSAGE"] = 4;
                        values[valuesById[5] = "POSITION_MESSAGE"] = 5;
                        values[valuesById[6] = "SYSTEM_MESSAGE"] = 6;
                        values[valuesById[7] = "NULL_MESSAGE"] = 7;
                        values[valuesById[8] = "TRANSFER_COLLECTION_MESSAGE"] = 8;
                        return values;
                    })();

                    return SendMessageRequest;
                })();

                proto.SendMessageResponse = (function() {

                    /**
                     * Properties of a SendMessageResponse.
                     * @memberof com.kabao.chat.proto
                     * @interface ISendMessageResponse
                     * @property {number} status SendMessageResponse status
                     * @property {number|Long} recvtime SendMessageResponse recvtime
                     * @property {number} sequence SendMessageResponse sequence
                     */

                    /**
                     * Constructs a new SendMessageResponse.
                     * @memberof com.kabao.chat.proto
                     * @classdesc Represents a SendMessageResponse.
                     * @constructor
                     * @param {com.kabao.chat.proto.ISendMessageResponse=} [properties] Properties to set
                     */
                    function SendMessageResponse(properties) {
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * SendMessageResponse status.
                     * @member {number}status
                     * @memberof com.kabao.chat.proto.SendMessageResponse
                     * @instance
                     */
                    SendMessageResponse.prototype.status = 0;

                    /**
                     * SendMessageResponse recvtime.
                     * @member {number|Long}recvtime
                     * @memberof com.kabao.chat.proto.SendMessageResponse
                     * @instance
                     */
                    SendMessageResponse.prototype.recvtime = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

                    /**
                     * SendMessageResponse sequence.
                     * @member {number}sequence
                     * @memberof com.kabao.chat.proto.SendMessageResponse
                     * @instance
                     */
                    SendMessageResponse.prototype.sequence = 0;

                    /**
                     * Creates a new SendMessageResponse instance using the specified properties.
                     * @function create
                     * @memberof com.kabao.chat.proto.SendMessageResponse
                     * @static
                     * @param {com.kabao.chat.proto.ISendMessageResponse=} [properties] Properties to set
                     * @returns {com.kabao.chat.proto.SendMessageResponse} SendMessageResponse instance
                     */
                    SendMessageResponse.create = function create(properties) {
                        return new SendMessageResponse(properties);
                    };

                    /**
                     * Encodes the specified SendMessageResponse message. Does not implicitly {@link com.kabao.chat.proto.SendMessageResponse.verify|verify} messages.
                     * @function encode
                     * @memberof com.kabao.chat.proto.SendMessageResponse
                     * @static
                     * @param {com.kabao.chat.proto.ISendMessageResponse} message SendMessageResponse message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    SendMessageResponse.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.status);
                        writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.recvtime);
                        writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.sequence);
                        return writer;
                    };

                    /**
                     * Encodes the specified SendMessageResponse message, length delimited. Does not implicitly {@link com.kabao.chat.proto.SendMessageResponse.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof com.kabao.chat.proto.SendMessageResponse
                     * @static
                     * @param {com.kabao.chat.proto.ISendMessageResponse} message SendMessageResponse message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    SendMessageResponse.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a SendMessageResponse message from the specified reader or buffer.
                     * @function decode
                     * @memberof com.kabao.chat.proto.SendMessageResponse
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {com.kabao.chat.proto.SendMessageResponse} SendMessageResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    SendMessageResponse.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.kabao.chat.proto.SendMessageResponse();
                        while (reader.pos < end) {
                            var tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                message.status = reader.int32();
                                break;
                            case 2:
                                message.recvtime = reader.uint64();
                                break;
                            case 3:
                                message.sequence = reader.uint32();
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        if (!message.hasOwnProperty("status"))
                            throw $util.ProtocolError("missing required 'status'", { instance: message });
                        if (!message.hasOwnProperty("recvtime"))
                            throw $util.ProtocolError("missing required 'recvtime'", { instance: message });
                        if (!message.hasOwnProperty("sequence"))
                            throw $util.ProtocolError("missing required 'sequence'", { instance: message });
                        return message;
                    };

                    /**
                     * Decodes a SendMessageResponse message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof com.kabao.chat.proto.SendMessageResponse
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {com.kabao.chat.proto.SendMessageResponse} SendMessageResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    SendMessageResponse.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a SendMessageResponse message.
                     * @function verify
                     * @memberof com.kabao.chat.proto.SendMessageResponse
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    SendMessageResponse.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (!$util.isInteger(message.status))
                            return "status: integer expected";
                        if (!$util.isInteger(message.recvtime) && !(message.recvtime && $util.isInteger(message.recvtime.low) && $util.isInteger(message.recvtime.high)))
                            return "recvtime: integer|Long expected";
                        if (!$util.isInteger(message.sequence))
                            return "sequence: integer expected";
                        return null;
                    };

                    /**
                     * Creates a SendMessageResponse message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof com.kabao.chat.proto.SendMessageResponse
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {com.kabao.chat.proto.SendMessageResponse} SendMessageResponse
                     */
                    SendMessageResponse.fromObject = function fromObject(object) {
                        if (object instanceof $root.com.kabao.chat.proto.SendMessageResponse)
                            return object;
                        var message = new $root.com.kabao.chat.proto.SendMessageResponse();
                        if (object.status != null)
                            message.status = object.status | 0;
                        if (object.recvtime != null)
                            if ($util.Long)
                                (message.recvtime = $util.Long.fromValue(object.recvtime)).unsigned = true;
                            else if (typeof object.recvtime === "string")
                                message.recvtime = parseInt(object.recvtime, 10);
                            else if (typeof object.recvtime === "number")
                                message.recvtime = object.recvtime;
                            else if (typeof object.recvtime === "object")
                                message.recvtime = new $util.LongBits(object.recvtime.low >>> 0, object.recvtime.high >>> 0).toNumber(true);
                        if (object.sequence != null)
                            message.sequence = object.sequence >>> 0;
                        return message;
                    };

                    /**
                     * Creates a plain object from a SendMessageResponse message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof com.kabao.chat.proto.SendMessageResponse
                     * @static
                     * @param {com.kabao.chat.proto.SendMessageResponse} message SendMessageResponse
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    SendMessageResponse.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        var object = {};
                        if (options.defaults) {
                            object.status = 0;
                            if ($util.Long) {
                                var long = new $util.Long(0, 0, true);
                                object.recvtime = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.recvtime = options.longs === String ? "0" : 0;
                            object.sequence = 0;
                        }
                        if (message.status != null && message.hasOwnProperty("status"))
                            object.status = message.status;
                        if (message.recvtime != null && message.hasOwnProperty("recvtime"))
                            if (typeof message.recvtime === "number")
                                object.recvtime = options.longs === String ? String(message.recvtime) : message.recvtime;
                            else
                                object.recvtime = options.longs === String ? $util.Long.prototype.toString.call(message.recvtime) : options.longs === Number ? new $util.LongBits(message.recvtime.low >>> 0, message.recvtime.high >>> 0).toNumber(true) : message.recvtime;
                        if (message.sequence != null && message.hasOwnProperty("sequence"))
                            object.sequence = message.sequence;
                        return object;
                    };

                    /**
                     * Converts this SendMessageResponse to JSON.
                     * @function toJSON
                     * @memberof com.kabao.chat.proto.SendMessageResponse
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    SendMessageResponse.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    /**
                     * Error enum.
                     * @enum {string}
                     * @property {number} ERR_OK=0 ERR_OK value
                     * @property {number} ERR_SYS=-1 ERR_SYS value
                     */
                    SendMessageResponse.Error = (function() {
                        var valuesById = {}, values = Object.create(valuesById);
                        values[valuesById[0] = "ERR_OK"] = 0;
                        values[valuesById[-1] = "ERR_SYS"] = -1;
                        return values;
                    })();

                    return SendMessageResponse;
                })();

                return proto;
            })();

            return chat;
        })();

        kabao.cmd = (function() {

            /**
             * Namespace cmd.
             * @memberof com.kabao
             * @namespace
             */
            var cmd = {};

            cmd.proto = (function() {

                /**
                 * Namespace proto.
                 * @memberof com.kabao.cmd
                 * @namespace
                 */
                var proto = {};

                /**
                 * CmdID enum.
                 * @enum {string}
                 * @property {number} CMD_ID_INVALID=-1 CMD_ID_INVALID value
                 * @property {number} CMD_ID_UNKNOWN=0 CMD_ID_UNKNOWN value
                 * @property {number} CMD_ID_HEART=131072 CMD_ID_HEART value
                 * @property {number} CMD_ID_HEART_RESP=163840 CMD_ID_HEART_RESP value
                 * @property {number} CMD_ID_LOGIN=196865 CMD_ID_LOGIN value
                 * @property {number} CMD_ID_LOGIN_RESP=229633 CMD_ID_LOGIN_RESP value
                 * @property {number} CMD_ID_LOGIN_OUT=196866 CMD_ID_LOGIN_OUT value
                 * @property {number} CMD_ID_LOGIN_OUT_RESP=229634 CMD_ID_LOGIN_OUT_RESP value
                 * @property {number} CMD_ID_REMOTE_LOGIN=196867 CMD_ID_REMOTE_LOGIN value
                 * @property {number} CMD_ID_REMOTE_LOGIN_RESP=229635 CMD_ID_REMOTE_LOGIN_RESP value
                 * @property {number} CMD_ID_SEND_MESSAGE=329473 CMD_ID_SEND_MESSAGE value
                 * @property {number} CMD_ID_SEND_MESSAGE_RESP=362241 CMD_ID_SEND_MESSAGE_RESP value
                 * @property {number} CMD_ID_MESSAGE_UNDO=329601 CMD_ID_MESSAGE_UNDO value
                 * @property {number} CMD_ID_MESSAGE_UNDO_RESP=362369 CMD_ID_MESSAGE_UNDO_RESP value
                 * @property {number} CMD_ID_SINGLE_PUSH=460545 CMD_ID_SINGLE_PUSH value
                 * @property {number} CMD_ID_SINGLE_PUSH_RESP=493313 CMD_ID_SINGLE_PUSH_RESP value
                 * @property {number} CMD_ID_MUTIL_PUSH=460546 CMD_ID_MUTIL_PUSH value
                 * @property {number} CMD_ID_MUTIL_PUSH_RESP=493314 CMD_ID_MUTIL_PUSH_RESP value
                 * @property {number} CMD_ID_VISTOR_SEND_MESSAGE=395009 CMD_ID_VISTOR_SEND_MESSAGE value
                 * @property {number} CMD_ID_VISTOR_SEND_MESSAGE_RESP=427777 CMD_ID_VISTOR_SEND_MESSAGE_RESP value
                 */
                proto.CmdID = (function() {
                    var valuesById = {}, values = Object.create(valuesById);
                    values[valuesById[-1] = "CMD_ID_INVALID"] = -1;
                    values[valuesById[0] = "CMD_ID_UNKNOWN"] = 0;
                    values[valuesById[131072] = "CMD_ID_HEART"] = 131072;
                    values[valuesById[163840] = "CMD_ID_HEART_RESP"] = 163840;
                    values[valuesById[196865] = "CMD_ID_LOGIN"] = 196865;
                    values[valuesById[229633] = "CMD_ID_LOGIN_RESP"] = 229633;
                    values[valuesById[196866] = "CMD_ID_LOGIN_OUT"] = 196866;
                    values[valuesById[229634] = "CMD_ID_LOGIN_OUT_RESP"] = 229634;
                    values[valuesById[196867] = "CMD_ID_REMOTE_LOGIN"] = 196867;
                    values[valuesById[229635] = "CMD_ID_REMOTE_LOGIN_RESP"] = 229635;
                    values[valuesById[329473] = "CMD_ID_SEND_MESSAGE"] = 329473;
                    values[valuesById[362241] = "CMD_ID_SEND_MESSAGE_RESP"] = 362241;
                    values[valuesById[329601] = "CMD_ID_MESSAGE_UNDO"] = 329601;
                    values[valuesById[362369] = "CMD_ID_MESSAGE_UNDO_RESP"] = 362369;
                    values[valuesById[460545] = "CMD_ID_SINGLE_PUSH"] = 460545;
                    values[valuesById[493313] = "CMD_ID_SINGLE_PUSH_RESP"] = 493313;
                    values[valuesById[460546] = "CMD_ID_MUTIL_PUSH"] = 460546;
                    values[valuesById[493314] = "CMD_ID_MUTIL_PUSH_RESP"] = 493314;
                    values[valuesById[395009] = "CMD_ID_VISTOR_SEND_MESSAGE"] = 395009;
                    values[valuesById[427777] = "CMD_ID_VISTOR_SEND_MESSAGE_RESP"] = 427777;
                    return values;
                })();

                return proto;
            })();

            return cmd;
        })();

        kabao.login = (function() {

            /**
             * Namespace login.
             * @memberof com.kabao
             * @namespace
             */
            var login = {};

            login.proto = (function() {

                /**
                 * Namespace proto.
                 * @memberof com.kabao.login
                 * @namespace
                 */
                var proto = {};

                proto.LoginRequest = (function() {

                    /**
                     * Properties of a LoginRequest.
                     * @memberof com.kabao.login.proto
                     * @interface ILoginRequest
                     * @property {number|Long} uuid LoginRequest uuid
                     * @property {string} checkcode LoginRequest checkcode
                     */

                    /**
                     * Constructs a new LoginRequest.
                     * @memberof com.kabao.login.proto
                     * @classdesc Represents a LoginRequest.
                     * @constructor
                     * @param {com.kabao.login.proto.ILoginRequest=} [properties] Properties to set
                     */
                    function LoginRequest(properties) {
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * LoginRequest uuid.
                     * @member {number|Long}uuid
                     * @memberof com.kabao.login.proto.LoginRequest
                     * @instance
                     */
                    LoginRequest.prototype.uuid = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

                    /**
                     * LoginRequest checkcode.
                     * @member {string}checkcode
                     * @memberof com.kabao.login.proto.LoginRequest
                     * @instance
                     */
                    LoginRequest.prototype.checkcode = "";

                    /**
                     * Creates a new LoginRequest instance using the specified properties.
                     * @function create
                     * @memberof com.kabao.login.proto.LoginRequest
                     * @static
                     * @param {com.kabao.login.proto.ILoginRequest=} [properties] Properties to set
                     * @returns {com.kabao.login.proto.LoginRequest} LoginRequest instance
                     */
                    LoginRequest.create = function create(properties) {
                        return new LoginRequest(properties);
                    };

                    /**
                     * Encodes the specified LoginRequest message. Does not implicitly {@link com.kabao.login.proto.LoginRequest.verify|verify} messages.
                     * @function encode
                     * @memberof com.kabao.login.proto.LoginRequest
                     * @static
                     * @param {com.kabao.login.proto.ILoginRequest} message LoginRequest message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    LoginRequest.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.uuid);
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.checkcode);
                        return writer;
                    };

                    /**
                     * Encodes the specified LoginRequest message, length delimited. Does not implicitly {@link com.kabao.login.proto.LoginRequest.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof com.kabao.login.proto.LoginRequest
                     * @static
                     * @param {com.kabao.login.proto.ILoginRequest} message LoginRequest message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    LoginRequest.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a LoginRequest message from the specified reader or buffer.
                     * @function decode
                     * @memberof com.kabao.login.proto.LoginRequest
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {com.kabao.login.proto.LoginRequest} LoginRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    LoginRequest.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.kabao.login.proto.LoginRequest();
                        while (reader.pos < end) {
                            var tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                message.uuid = reader.uint64();
                                break;
                            case 2:
                                message.checkcode = reader.string();
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        if (!message.hasOwnProperty("uuid"))
                            throw $util.ProtocolError("missing required 'uuid'", { instance: message });
                        if (!message.hasOwnProperty("checkcode"))
                            throw $util.ProtocolError("missing required 'checkcode'", { instance: message });
                        return message;
                    };

                    /**
                     * Decodes a LoginRequest message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof com.kabao.login.proto.LoginRequest
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {com.kabao.login.proto.LoginRequest} LoginRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    LoginRequest.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a LoginRequest message.
                     * @function verify
                     * @memberof com.kabao.login.proto.LoginRequest
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    LoginRequest.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (!$util.isInteger(message.uuid) && !(message.uuid && $util.isInteger(message.uuid.low) && $util.isInteger(message.uuid.high)))
                            return "uuid: integer|Long expected";
                        if (!$util.isString(message.checkcode))
                            return "checkcode: string expected";
                        return null;
                    };

                    /**
                     * Creates a LoginRequest message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof com.kabao.login.proto.LoginRequest
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {com.kabao.login.proto.LoginRequest} LoginRequest
                     */
                    LoginRequest.fromObject = function fromObject(object) {
                        if (object instanceof $root.com.kabao.login.proto.LoginRequest)
                            return object;
                        var message = new $root.com.kabao.login.proto.LoginRequest();
                        if (object.uuid != null)
                            if ($util.Long)
                                (message.uuid = $util.Long.fromValue(object.uuid)).unsigned = true;
                            else if (typeof object.uuid === "string")
                                message.uuid = parseInt(object.uuid, 10);
                            else if (typeof object.uuid === "number")
                                message.uuid = object.uuid;
                            else if (typeof object.uuid === "object")
                                message.uuid = new $util.LongBits(object.uuid.low >>> 0, object.uuid.high >>> 0).toNumber(true);
                        if (object.checkcode != null)
                            message.checkcode = String(object.checkcode);
                        return message;
                    };

                    /**
                     * Creates a plain object from a LoginRequest message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof com.kabao.login.proto.LoginRequest
                     * @static
                     * @param {com.kabao.login.proto.LoginRequest} message LoginRequest
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    LoginRequest.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        var object = {};
                        if (options.defaults) {
                            if ($util.Long) {
                                var long = new $util.Long(0, 0, true);
                                object.uuid = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.uuid = options.longs === String ? "0" : 0;
                            object.checkcode = "";
                        }
                        if (message.uuid != null && message.hasOwnProperty("uuid"))
                            if (typeof message.uuid === "number")
                                object.uuid = options.longs === String ? String(message.uuid) : message.uuid;
                            else
                                object.uuid = options.longs === String ? $util.Long.prototype.toString.call(message.uuid) : options.longs === Number ? new $util.LongBits(message.uuid.low >>> 0, message.uuid.high >>> 0).toNumber(true) : message.uuid;
                        if (message.checkcode != null && message.hasOwnProperty("checkcode"))
                            object.checkcode = message.checkcode;
                        return object;
                    };

                    /**
                     * Converts this LoginRequest to JSON.
                     * @function toJSON
                     * @memberof com.kabao.login.proto.LoginRequest
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    LoginRequest.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return LoginRequest;
                })();

                proto.LoginResponse = (function() {

                    /**
                     * Properties of a LoginResponse.
                     * @memberof com.kabao.login.proto
                     * @interface ILoginResponse
                     * @property {number} status LoginResponse status
                     * @property {number} offlinecount LoginResponse offlinecount
                     */

                    /**
                     * Constructs a new LoginResponse.
                     * @memberof com.kabao.login.proto
                     * @classdesc Represents a LoginResponse.
                     * @constructor
                     * @param {com.kabao.login.proto.ILoginResponse=} [properties] Properties to set
                     */
                    function LoginResponse(properties) {
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * LoginResponse status.
                     * @member {number}status
                     * @memberof com.kabao.login.proto.LoginResponse
                     * @instance
                     */
                    LoginResponse.prototype.status = 0;

                    /**
                     * LoginResponse offlinecount.
                     * @member {number}offlinecount
                     * @memberof com.kabao.login.proto.LoginResponse
                     * @instance
                     */
                    LoginResponse.prototype.offlinecount = 0;

                    /**
                     * Creates a new LoginResponse instance using the specified properties.
                     * @function create
                     * @memberof com.kabao.login.proto.LoginResponse
                     * @static
                     * @param {com.kabao.login.proto.ILoginResponse=} [properties] Properties to set
                     * @returns {com.kabao.login.proto.LoginResponse} LoginResponse instance
                     */
                    LoginResponse.create = function create(properties) {
                        return new LoginResponse(properties);
                    };

                    /**
                     * Encodes the specified LoginResponse message. Does not implicitly {@link com.kabao.login.proto.LoginResponse.verify|verify} messages.
                     * @function encode
                     * @memberof com.kabao.login.proto.LoginResponse
                     * @static
                     * @param {com.kabao.login.proto.ILoginResponse} message LoginResponse message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    LoginResponse.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.status);
                        writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.offlinecount);
                        return writer;
                    };

                    /**
                     * Encodes the specified LoginResponse message, length delimited. Does not implicitly {@link com.kabao.login.proto.LoginResponse.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof com.kabao.login.proto.LoginResponse
                     * @static
                     * @param {com.kabao.login.proto.ILoginResponse} message LoginResponse message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    LoginResponse.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a LoginResponse message from the specified reader or buffer.
                     * @function decode
                     * @memberof com.kabao.login.proto.LoginResponse
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {com.kabao.login.proto.LoginResponse} LoginResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    LoginResponse.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.kabao.login.proto.LoginResponse();
                        while (reader.pos < end) {
                            var tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                message.status = reader.int32();
                                break;
                            case 2:
                                message.offlinecount = reader.uint32();
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        if (!message.hasOwnProperty("status"))
                            throw $util.ProtocolError("missing required 'status'", { instance: message });
                        if (!message.hasOwnProperty("offlinecount"))
                            throw $util.ProtocolError("missing required 'offlinecount'", { instance: message });
                        return message;
                    };

                    /**
                     * Decodes a LoginResponse message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof com.kabao.login.proto.LoginResponse
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {com.kabao.login.proto.LoginResponse} LoginResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    LoginResponse.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a LoginResponse message.
                     * @function verify
                     * @memberof com.kabao.login.proto.LoginResponse
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    LoginResponse.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (!$util.isInteger(message.status))
                            return "status: integer expected";
                        if (!$util.isInteger(message.offlinecount))
                            return "offlinecount: integer expected";
                        return null;
                    };

                    /**
                     * Creates a LoginResponse message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof com.kabao.login.proto.LoginResponse
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {com.kabao.login.proto.LoginResponse} LoginResponse
                     */
                    LoginResponse.fromObject = function fromObject(object) {
                        if (object instanceof $root.com.kabao.login.proto.LoginResponse)
                            return object;
                        var message = new $root.com.kabao.login.proto.LoginResponse();
                        if (object.status != null)
                            message.status = object.status | 0;
                        if (object.offlinecount != null)
                            message.offlinecount = object.offlinecount >>> 0;
                        return message;
                    };

                    /**
                     * Creates a plain object from a LoginResponse message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof com.kabao.login.proto.LoginResponse
                     * @static
                     * @param {com.kabao.login.proto.LoginResponse} message LoginResponse
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    LoginResponse.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        var object = {};
                        if (options.defaults) {
                            object.status = 0;
                            object.offlinecount = 0;
                        }
                        if (message.status != null && message.hasOwnProperty("status"))
                            object.status = message.status;
                        if (message.offlinecount != null && message.hasOwnProperty("offlinecount"))
                            object.offlinecount = message.offlinecount;
                        return object;
                    };

                    /**
                     * Converts this LoginResponse to JSON.
                     * @function toJSON
                     * @memberof com.kabao.login.proto.LoginResponse
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    LoginResponse.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    /**
                     * Error enum.
                     * @enum {string}
                     * @property {number} ERR_OK=0 ERR_OK value
                     * @property {number} ERR_SYS=-1 ERR_SYS value
                     */
                    LoginResponse.Error = (function() {
                        var valuesById = {}, values = Object.create(valuesById);
                        values[valuesById[0] = "ERR_OK"] = 0;
                        values[valuesById[-1] = "ERR_SYS"] = -1;
                        return values;
                    })();

                    return LoginResponse;
                })();

                return proto;
            })();

            return login;
        })();

        return kabao;
    })();

    return com;
})();

$root.kafaka = (function() {

    /**
     * Namespace kafaka.
     * @exports kafaka
     * @namespace
     */
    var kafaka = {};

    kafaka.ClusterMessage = (function() {

        /**
         * Properties of a ClusterMessage.
         * @memberof kafaka
         * @interface IClusterMessage
         * @property {Array.<number|Long>} [userId] ClusterMessage userId
         * @property {number|Long} srcId ClusterMessage srcId
         * @property {boolean} issingle ClusterMessage issingle
         * @property {number} cmd ClusterMessage cmd
         * @property {number} seq ClusterMessage seq
         * @property {number|Long} recvtime ClusterMessage recvtime
         * @property {Uint8Array} transData ClusterMessage transData
         */

        /**
         * Constructs a new ClusterMessage.
         * @memberof kafaka
         * @classdesc Represents a ClusterMessage.
         * @constructor
         * @param {kafaka.IClusterMessage=} [properties] Properties to set
         */
        function ClusterMessage(properties) {
            this.userId = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ClusterMessage userId.
         * @member {Array.<number|Long>}userId
         * @memberof kafaka.ClusterMessage
         * @instance
         */
        ClusterMessage.prototype.userId = $util.emptyArray;

        /**
         * ClusterMessage srcId.
         * @member {number|Long}srcId
         * @memberof kafaka.ClusterMessage
         * @instance
         */
        ClusterMessage.prototype.srcId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * ClusterMessage issingle.
         * @member {boolean}issingle
         * @memberof kafaka.ClusterMessage
         * @instance
         */
        ClusterMessage.prototype.issingle = false;

        /**
         * ClusterMessage cmd.
         * @member {number}cmd
         * @memberof kafaka.ClusterMessage
         * @instance
         */
        ClusterMessage.prototype.cmd = 0;

        /**
         * ClusterMessage seq.
         * @member {number}seq
         * @memberof kafaka.ClusterMessage
         * @instance
         */
        ClusterMessage.prototype.seq = 0;

        /**
         * ClusterMessage recvtime.
         * @member {number|Long}recvtime
         * @memberof kafaka.ClusterMessage
         * @instance
         */
        ClusterMessage.prototype.recvtime = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * ClusterMessage transData.
         * @member {Uint8Array}transData
         * @memberof kafaka.ClusterMessage
         * @instance
         */
        ClusterMessage.prototype.transData = $util.newBuffer([]);

        /**
         * Creates a new ClusterMessage instance using the specified properties.
         * @function create
         * @memberof kafaka.ClusterMessage
         * @static
         * @param {kafaka.IClusterMessage=} [properties] Properties to set
         * @returns {kafaka.ClusterMessage} ClusterMessage instance
         */
        ClusterMessage.create = function create(properties) {
            return new ClusterMessage(properties);
        };

        /**
         * Encodes the specified ClusterMessage message. Does not implicitly {@link kafaka.ClusterMessage.verify|verify} messages.
         * @function encode
         * @memberof kafaka.ClusterMessage
         * @static
         * @param {kafaka.IClusterMessage} message ClusterMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ClusterMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.userId != null && message.userId.length)
                for (var i = 0; i < message.userId.length; ++i)
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.userId[i]);
            writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.srcId);
            writer.uint32(/* id 3, wireType 0 =*/24).bool(message.issingle);
            writer.uint32(/* id 4, wireType 0 =*/32).int32(message.cmd);
            writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.seq);
            writer.uint32(/* id 6, wireType 0 =*/48).uint64(message.recvtime);
            writer.uint32(/* id 7, wireType 2 =*/58).bytes(message.transData);
            return writer;
        };

        /**
         * Encodes the specified ClusterMessage message, length delimited. Does not implicitly {@link kafaka.ClusterMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof kafaka.ClusterMessage
         * @static
         * @param {kafaka.IClusterMessage} message ClusterMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ClusterMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ClusterMessage message from the specified reader or buffer.
         * @function decode
         * @memberof kafaka.ClusterMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {kafaka.ClusterMessage} ClusterMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ClusterMessage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.kafaka.ClusterMessage();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.userId && message.userId.length))
                        message.userId = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.userId.push(reader.uint64());
                    } else
                        message.userId.push(reader.uint64());
                    break;
                case 2:
                    message.srcId = reader.uint64();
                    break;
                case 3:
                    message.issingle = reader.bool();
                    break;
                case 4:
                    message.cmd = reader.int32();
                    break;
                case 5:
                    message.seq = reader.uint32();
                    break;
                case 6:
                    message.recvtime = reader.uint64();
                    break;
                case 7:
                    message.transData = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("srcId"))
                throw $util.ProtocolError("missing required 'srcId'", { instance: message });
            if (!message.hasOwnProperty("issingle"))
                throw $util.ProtocolError("missing required 'issingle'", { instance: message });
            if (!message.hasOwnProperty("cmd"))
                throw $util.ProtocolError("missing required 'cmd'", { instance: message });
            if (!message.hasOwnProperty("seq"))
                throw $util.ProtocolError("missing required 'seq'", { instance: message });
            if (!message.hasOwnProperty("recvtime"))
                throw $util.ProtocolError("missing required 'recvtime'", { instance: message });
            if (!message.hasOwnProperty("transData"))
                throw $util.ProtocolError("missing required 'transData'", { instance: message });
            return message;
        };

        /**
         * Decodes a ClusterMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof kafaka.ClusterMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {kafaka.ClusterMessage} ClusterMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ClusterMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ClusterMessage message.
         * @function verify
         * @memberof kafaka.ClusterMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ClusterMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.userId != null && message.hasOwnProperty("userId")) {
                if (!Array.isArray(message.userId))
                    return "userId: array expected";
                for (var i = 0; i < message.userId.length; ++i)
                    if (!$util.isInteger(message.userId[i]) && !(message.userId[i] && $util.isInteger(message.userId[i].low) && $util.isInteger(message.userId[i].high)))
                        return "userId: integer|Long[] expected";
            }
            if (!$util.isInteger(message.srcId) && !(message.srcId && $util.isInteger(message.srcId.low) && $util.isInteger(message.srcId.high)))
                return "srcId: integer|Long expected";
            if (typeof message.issingle !== "boolean")
                return "issingle: boolean expected";
            if (!$util.isInteger(message.cmd))
                return "cmd: integer expected";
            if (!$util.isInteger(message.seq))
                return "seq: integer expected";
            if (!$util.isInteger(message.recvtime) && !(message.recvtime && $util.isInteger(message.recvtime.low) && $util.isInteger(message.recvtime.high)))
                return "recvtime: integer|Long expected";
            if (!(message.transData && typeof message.transData.length === "number" || $util.isString(message.transData)))
                return "transData: buffer expected";
            return null;
        };

        /**
         * Creates a ClusterMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof kafaka.ClusterMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {kafaka.ClusterMessage} ClusterMessage
         */
        ClusterMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.kafaka.ClusterMessage)
                return object;
            var message = new $root.kafaka.ClusterMessage();
            if (object.userId) {
                if (!Array.isArray(object.userId))
                    throw TypeError(".kafaka.ClusterMessage.userId: array expected");
                message.userId = [];
                for (var i = 0; i < object.userId.length; ++i)
                    if ($util.Long)
                        (message.userId[i] = $util.Long.fromValue(object.userId[i])).unsigned = true;
                    else if (typeof object.userId[i] === "string")
                        message.userId[i] = parseInt(object.userId[i], 10);
                    else if (typeof object.userId[i] === "number")
                        message.userId[i] = object.userId[i];
                    else if (typeof object.userId[i] === "object")
                        message.userId[i] = new $util.LongBits(object.userId[i].low >>> 0, object.userId[i].high >>> 0).toNumber(true);
            }
            if (object.srcId != null)
                if ($util.Long)
                    (message.srcId = $util.Long.fromValue(object.srcId)).unsigned = true;
                else if (typeof object.srcId === "string")
                    message.srcId = parseInt(object.srcId, 10);
                else if (typeof object.srcId === "number")
                    message.srcId = object.srcId;
                else if (typeof object.srcId === "object")
                    message.srcId = new $util.LongBits(object.srcId.low >>> 0, object.srcId.high >>> 0).toNumber(true);
            if (object.issingle != null)
                message.issingle = Boolean(object.issingle);
            if (object.cmd != null)
                message.cmd = object.cmd | 0;
            if (object.seq != null)
                message.seq = object.seq >>> 0;
            if (object.recvtime != null)
                if ($util.Long)
                    (message.recvtime = $util.Long.fromValue(object.recvtime)).unsigned = true;
                else if (typeof object.recvtime === "string")
                    message.recvtime = parseInt(object.recvtime, 10);
                else if (typeof object.recvtime === "number")
                    message.recvtime = object.recvtime;
                else if (typeof object.recvtime === "object")
                    message.recvtime = new $util.LongBits(object.recvtime.low >>> 0, object.recvtime.high >>> 0).toNumber(true);
            if (object.transData != null)
                if (typeof object.transData === "string")
                    $util.base64.decode(object.transData, message.transData = $util.newBuffer($util.base64.length(object.transData)), 0);
                else if (object.transData.length)
                    message.transData = object.transData;
            return message;
        };

        /**
         * Creates a plain object from a ClusterMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof kafaka.ClusterMessage
         * @static
         * @param {kafaka.ClusterMessage} message ClusterMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ClusterMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.userId = [];
            if (options.defaults) {
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.srcId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.srcId = options.longs === String ? "0" : 0;
                object.issingle = false;
                object.cmd = 0;
                object.seq = 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.recvtime = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.recvtime = options.longs === String ? "0" : 0;
                object.transData = options.bytes === String ? "" : [];
            }
            if (message.userId && message.userId.length) {
                object.userId = [];
                for (var j = 0; j < message.userId.length; ++j)
                    if (typeof message.userId[j] === "number")
                        object.userId[j] = options.longs === String ? String(message.userId[j]) : message.userId[j];
                    else
                        object.userId[j] = options.longs === String ? $util.Long.prototype.toString.call(message.userId[j]) : options.longs === Number ? new $util.LongBits(message.userId[j].low >>> 0, message.userId[j].high >>> 0).toNumber(true) : message.userId[j];
            }
            if (message.srcId != null && message.hasOwnProperty("srcId"))
                if (typeof message.srcId === "number")
                    object.srcId = options.longs === String ? String(message.srcId) : message.srcId;
                else
                    object.srcId = options.longs === String ? $util.Long.prototype.toString.call(message.srcId) : options.longs === Number ? new $util.LongBits(message.srcId.low >>> 0, message.srcId.high >>> 0).toNumber(true) : message.srcId;
            if (message.issingle != null && message.hasOwnProperty("issingle"))
                object.issingle = message.issingle;
            if (message.cmd != null && message.hasOwnProperty("cmd"))
                object.cmd = message.cmd;
            if (message.seq != null && message.hasOwnProperty("seq"))
                object.seq = message.seq;
            if (message.recvtime != null && message.hasOwnProperty("recvtime"))
                if (typeof message.recvtime === "number")
                    object.recvtime = options.longs === String ? String(message.recvtime) : message.recvtime;
                else
                    object.recvtime = options.longs === String ? $util.Long.prototype.toString.call(message.recvtime) : options.longs === Number ? new $util.LongBits(message.recvtime.low >>> 0, message.recvtime.high >>> 0).toNumber(true) : message.recvtime;
            if (message.transData != null && message.hasOwnProperty("transData"))
                object.transData = options.bytes === String ? $util.base64.encode(message.transData, 0, message.transData.length) : options.bytes === Array ? Array.prototype.slice.call(message.transData) : message.transData;
            return object;
        };

        /**
         * Converts this ClusterMessage to JSON.
         * @function toJSON
         * @memberof kafaka.ClusterMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ClusterMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ClusterMessage;
    })();

    return kafaka;
})();

$root.kabao = (function() {

    /**
     * Namespace kabao.
     * @exports kabao
     * @namespace
     */
    var kabao = {};

    kabao.loginout = (function() {

        /**
         * Namespace loginout.
         * @memberof kabao
         * @namespace
         */
        var loginout = {};

        loginout.LoginOutRequest = (function() {

            /**
             * Properties of a LoginOutRequest.
             * @memberof kabao.loginout
             * @interface ILoginOutRequest
             * @property {number|Long} uuid LoginOutRequest uuid
             */

            /**
             * Constructs a new LoginOutRequest.
             * @memberof kabao.loginout
             * @classdesc Represents a LoginOutRequest.
             * @constructor
             * @param {kabao.loginout.ILoginOutRequest=} [properties] Properties to set
             */
            function LoginOutRequest(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * LoginOutRequest uuid.
             * @member {number|Long}uuid
             * @memberof kabao.loginout.LoginOutRequest
             * @instance
             */
            LoginOutRequest.prototype.uuid = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Creates a new LoginOutRequest instance using the specified properties.
             * @function create
             * @memberof kabao.loginout.LoginOutRequest
             * @static
             * @param {kabao.loginout.ILoginOutRequest=} [properties] Properties to set
             * @returns {kabao.loginout.LoginOutRequest} LoginOutRequest instance
             */
            LoginOutRequest.create = function create(properties) {
                return new LoginOutRequest(properties);
            };

            /**
             * Encodes the specified LoginOutRequest message. Does not implicitly {@link kabao.loginout.LoginOutRequest.verify|verify} messages.
             * @function encode
             * @memberof kabao.loginout.LoginOutRequest
             * @static
             * @param {kabao.loginout.ILoginOutRequest} message LoginOutRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LoginOutRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.uuid);
                return writer;
            };

            /**
             * Encodes the specified LoginOutRequest message, length delimited. Does not implicitly {@link kabao.loginout.LoginOutRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kabao.loginout.LoginOutRequest
             * @static
             * @param {kabao.loginout.ILoginOutRequest} message LoginOutRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LoginOutRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a LoginOutRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kabao.loginout.LoginOutRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kabao.loginout.LoginOutRequest} LoginOutRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LoginOutRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.kabao.loginout.LoginOutRequest();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.uuid = reader.uint64();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                if (!message.hasOwnProperty("uuid"))
                    throw $util.ProtocolError("missing required 'uuid'", { instance: message });
                return message;
            };

            /**
             * Decodes a LoginOutRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kabao.loginout.LoginOutRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kabao.loginout.LoginOutRequest} LoginOutRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LoginOutRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a LoginOutRequest message.
             * @function verify
             * @memberof kabao.loginout.LoginOutRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            LoginOutRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (!$util.isInteger(message.uuid) && !(message.uuid && $util.isInteger(message.uuid.low) && $util.isInteger(message.uuid.high)))
                    return "uuid: integer|Long expected";
                return null;
            };

            /**
             * Creates a LoginOutRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kabao.loginout.LoginOutRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kabao.loginout.LoginOutRequest} LoginOutRequest
             */
            LoginOutRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kabao.loginout.LoginOutRequest)
                    return object;
                var message = new $root.kabao.loginout.LoginOutRequest();
                if (object.uuid != null)
                    if ($util.Long)
                        (message.uuid = $util.Long.fromValue(object.uuid)).unsigned = true;
                    else if (typeof object.uuid === "string")
                        message.uuid = parseInt(object.uuid, 10);
                    else if (typeof object.uuid === "number")
                        message.uuid = object.uuid;
                    else if (typeof object.uuid === "object")
                        message.uuid = new $util.LongBits(object.uuid.low >>> 0, object.uuid.high >>> 0).toNumber(true);
                return message;
            };

            /**
             * Creates a plain object from a LoginOutRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kabao.loginout.LoginOutRequest
             * @static
             * @param {kabao.loginout.LoginOutRequest} message LoginOutRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            LoginOutRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.uuid = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.uuid = options.longs === String ? "0" : 0;
                if (message.uuid != null && message.hasOwnProperty("uuid"))
                    if (typeof message.uuid === "number")
                        object.uuid = options.longs === String ? String(message.uuid) : message.uuid;
                    else
                        object.uuid = options.longs === String ? $util.Long.prototype.toString.call(message.uuid) : options.longs === Number ? new $util.LongBits(message.uuid.low >>> 0, message.uuid.high >>> 0).toNumber(true) : message.uuid;
                return object;
            };

            /**
             * Converts this LoginOutRequest to JSON.
             * @function toJSON
             * @memberof kabao.loginout.LoginOutRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            LoginOutRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return LoginOutRequest;
        })();

        loginout.LoginOutResponse = (function() {

            /**
             * Properties of a LoginOutResponse.
             * @memberof kabao.loginout
             * @interface ILoginOutResponse
             * @property {number} status LoginOutResponse status
             */

            /**
             * Constructs a new LoginOutResponse.
             * @memberof kabao.loginout
             * @classdesc Represents a LoginOutResponse.
             * @constructor
             * @param {kabao.loginout.ILoginOutResponse=} [properties] Properties to set
             */
            function LoginOutResponse(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * LoginOutResponse status.
             * @member {number}status
             * @memberof kabao.loginout.LoginOutResponse
             * @instance
             */
            LoginOutResponse.prototype.status = 0;

            /**
             * Creates a new LoginOutResponse instance using the specified properties.
             * @function create
             * @memberof kabao.loginout.LoginOutResponse
             * @static
             * @param {kabao.loginout.ILoginOutResponse=} [properties] Properties to set
             * @returns {kabao.loginout.LoginOutResponse} LoginOutResponse instance
             */
            LoginOutResponse.create = function create(properties) {
                return new LoginOutResponse(properties);
            };

            /**
             * Encodes the specified LoginOutResponse message. Does not implicitly {@link kabao.loginout.LoginOutResponse.verify|verify} messages.
             * @function encode
             * @memberof kabao.loginout.LoginOutResponse
             * @static
             * @param {kabao.loginout.ILoginOutResponse} message LoginOutResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LoginOutResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.status);
                return writer;
            };

            /**
             * Encodes the specified LoginOutResponse message, length delimited. Does not implicitly {@link kabao.loginout.LoginOutResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kabao.loginout.LoginOutResponse
             * @static
             * @param {kabao.loginout.ILoginOutResponse} message LoginOutResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LoginOutResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a LoginOutResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kabao.loginout.LoginOutResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kabao.loginout.LoginOutResponse} LoginOutResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LoginOutResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.kabao.loginout.LoginOutResponse();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.status = reader.int32();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                if (!message.hasOwnProperty("status"))
                    throw $util.ProtocolError("missing required 'status'", { instance: message });
                return message;
            };

            /**
             * Decodes a LoginOutResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kabao.loginout.LoginOutResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kabao.loginout.LoginOutResponse} LoginOutResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LoginOutResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a LoginOutResponse message.
             * @function verify
             * @memberof kabao.loginout.LoginOutResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            LoginOutResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (!$util.isInteger(message.status))
                    return "status: integer expected";
                return null;
            };

            /**
             * Creates a LoginOutResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kabao.loginout.LoginOutResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kabao.loginout.LoginOutResponse} LoginOutResponse
             */
            LoginOutResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kabao.loginout.LoginOutResponse)
                    return object;
                var message = new $root.kabao.loginout.LoginOutResponse();
                if (object.status != null)
                    message.status = object.status | 0;
                return message;
            };

            /**
             * Creates a plain object from a LoginOutResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kabao.loginout.LoginOutResponse
             * @static
             * @param {kabao.loginout.LoginOutResponse} message LoginOutResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            LoginOutResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.status = 0;
                if (message.status != null && message.hasOwnProperty("status"))
                    object.status = message.status;
                return object;
            };

            /**
             * Converts this LoginOutResponse to JSON.
             * @function toJSON
             * @memberof kabao.loginout.LoginOutResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            LoginOutResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Error enum.
             * @enum {string}
             * @property {number} ERR_OK=0 ERR_OK value
             * @property {number} ERR_SYS=-1 ERR_SYS value
             */
            LoginOutResponse.Error = (function() {
                var valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "ERR_OK"] = 0;
                values[valuesById[-1] = "ERR_SYS"] = -1;
                return values;
            })();

            return LoginOutResponse;
        })();

        return loginout;
    })();

    kabao.push = (function() {

        /**
         * Namespace push.
         * @memberof kabao
         * @namespace
         */
        var push = {};

        push.PushMessageRequest = (function() {

            /**
             * Properties of a PushMessageRequest.
             * @memberof kabao.push
             * @interface IPushMessageRequest
             * @property {number|Long} destid PushMessageRequest destid
             * @property {number|Long} srcid PushMessageRequest srcid
             * @property {number|Long} helpid PushMessageRequest helpid
             * @property {number} msgtype PushMessageRequest msgtype
             * @property {string} msg PushMessageRequest msg
             */

            /**
             * Constructs a new PushMessageRequest.
             * @memberof kabao.push
             * @classdesc Represents a PushMessageRequest.
             * @constructor
             * @param {kabao.push.IPushMessageRequest=} [properties] Properties to set
             */
            function PushMessageRequest(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * PushMessageRequest destid.
             * @member {number|Long}destid
             * @memberof kabao.push.PushMessageRequest
             * @instance
             */
            PushMessageRequest.prototype.destid = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * PushMessageRequest srcid.
             * @member {number|Long}srcid
             * @memberof kabao.push.PushMessageRequest
             * @instance
             */
            PushMessageRequest.prototype.srcid = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * PushMessageRequest helpid.
             * @member {number|Long}helpid
             * @memberof kabao.push.PushMessageRequest
             * @instance
             */
            PushMessageRequest.prototype.helpid = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * PushMessageRequest msgtype.
             * @member {number}msgtype
             * @memberof kabao.push.PushMessageRequest
             * @instance
             */
            PushMessageRequest.prototype.msgtype = 0;

            /**
             * PushMessageRequest msg.
             * @member {string}msg
             * @memberof kabao.push.PushMessageRequest
             * @instance
             */
            PushMessageRequest.prototype.msg = "";

            /**
             * Creates a new PushMessageRequest instance using the specified properties.
             * @function create
             * @memberof kabao.push.PushMessageRequest
             * @static
             * @param {kabao.push.IPushMessageRequest=} [properties] Properties to set
             * @returns {kabao.push.PushMessageRequest} PushMessageRequest instance
             */
            PushMessageRequest.create = function create(properties) {
                return new PushMessageRequest(properties);
            };

            /**
             * Encodes the specified PushMessageRequest message. Does not implicitly {@link kabao.push.PushMessageRequest.verify|verify} messages.
             * @function encode
             * @memberof kabao.push.PushMessageRequest
             * @static
             * @param {kabao.push.IPushMessageRequest} message PushMessageRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PushMessageRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.destid);
                writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.srcid);
                writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.helpid);
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.msgtype);
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.msg);
                return writer;
            };

            /**
             * Encodes the specified PushMessageRequest message, length delimited. Does not implicitly {@link kabao.push.PushMessageRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kabao.push.PushMessageRequest
             * @static
             * @param {kabao.push.IPushMessageRequest} message PushMessageRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PushMessageRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a PushMessageRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kabao.push.PushMessageRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kabao.push.PushMessageRequest} PushMessageRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PushMessageRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.kabao.push.PushMessageRequest();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.destid = reader.uint64();
                        break;
                    case 2:
                        message.srcid = reader.uint64();
                        break;
                    case 3:
                        message.helpid = reader.uint64();
                        break;
                    case 4:
                        message.msgtype = reader.int32();
                        break;
                    case 5:
                        message.msg = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                if (!message.hasOwnProperty("destid"))
                    throw $util.ProtocolError("missing required 'destid'", { instance: message });
                if (!message.hasOwnProperty("srcid"))
                    throw $util.ProtocolError("missing required 'srcid'", { instance: message });
                if (!message.hasOwnProperty("helpid"))
                    throw $util.ProtocolError("missing required 'helpid'", { instance: message });
                if (!message.hasOwnProperty("msgtype"))
                    throw $util.ProtocolError("missing required 'msgtype'", { instance: message });
                if (!message.hasOwnProperty("msg"))
                    throw $util.ProtocolError("missing required 'msg'", { instance: message });
                return message;
            };

            /**
             * Decodes a PushMessageRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kabao.push.PushMessageRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kabao.push.PushMessageRequest} PushMessageRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PushMessageRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a PushMessageRequest message.
             * @function verify
             * @memberof kabao.push.PushMessageRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            PushMessageRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (!$util.isInteger(message.destid) && !(message.destid && $util.isInteger(message.destid.low) && $util.isInteger(message.destid.high)))
                    return "destid: integer|Long expected";
                if (!$util.isInteger(message.srcid) && !(message.srcid && $util.isInteger(message.srcid.low) && $util.isInteger(message.srcid.high)))
                    return "srcid: integer|Long expected";
                if (!$util.isInteger(message.helpid) && !(message.helpid && $util.isInteger(message.helpid.low) && $util.isInteger(message.helpid.high)))
                    return "helpid: integer|Long expected";
                if (!$util.isInteger(message.msgtype))
                    return "msgtype: integer expected";
                if (!$util.isString(message.msg))
                    return "msg: string expected";
                return null;
            };

            /**
             * Creates a PushMessageRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kabao.push.PushMessageRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kabao.push.PushMessageRequest} PushMessageRequest
             */
            PushMessageRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kabao.push.PushMessageRequest)
                    return object;
                var message = new $root.kabao.push.PushMessageRequest();
                if (object.destid != null)
                    if ($util.Long)
                        (message.destid = $util.Long.fromValue(object.destid)).unsigned = true;
                    else if (typeof object.destid === "string")
                        message.destid = parseInt(object.destid, 10);
                    else if (typeof object.destid === "number")
                        message.destid = object.destid;
                    else if (typeof object.destid === "object")
                        message.destid = new $util.LongBits(object.destid.low >>> 0, object.destid.high >>> 0).toNumber(true);
                if (object.srcid != null)
                    if ($util.Long)
                        (message.srcid = $util.Long.fromValue(object.srcid)).unsigned = true;
                    else if (typeof object.srcid === "string")
                        message.srcid = parseInt(object.srcid, 10);
                    else if (typeof object.srcid === "number")
                        message.srcid = object.srcid;
                    else if (typeof object.srcid === "object")
                        message.srcid = new $util.LongBits(object.srcid.low >>> 0, object.srcid.high >>> 0).toNumber(true);
                if (object.helpid != null)
                    if ($util.Long)
                        (message.helpid = $util.Long.fromValue(object.helpid)).unsigned = true;
                    else if (typeof object.helpid === "string")
                        message.helpid = parseInt(object.helpid, 10);
                    else if (typeof object.helpid === "number")
                        message.helpid = object.helpid;
                    else if (typeof object.helpid === "object")
                        message.helpid = new $util.LongBits(object.helpid.low >>> 0, object.helpid.high >>> 0).toNumber(true);
                if (object.msgtype != null)
                    message.msgtype = object.msgtype | 0;
                if (object.msg != null)
                    message.msg = String(object.msg);
                return message;
            };

            /**
             * Creates a plain object from a PushMessageRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kabao.push.PushMessageRequest
             * @static
             * @param {kabao.push.PushMessageRequest} message PushMessageRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            PushMessageRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.destid = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.destid = options.longs === String ? "0" : 0;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.srcid = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.srcid = options.longs === String ? "0" : 0;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.helpid = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.helpid = options.longs === String ? "0" : 0;
                    object.msgtype = 0;
                    object.msg = "";
                }
                if (message.destid != null && message.hasOwnProperty("destid"))
                    if (typeof message.destid === "number")
                        object.destid = options.longs === String ? String(message.destid) : message.destid;
                    else
                        object.destid = options.longs === String ? $util.Long.prototype.toString.call(message.destid) : options.longs === Number ? new $util.LongBits(message.destid.low >>> 0, message.destid.high >>> 0).toNumber(true) : message.destid;
                if (message.srcid != null && message.hasOwnProperty("srcid"))
                    if (typeof message.srcid === "number")
                        object.srcid = options.longs === String ? String(message.srcid) : message.srcid;
                    else
                        object.srcid = options.longs === String ? $util.Long.prototype.toString.call(message.srcid) : options.longs === Number ? new $util.LongBits(message.srcid.low >>> 0, message.srcid.high >>> 0).toNumber(true) : message.srcid;
                if (message.helpid != null && message.hasOwnProperty("helpid"))
                    if (typeof message.helpid === "number")
                        object.helpid = options.longs === String ? String(message.helpid) : message.helpid;
                    else
                        object.helpid = options.longs === String ? $util.Long.prototype.toString.call(message.helpid) : options.longs === Number ? new $util.LongBits(message.helpid.low >>> 0, message.helpid.high >>> 0).toNumber(true) : message.helpid;
                if (message.msgtype != null && message.hasOwnProperty("msgtype"))
                    object.msgtype = message.msgtype;
                if (message.msg != null && message.hasOwnProperty("msg"))
                    object.msg = message.msg;
                return object;
            };

            /**
             * Converts this PushMessageRequest to JSON.
             * @function toJSON
             * @memberof kabao.push.PushMessageRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            PushMessageRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * MsgType enum.
             * @enum {string}
             * @property {number} TEXT_MESSAGE=0 TEXT_MESSAGE value
             * @property {number} IMAGE_MESSAGE=1 IMAGE_MESSAGE value
             * @property {number} AUDIO_MESSAGE=2 AUDIO_MESSAGE value
             * @property {number} VIDEO_MESSAGE=3 VIDEO_MESSAGE value
             * @property {number} EXPRESSION_MESSAGE=4 EXPRESSION_MESSAGE value
             * @property {number} POSITION_MESSAGE=5 POSITION_MESSAGE value
             * @property {number} SYSTEM_MESSAGE=6 SYSTEM_MESSAGE value
             * @property {number} NULL_MESSAGE=7 NULL_MESSAGE value
             * @property {number} TRANSFER_COLLECTION_MESSAGE=8 TRANSFER_COLLECTION_MESSAGE value
             */
            PushMessageRequest.MsgType = (function() {
                var valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "TEXT_MESSAGE"] = 0;
                values[valuesById[1] = "IMAGE_MESSAGE"] = 1;
                values[valuesById[2] = "AUDIO_MESSAGE"] = 2;
                values[valuesById[3] = "VIDEO_MESSAGE"] = 3;
                values[valuesById[4] = "EXPRESSION_MESSAGE"] = 4;
                values[valuesById[5] = "POSITION_MESSAGE"] = 5;
                values[valuesById[6] = "SYSTEM_MESSAGE"] = 6;
                values[valuesById[7] = "NULL_MESSAGE"] = 7;
                values[valuesById[8] = "TRANSFER_COLLECTION_MESSAGE"] = 8;
                return values;
            })();

            return PushMessageRequest;
        })();

        push.PushMessageResponse = (function() {

            /**
             * Properties of a PushMessageResponse.
             * @memberof kabao.push
             * @interface IPushMessageResponse
             * @property {number} status PushMessageResponse status
             * @property {number|Long} recvtime PushMessageResponse recvtime
             */

            /**
             * Constructs a new PushMessageResponse.
             * @memberof kabao.push
             * @classdesc Represents a PushMessageResponse.
             * @constructor
             * @param {kabao.push.IPushMessageResponse=} [properties] Properties to set
             */
            function PushMessageResponse(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * PushMessageResponse status.
             * @member {number}status
             * @memberof kabao.push.PushMessageResponse
             * @instance
             */
            PushMessageResponse.prototype.status = 0;

            /**
             * PushMessageResponse recvtime.
             * @member {number|Long}recvtime
             * @memberof kabao.push.PushMessageResponse
             * @instance
             */
            PushMessageResponse.prototype.recvtime = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Creates a new PushMessageResponse instance using the specified properties.
             * @function create
             * @memberof kabao.push.PushMessageResponse
             * @static
             * @param {kabao.push.IPushMessageResponse=} [properties] Properties to set
             * @returns {kabao.push.PushMessageResponse} PushMessageResponse instance
             */
            PushMessageResponse.create = function create(properties) {
                return new PushMessageResponse(properties);
            };

            /**
             * Encodes the specified PushMessageResponse message. Does not implicitly {@link kabao.push.PushMessageResponse.verify|verify} messages.
             * @function encode
             * @memberof kabao.push.PushMessageResponse
             * @static
             * @param {kabao.push.IPushMessageResponse} message PushMessageResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PushMessageResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.status);
                writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.recvtime);
                return writer;
            };

            /**
             * Encodes the specified PushMessageResponse message, length delimited. Does not implicitly {@link kabao.push.PushMessageResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kabao.push.PushMessageResponse
             * @static
             * @param {kabao.push.IPushMessageResponse} message PushMessageResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PushMessageResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a PushMessageResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kabao.push.PushMessageResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kabao.push.PushMessageResponse} PushMessageResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PushMessageResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.kabao.push.PushMessageResponse();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.status = reader.int32();
                        break;
                    case 2:
                        message.recvtime = reader.uint64();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                if (!message.hasOwnProperty("status"))
                    throw $util.ProtocolError("missing required 'status'", { instance: message });
                if (!message.hasOwnProperty("recvtime"))
                    throw $util.ProtocolError("missing required 'recvtime'", { instance: message });
                return message;
            };

            /**
             * Decodes a PushMessageResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kabao.push.PushMessageResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kabao.push.PushMessageResponse} PushMessageResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PushMessageResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a PushMessageResponse message.
             * @function verify
             * @memberof kabao.push.PushMessageResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            PushMessageResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (!$util.isInteger(message.status))
                    return "status: integer expected";
                if (!$util.isInteger(message.recvtime) && !(message.recvtime && $util.isInteger(message.recvtime.low) && $util.isInteger(message.recvtime.high)))
                    return "recvtime: integer|Long expected";
                return null;
            };

            /**
             * Creates a PushMessageResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kabao.push.PushMessageResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kabao.push.PushMessageResponse} PushMessageResponse
             */
            PushMessageResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kabao.push.PushMessageResponse)
                    return object;
                var message = new $root.kabao.push.PushMessageResponse();
                if (object.status != null)
                    message.status = object.status | 0;
                if (object.recvtime != null)
                    if ($util.Long)
                        (message.recvtime = $util.Long.fromValue(object.recvtime)).unsigned = true;
                    else if (typeof object.recvtime === "string")
                        message.recvtime = parseInt(object.recvtime, 10);
                    else if (typeof object.recvtime === "number")
                        message.recvtime = object.recvtime;
                    else if (typeof object.recvtime === "object")
                        message.recvtime = new $util.LongBits(object.recvtime.low >>> 0, object.recvtime.high >>> 0).toNumber(true);
                return message;
            };

            /**
             * Creates a plain object from a PushMessageResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kabao.push.PushMessageResponse
             * @static
             * @param {kabao.push.PushMessageResponse} message PushMessageResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            PushMessageResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.status = 0;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.recvtime = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.recvtime = options.longs === String ? "0" : 0;
                }
                if (message.status != null && message.hasOwnProperty("status"))
                    object.status = message.status;
                if (message.recvtime != null && message.hasOwnProperty("recvtime"))
                    if (typeof message.recvtime === "number")
                        object.recvtime = options.longs === String ? String(message.recvtime) : message.recvtime;
                    else
                        object.recvtime = options.longs === String ? $util.Long.prototype.toString.call(message.recvtime) : options.longs === Number ? new $util.LongBits(message.recvtime.low >>> 0, message.recvtime.high >>> 0).toNumber(true) : message.recvtime;
                return object;
            };

            /**
             * Converts this PushMessageResponse to JSON.
             * @function toJSON
             * @memberof kabao.push.PushMessageResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            PushMessageResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Error enum.
             * @enum {string}
             * @property {number} ERR_OK=0 ERR_OK value
             * @property {number} ERR_SYS=-1 ERR_SYS value
             */
            PushMessageResponse.Error = (function() {
                var valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "ERR_OK"] = 0;
                values[valuesById[-1] = "ERR_SYS"] = -1;
                return values;
            })();

            return PushMessageResponse;
        })();

        return push;
    })();

    kabao.revoke = (function() {

        /**
         * Namespace revoke.
         * @memberof kabao
         * @namespace
         */
        var revoke = {};

        revoke.RevokeMessageRequest = (function() {

            /**
             * Properties of a RevokeMessageRequest.
             * @memberof kabao.revoke
             * @interface IRevokeMessageRequest
             * @property {number|Long} destid RevokeMessageRequest destid
             * @property {number|Long} srcid RevokeMessageRequest srcid
             * @property {number|Long} [groupid] RevokeMessageRequest groupid
             * @property {number|Long} recvtime RevokeMessageRequest recvtime
             * @property {number} sequence RevokeMessageRequest sequence
             */

            /**
             * Constructs a new RevokeMessageRequest.
             * @memberof kabao.revoke
             * @classdesc Represents a RevokeMessageRequest.
             * @constructor
             * @param {kabao.revoke.IRevokeMessageRequest=} [properties] Properties to set
             */
            function RevokeMessageRequest(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * RevokeMessageRequest destid.
             * @member {number|Long}destid
             * @memberof kabao.revoke.RevokeMessageRequest
             * @instance
             */
            RevokeMessageRequest.prototype.destid = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * RevokeMessageRequest srcid.
             * @member {number|Long}srcid
             * @memberof kabao.revoke.RevokeMessageRequest
             * @instance
             */
            RevokeMessageRequest.prototype.srcid = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * RevokeMessageRequest groupid.
             * @member {number|Long}groupid
             * @memberof kabao.revoke.RevokeMessageRequest
             * @instance
             */
            RevokeMessageRequest.prototype.groupid = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * RevokeMessageRequest recvtime.
             * @member {number|Long}recvtime
             * @memberof kabao.revoke.RevokeMessageRequest
             * @instance
             */
            RevokeMessageRequest.prototype.recvtime = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * RevokeMessageRequest sequence.
             * @member {number}sequence
             * @memberof kabao.revoke.RevokeMessageRequest
             * @instance
             */
            RevokeMessageRequest.prototype.sequence = 0;

            /**
             * Creates a new RevokeMessageRequest instance using the specified properties.
             * @function create
             * @memberof kabao.revoke.RevokeMessageRequest
             * @static
             * @param {kabao.revoke.IRevokeMessageRequest=} [properties] Properties to set
             * @returns {kabao.revoke.RevokeMessageRequest} RevokeMessageRequest instance
             */
            RevokeMessageRequest.create = function create(properties) {
                return new RevokeMessageRequest(properties);
            };

            /**
             * Encodes the specified RevokeMessageRequest message. Does not implicitly {@link kabao.revoke.RevokeMessageRequest.verify|verify} messages.
             * @function encode
             * @memberof kabao.revoke.RevokeMessageRequest
             * @static
             * @param {kabao.revoke.IRevokeMessageRequest} message RevokeMessageRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            RevokeMessageRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.destid);
                writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.srcid);
                if (message.groupid != null && message.hasOwnProperty("groupid"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.groupid);
                writer.uint32(/* id 4, wireType 0 =*/32).uint64(message.recvtime);
                writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.sequence);
                return writer;
            };

            /**
             * Encodes the specified RevokeMessageRequest message, length delimited. Does not implicitly {@link kabao.revoke.RevokeMessageRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kabao.revoke.RevokeMessageRequest
             * @static
             * @param {kabao.revoke.IRevokeMessageRequest} message RevokeMessageRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            RevokeMessageRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a RevokeMessageRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kabao.revoke.RevokeMessageRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kabao.revoke.RevokeMessageRequest} RevokeMessageRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            RevokeMessageRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.kabao.revoke.RevokeMessageRequest();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.destid = reader.uint64();
                        break;
                    case 2:
                        message.srcid = reader.uint64();
                        break;
                    case 3:
                        message.groupid = reader.uint64();
                        break;
                    case 4:
                        message.recvtime = reader.uint64();
                        break;
                    case 5:
                        message.sequence = reader.uint32();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                if (!message.hasOwnProperty("destid"))
                    throw $util.ProtocolError("missing required 'destid'", { instance: message });
                if (!message.hasOwnProperty("srcid"))
                    throw $util.ProtocolError("missing required 'srcid'", { instance: message });
                if (!message.hasOwnProperty("recvtime"))
                    throw $util.ProtocolError("missing required 'recvtime'", { instance: message });
                if (!message.hasOwnProperty("sequence"))
                    throw $util.ProtocolError("missing required 'sequence'", { instance: message });
                return message;
            };

            /**
             * Decodes a RevokeMessageRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kabao.revoke.RevokeMessageRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kabao.revoke.RevokeMessageRequest} RevokeMessageRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            RevokeMessageRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a RevokeMessageRequest message.
             * @function verify
             * @memberof kabao.revoke.RevokeMessageRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            RevokeMessageRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (!$util.isInteger(message.destid) && !(message.destid && $util.isInteger(message.destid.low) && $util.isInteger(message.destid.high)))
                    return "destid: integer|Long expected";
                if (!$util.isInteger(message.srcid) && !(message.srcid && $util.isInteger(message.srcid.low) && $util.isInteger(message.srcid.high)))
                    return "srcid: integer|Long expected";
                if (message.groupid != null && message.hasOwnProperty("groupid"))
                    if (!$util.isInteger(message.groupid) && !(message.groupid && $util.isInteger(message.groupid.low) && $util.isInteger(message.groupid.high)))
                        return "groupid: integer|Long expected";
                if (!$util.isInteger(message.recvtime) && !(message.recvtime && $util.isInteger(message.recvtime.low) && $util.isInteger(message.recvtime.high)))
                    return "recvtime: integer|Long expected";
                if (!$util.isInteger(message.sequence))
                    return "sequence: integer expected";
                return null;
            };

            /**
             * Creates a RevokeMessageRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kabao.revoke.RevokeMessageRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kabao.revoke.RevokeMessageRequest} RevokeMessageRequest
             */
            RevokeMessageRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kabao.revoke.RevokeMessageRequest)
                    return object;
                var message = new $root.kabao.revoke.RevokeMessageRequest();
                if (object.destid != null)
                    if ($util.Long)
                        (message.destid = $util.Long.fromValue(object.destid)).unsigned = true;
                    else if (typeof object.destid === "string")
                        message.destid = parseInt(object.destid, 10);
                    else if (typeof object.destid === "number")
                        message.destid = object.destid;
                    else if (typeof object.destid === "object")
                        message.destid = new $util.LongBits(object.destid.low >>> 0, object.destid.high >>> 0).toNumber(true);
                if (object.srcid != null)
                    if ($util.Long)
                        (message.srcid = $util.Long.fromValue(object.srcid)).unsigned = true;
                    else if (typeof object.srcid === "string")
                        message.srcid = parseInt(object.srcid, 10);
                    else if (typeof object.srcid === "number")
                        message.srcid = object.srcid;
                    else if (typeof object.srcid === "object")
                        message.srcid = new $util.LongBits(object.srcid.low >>> 0, object.srcid.high >>> 0).toNumber(true);
                if (object.groupid != null)
                    if ($util.Long)
                        (message.groupid = $util.Long.fromValue(object.groupid)).unsigned = true;
                    else if (typeof object.groupid === "string")
                        message.groupid = parseInt(object.groupid, 10);
                    else if (typeof object.groupid === "number")
                        message.groupid = object.groupid;
                    else if (typeof object.groupid === "object")
                        message.groupid = new $util.LongBits(object.groupid.low >>> 0, object.groupid.high >>> 0).toNumber(true);
                if (object.recvtime != null)
                    if ($util.Long)
                        (message.recvtime = $util.Long.fromValue(object.recvtime)).unsigned = true;
                    else if (typeof object.recvtime === "string")
                        message.recvtime = parseInt(object.recvtime, 10);
                    else if (typeof object.recvtime === "number")
                        message.recvtime = object.recvtime;
                    else if (typeof object.recvtime === "object")
                        message.recvtime = new $util.LongBits(object.recvtime.low >>> 0, object.recvtime.high >>> 0).toNumber(true);
                if (object.sequence != null)
                    message.sequence = object.sequence >>> 0;
                return message;
            };

            /**
             * Creates a plain object from a RevokeMessageRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kabao.revoke.RevokeMessageRequest
             * @static
             * @param {kabao.revoke.RevokeMessageRequest} message RevokeMessageRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            RevokeMessageRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.destid = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.destid = options.longs === String ? "0" : 0;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.srcid = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.srcid = options.longs === String ? "0" : 0;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.groupid = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.groupid = options.longs === String ? "0" : 0;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.recvtime = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.recvtime = options.longs === String ? "0" : 0;
                    object.sequence = 0;
                }
                if (message.destid != null && message.hasOwnProperty("destid"))
                    if (typeof message.destid === "number")
                        object.destid = options.longs === String ? String(message.destid) : message.destid;
                    else
                        object.destid = options.longs === String ? $util.Long.prototype.toString.call(message.destid) : options.longs === Number ? new $util.LongBits(message.destid.low >>> 0, message.destid.high >>> 0).toNumber(true) : message.destid;
                if (message.srcid != null && message.hasOwnProperty("srcid"))
                    if (typeof message.srcid === "number")
                        object.srcid = options.longs === String ? String(message.srcid) : message.srcid;
                    else
                        object.srcid = options.longs === String ? $util.Long.prototype.toString.call(message.srcid) : options.longs === Number ? new $util.LongBits(message.srcid.low >>> 0, message.srcid.high >>> 0).toNumber(true) : message.srcid;
                if (message.groupid != null && message.hasOwnProperty("groupid"))
                    if (typeof message.groupid === "number")
                        object.groupid = options.longs === String ? String(message.groupid) : message.groupid;
                    else
                        object.groupid = options.longs === String ? $util.Long.prototype.toString.call(message.groupid) : options.longs === Number ? new $util.LongBits(message.groupid.low >>> 0, message.groupid.high >>> 0).toNumber(true) : message.groupid;
                if (message.recvtime != null && message.hasOwnProperty("recvtime"))
                    if (typeof message.recvtime === "number")
                        object.recvtime = options.longs === String ? String(message.recvtime) : message.recvtime;
                    else
                        object.recvtime = options.longs === String ? $util.Long.prototype.toString.call(message.recvtime) : options.longs === Number ? new $util.LongBits(message.recvtime.low >>> 0, message.recvtime.high >>> 0).toNumber(true) : message.recvtime;
                if (message.sequence != null && message.hasOwnProperty("sequence"))
                    object.sequence = message.sequence;
                return object;
            };

            /**
             * Converts this RevokeMessageRequest to JSON.
             * @function toJSON
             * @memberof kabao.revoke.RevokeMessageRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            RevokeMessageRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return RevokeMessageRequest;
        })();

        revoke.RevokeMessageResponse = (function() {

            /**
             * Properties of a RevokeMessageResponse.
             * @memberof kabao.revoke
             * @interface IRevokeMessageResponse
             * @property {number} status RevokeMessageResponse status
             */

            /**
             * Constructs a new RevokeMessageResponse.
             * @memberof kabao.revoke
             * @classdesc Represents a RevokeMessageResponse.
             * @constructor
             * @param {kabao.revoke.IRevokeMessageResponse=} [properties] Properties to set
             */
            function RevokeMessageResponse(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * RevokeMessageResponse status.
             * @member {number}status
             * @memberof kabao.revoke.RevokeMessageResponse
             * @instance
             */
            RevokeMessageResponse.prototype.status = 0;

            /**
             * Creates a new RevokeMessageResponse instance using the specified properties.
             * @function create
             * @memberof kabao.revoke.RevokeMessageResponse
             * @static
             * @param {kabao.revoke.IRevokeMessageResponse=} [properties] Properties to set
             * @returns {kabao.revoke.RevokeMessageResponse} RevokeMessageResponse instance
             */
            RevokeMessageResponse.create = function create(properties) {
                return new RevokeMessageResponse(properties);
            };

            /**
             * Encodes the specified RevokeMessageResponse message. Does not implicitly {@link kabao.revoke.RevokeMessageResponse.verify|verify} messages.
             * @function encode
             * @memberof kabao.revoke.RevokeMessageResponse
             * @static
             * @param {kabao.revoke.IRevokeMessageResponse} message RevokeMessageResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            RevokeMessageResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.status);
                return writer;
            };

            /**
             * Encodes the specified RevokeMessageResponse message, length delimited. Does not implicitly {@link kabao.revoke.RevokeMessageResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kabao.revoke.RevokeMessageResponse
             * @static
             * @param {kabao.revoke.IRevokeMessageResponse} message RevokeMessageResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            RevokeMessageResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a RevokeMessageResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kabao.revoke.RevokeMessageResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kabao.revoke.RevokeMessageResponse} RevokeMessageResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            RevokeMessageResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.kabao.revoke.RevokeMessageResponse();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.status = reader.int32();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                if (!message.hasOwnProperty("status"))
                    throw $util.ProtocolError("missing required 'status'", { instance: message });
                return message;
            };

            /**
             * Decodes a RevokeMessageResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kabao.revoke.RevokeMessageResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kabao.revoke.RevokeMessageResponse} RevokeMessageResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            RevokeMessageResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a RevokeMessageResponse message.
             * @function verify
             * @memberof kabao.revoke.RevokeMessageResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            RevokeMessageResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (!$util.isInteger(message.status))
                    return "status: integer expected";
                return null;
            };

            /**
             * Creates a RevokeMessageResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kabao.revoke.RevokeMessageResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kabao.revoke.RevokeMessageResponse} RevokeMessageResponse
             */
            RevokeMessageResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kabao.revoke.RevokeMessageResponse)
                    return object;
                var message = new $root.kabao.revoke.RevokeMessageResponse();
                if (object.status != null)
                    message.status = object.status | 0;
                return message;
            };

            /**
             * Creates a plain object from a RevokeMessageResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kabao.revoke.RevokeMessageResponse
             * @static
             * @param {kabao.revoke.RevokeMessageResponse} message RevokeMessageResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            RevokeMessageResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.status = 0;
                if (message.status != null && message.hasOwnProperty("status"))
                    object.status = message.status;
                return object;
            };

            /**
             * Converts this RevokeMessageResponse to JSON.
             * @function toJSON
             * @memberof kabao.revoke.RevokeMessageResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            RevokeMessageResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Error enum.
             * @enum {string}
             * @property {number} ERR_OK=0 ERR_OK value
             * @property {number} ERR_SYS=-1 ERR_SYS value
             * @property {number} ERR_TIMEOUT=-2 ERR_TIMEOUT value
             */
            RevokeMessageResponse.Error = (function() {
                var valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "ERR_OK"] = 0;
                values[valuesById[-1] = "ERR_SYS"] = -1;
                values[valuesById[-2] = "ERR_TIMEOUT"] = -2;
                return values;
            })();

            return RevokeMessageResponse;
        })();

        return revoke;
    })();

    return kabao;
})();

module.exports = $root;
