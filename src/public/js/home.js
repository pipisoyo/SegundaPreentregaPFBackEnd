const socket = io();

let user;

window.onload = () => {
  Swal.fire({
    title: 'Identifícate',
    text: 'Ingresa tu email',
    input: "text",
    inputValidator: (value) => {
      return !value && "Necesitas escribir un mail valido para continuar";
    },
    confirmButtonText: 'OK'
  }).then((result) => {
    user = result.value;
    socket.emit('auth', user);
  });
};

const chatbox = document.getElementById("chatbox");
const log = document.getElementById("log");
const sendButton = document.getElementById("sendButton");

sendButton.addEventListener('click', () => {
  const message = chatbox.value.trim();
  if (message !== "") {
    socket.emit('message', { user: user, message: message });
    chatbox.value = "";
  }
});

socket.on('messageLogs', data => {
  let messages = "";
  data.forEach(msg => {
    messages += `${msg.user} dice ${msg.message}<br/>`;
  });
  log.innerHTML = messages;
});