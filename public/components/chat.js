function chat_addChat(chatArray, teams, chatBoxElement) {
    chatArray[0] = new Date(chatArray[0]);

    fetch("/components/chat.html").then((response) => response.text()).then((text) => {
        const element2add = new DOMParser().parseFromString(text, "text/xml");

        element2add.querySelector(".chat-timestamp").innerText = `${chatArray[0].getHours().toString().padStart(2, "0")}:${chatArray[0].getMinutes().toString().padStart(2, "0")}:${chatArray[0].getSeconds().toString().padStart(2, "0")}`;
        element2add.querySelector(".chat-nick").innerText = chatArray[1];

        let team = -1;
        for (let i = 0; i < teams.length; i++) {
            for (let j = 0; j < teams[0].players.length; j++) {
                if (chatArray[1] === teams[i].players[j]) {
                    team = i;
                }
            }
        }
        if (team === 0) {
            element2add.querySelector(".chat-nick").style.color = "var(--nick-red)";
        } else if (team === 1) {
            element2add.querySelector(".chat-nick").style.color = "var(--nick-blue)";
        } else {
            element2add.querySelector(".chat-nick").style.color = "var(--nick-yellow)";
        }

        element2add.querySelector(".chat-msg").innerText = chatArray[2];

        chatBoxElement.appendChild(element2add);
    });
}

function chat_clearChat(chatBoxElement) {
    chatBoxElement.innerHTML = "";
}

let chatCount = 0;

function chat_updateChat(chat, chatBoxElement) {
    if (chat.length > chatCount) {
        console.log("going to add a new chat!");

        let chats2addCount;
        chats2addCount = chat.length - chatCount;
        chatCount = chat.length;

        for (let i = 0; i < chats2addCount; i++) {
            chat_addChat(chat[chat.length - 1 - i], overlayData.teams, chatBoxElement);
        }
    } else if (chat.length < chatCount) {
        chat_clearChat();
        chatCount = 0;
    }
}