
if (!window.worker) {
    var worker = new SharedWorker("the-hub.js");

}
worker.port.addEventListener("message", function(e) {
    switch (true) {
        case e.data.channel == 'connections':
            break;
        case e.data.channel == 'messages':
            document.getElementById('messages').innerHTML = '';
            e.data.content.forEach(message => {
                let el = document.createElement("li");
                el.innerText = message;
                document.getElementById('messages').appendChild(el);
            });
            break;
        case e.data.channel == 'close':
            worker.port.postMessage({ channel: 'slave-pos', content: { left: window.screenX, top: window.screenY } });
            window.close();
            worker.port.close();
            document.getElementsByTagName('body')[0].innerHTML = '';
            break;
    }
}, false);

worker.port.start();

window.onbeforeunload = function(e) {
    worker.port.postMessage({ channel: 'slave-pos', content: { left: window.screenX, top: window.screenY } });
    worker.port.postMessage({ channel: 'close' });
  };