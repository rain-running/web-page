<template>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <div class="chat-container">
        <div class="key-input" v-if="showMyDiv" id="myDiv">
            <el-input v-model="inputKey" placeholder="请输入访问key" clearable @keyup.enter="saveKey" />

            <el-button type="primary" @click="saveKey">save</el-button>
        </div>
        <div class="chat-header">
            <h2>{{ chatTitle }}</h2>
        </div>
        <div class="chat-dialogue" ref="dialogue">
            <div v-for="(message, index) in messages" :key="index" class="chat-message">
                <!-- <el-avatar :src="message.url" :shape="square" :fit="fit" :size="30" class=" margin-right: 10px"></el-avatar> -->
                <!-- <span>{{ message.content }}</span> -->
                <div class="s-dev">
                    <div v-if="message.isFromUser" class="avatar">
                        <img :src="require('@/assets/user1.jpg')" alt="Avatar">
                    </div>
                    <div v-else class="avatar">
                        <img :src="require('@/assets/bot.jpeg')" alt="Avatar">
                    </div>
                    <!-- <div class="s-text">

                        <p :id="message.id" v-html="message.content"></p>
                    </div> -->

                    <div :id="message.id" v-html="message.content"
                        :class="{ 'user-message': message.isFromUser, 'server-message': !message.isFromUser }"></div>

                </div>
            </div>
        </div>
        <div class="chat-input">
            <el-input v-model="inputMessage" v-bind:disabled="isDisabled" placeholder="请输入消息内容,回车发送" @keyup.enter="sendMessage" />
            <!-- <el-button type="primary" @click="sendMessage">send</el-button> -->
            <el-button type="danger" @click="clearMessages">clear</el-button>
        </div>
    </div>
</template>

<style src="../css/chat.css"></style>
 
<script>
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';
import MarkdownIt from 'markdown-it';


export default {
    name: 'AboutPage',
    data() {
        return {
            chatTitle: 'Chatgpt',
            inputMessage: '',
            inputKey: '',
            messages: [
                // { id: "1", content: '你好啊', isFromUser: true },
                // { id: "2", content: '好啊吼吼吼吼吼吼吼吼吼吼吼吼吼吼吼', isFromUser: false },
                // { id: "3", content: '天气怎么样', isFromUser: true },
                // { id: "4", content: '不好', isFromUser: false }
            ],
            uid: null,
            sse: null,
            marked: new MarkdownIt(),
            showMyDiv: true,
            isDisabled: false,

        };
    },
    mounted() {
        // localStorage.removeItem('key');
        var apiKey = localStorage.getItem('key');
        if (apiKey != null) {
            this.showMyDiv = false;
        }
        this.uid = uuidv4();
    },
    methods: {
        sendMessage() {
            var apiKey = localStorage.getItem('key');
            if (!apiKey) {
                alert('请输入访问key');
                return;
            }
            if (this.inputMessage.trim() === '') {
                return;
            }
            this.showMyDiv = false;
            var userMessage = this.inputMessage;
            this.messages.push({
                content: this.marked.render(this.inputMessage),
                isFromUser: true,
            });
            this.$nextTick(() => {
                this.$refs.dialogue.scrollTop = this.$refs.dialogue.scrollHeight;
            });
            var uuid = this.uid;
            if (uuid == null) {
                uuid = uuidv4();
            }
            const source = new EventSource('/api/createSse?uuId=' + uuid); // 发起SSE连接
            var uuStr = uuidv4();
            this.messages.push({
                content: "",
                isFromUser: false,
                id: uuStr
            });
            var text = "";
            source.onopen = (event) => {
                console.log(event.data); // 处理SSE消息
                var mod = {
                    "content": userMessage,
                    "uuId": uuid,
                    "apiKey": apiKey
                };
                this.axiosPostApi(mod, uuid);
            };

            source.onmessage = (event) => {
               // console.log(event.data); // 处理SSE消息
                if (event.data === "[DONE]") {
                    event.target.close();
                    //userInput.disabled = false;
                    this.isDisabled= false;
                    return;
                }
                var obj = JSON.parse(event.data);
                var message = obj.message.content;
                if (typeof message != 'undefined') {
                    text += message;
                    var textStr = document.getElementById(uuStr);
                    textStr.innerHTML = this.marked.render(text);
                }
            };

            this.inputMessage = '';
            this.isDisabled= true;


        },
        clearMessages() {
            this.messages = [];
        },
        saveKey() {
            var key = this.inputKey;
            localStorage.setItem('key', key);
            this.inputKey = ''
        },
        axiosPostApi(mod, uid) {
            console.log(uid);
            axios.post('/api/chat', mod, {
                headers: {
                    // 设置请求头参数
                    'Content-Type': 'application/json',
                    "uid": uid,
                }
            })
                .then(response => {
                    console.log("post res|" + response.data);
                })
                .catch(error => {
                    console.log(error);
                });
        }
    },

};
</script>
