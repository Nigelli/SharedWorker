var worker = new SharedWorker("the-hub.js");
var messages;
var slavePos = {};

worker.port.addEventListener("message", function(e) {
    switch (true) {
        case e.data.channel == 'connections':
            document.getElementById('connection-count').innerText = e.data.content;
            if (e.data.content > 1) {
                initiateMultiScreenMode();
            }
            break;
        case e.data.channel == 'messages':
            messages =  e.data.content;
            setMessages();
            break;
        case e.data.channel == 'close':
            stopMultiScreenMode();
            break;
        case e.data.channel == 'slave-pos':
            slavePos = e.data.content;
            break;
    }

}, false);

worker.port.start();

var addNoteBtn = document.getElementById('add-note-button');
addNoteBtn.addEventListener('mouseup', function() {
    postNote();
})

var noteInput = document.getElementsByName('note')[0];
noteInput.addEventListener('keydown', function(e) {
    if (e.keyCode == 13) {
        postNote();
    }
})

function postNote() {
    worker.port.postMessage({ channel: 'message', content: noteInput.value});
    noteInput.value = '';
}

var multiScreenBtn = document.getElementById('multi-screen-button');
multiScreenBtn.addEventListener('mouseup', function() {
    if (multiScreenBtn.innerHTML != 'Enable') {
        worker.port.postMessage({ channel: 'close' })
    } else {
        multiScreen();
    }
})

function initiateMultiScreenMode() {
    document.getElementById('message-area').style.display = 'none';
    multiScreenBtn.innerHTML = 'Disable';
    multiScreenBtn.classList.add('btn-danger');
    multiScreenBtn.classList.remove('btn-primary');
}

function stopMultiScreenMode() {
    multiScreenBtn.innerHTML = 'Enable';
    document.getElementById('message-area').style.display = 'block';
    multiScreenBtn.classList.add('btn-primary');
    multiScreenBtn.classList.remove('btn-danger');
    setMessages();
}

function setMessages() {
    document.getElementById('messages').innerHTML = '';
    messages.forEach(message => {
        let el = document.createElement("li");
        el.innerText = message;
        document.getElementById('messages').appendChild(el);
    });
}

function multiScreen() {
    var newWindow = window.open('slave', '', 'scrollbars=yes, width=900, height=500');

    // Puts focus on the newWindow
    if (window.focus) {
        newWindow.focus();
    }
}