const { desktopCapturer,remote } = require('electron');
const { Menu, dialog } = remote;
const { writeFile } = require('fs');


const startBtn = document.querySelector('#startBtn');
const stopBtn = document.querySelector('#stopBtn');
const video = document.querySelector('video');
const videoSelectBtn = document.querySelector('#videoSelectBtn');
const time = document.querySelector('#time');

let mediaRecorder;
let mediaChunks = [];

videoSelectBtn.addEventListener('click', () => {
    getVideoSource();
})
const getVideoSource = () => {

    const sources = desktopCapturer.getSources({ types : ['window','screen'] })
    .then(source => {
        const videoOptions = Menu.buildFromTemplate(
            source.map(inputSource => {
                return{
                    label: inputSource.name,
                    click: () => selectedSource(inputSource)
                }
            })
        )
        videoOptions.popup();
    })
};

const selectedSource = (source) => {
    videoSelectBtn.innerText = source.name

    const constraints = {
        audio: false,
        video: {
            mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: source.id
            }
        }
    }
    const stream = navigator.mediaDevices.getUserMedia(constraints)
    .then(streams => {
        video.srcObject = streams;
        video.play();

        const options = {
            mimeType: 'video/webm; codecs=vp9'
        }
        mediaRecorder = new MediaRecorder(streams,options);

        mediaRecorder.ondataavailable = handledata;
        mediaRecorder.onstop = handleStop;
    });    
};

startBtn.addEventListener('click',(e) => {
    startBtn.innerHTML = 'Recording';
    startBtn.style.color = 'red';
    startBtn.style.background = 'white';   

    mediaRecorder.start();
});


stopBtn.addEventListener('click',(e) => {
    startBtn.innerHTML = 'Start';
    startBtn.style.color = 'white';
    startBtn.style.background = 'green';
    mediaRecorder.stop();
})

const handledata = (e) => {     
    console.log('Video Available')
    mediaChunks.push(e.data);
}

const handleStop = async (e) => {
    const blob = new Blob(mediaChunks,{
        mimeType: 'video/webm; codecs=vp9'
    })
    
    const buffer = Buffer.from(await blob.arrayBuffer())

    const { filePath } = await dialog.showSaveDialog({
        buttonLabel: 'Save Video',
        defaultPath: `video-${Date.now()}.webm`
    })
    console.log(filePath);
    writeFile(filePath,buffer,() => console.log('Saved succesfully'))
}
