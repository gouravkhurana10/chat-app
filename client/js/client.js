const socket = io();

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");
var audio = new Audio('ting.mp3');

function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

const append = (message, position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
    if (position == 'left'){
        audio.play();
    }
}

form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message} \n \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 ${formatAMPM(new Date)}`, 'right');
    socket.emit('send', message);
    messageInput.value = ''
});

const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);

socket.on('user-joined', name =>{
    append(`${name} joined the chat at ${formatAMPM(new Date)}.`, 'middle');
})

socket.on('receive', data =>{
    append(`${data.name}: ${data.message} \n \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 ${formatAMPM(new Date)}`, 'left');
})

socket.on('left', name =>{
    append(`${name} left the chat.`, 'middle');
})
