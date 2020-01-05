console.log("This app is created by Rudra Choubey using javascript, node js, css, html")
console.log("Used Node JS Third Party Modules: socket io, express")
// An app by rudra choubey
let socket = io();
let username = '';
let messageBox = document.querySelector('#message')
let nameBox = document.querySelector('#name')
let sendButton = document.querySelector('#send')
let okButton = document.querySelector('#ok')
let modal = document.querySelector('#modal')
let messages = document.querySelector('#messages')
let chat_box_color = document.querySelector('#chat-box-color')
let online_users = document.querySelector('#online-users')
let alerts = document.querySelector('#alts')
let cardStyle = 'info';

sendButton.onclick = function(){
    socket.emit('chat', {
        message:messageBox.value,
        name: username,
        color: cardStyle
    })
}
socket.on('user update',function(users){
    online_users.innerHTML = 'Online Users:'
    for(let i = 0;i < users.length;i++){
        const user = users[i].name;
        online_users.innerHTML += ` ${user},`
    }
})
okButton.onclick = function(){
    socket.emit('login',{
        username:nameBox.value,
    })
}
socket.on('login status',function(status){
    console.log(status)
    if(status.success){
        modal.className = 'modal'
        username = nameBox.value;
    }
    if(status.success == false)
    {
        alerts.innerHTML = `
        <div class="alert alert-danger">
            <strong>Username must be unique!</strong>
        </div>
        `
    }
})
for (let i = 0; i < chat_box_color.children.length; i++) {
    const button = chat_box_color.children[i];
    if(i != chat_box_color.length-1){
        button.style = 'margin-left:20px;'
    }
    button.onclick = function(){
        cardStyle = button.id;
    }
}

function randomE(array){
    return array[Math.floor(Math.random() * array.length)]
}
socket.on('chat',function(socket){
    let left_margin = 'col-sm-pull-4';
    if (socket.name != username){
        left_margin = 'col-sm-push-10';
    }
    let date = new Date()
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    let HTML = `
    <div class=" ${left_margin}">
        <div class="card text-white bg-${socket.color}" 
        style="width: 18rem; margin-left:20px; margin-top: 20px;">
            <div class='card-header'>${socket.name}</div>
            <div class="card-body">
                <p class="card-text">${socket.message}</p>
                <p class="card-subtitle mb-2 text-muted">
                    -${hours}:${minutes}:${seconds}
                </p>
            </div>
        </div>
    </div>
    `
    if(socket.message != '') messages.innerHTML = HTML + messages.innerHTML;
})