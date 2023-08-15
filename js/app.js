import { musicsData } from "./musicData.js";

// musicData from musicData.js file --->> ./musicData.js
const bar = document.querySelector('.bar'),
    navBar = document.querySelector('nav'),
    barTags = bar.querySelectorAll('span'),
    musicBar = document.querySelector('.musicBar'),
    musicBarHeading = document.querySelector('.musicBar h3'),
    musicList = musicBar.querySelector('#musicList'),
    musicListMusics = musicList.querySelectorAll('li'),
    previewWrapper = document.querySelector('.previewWrapper'),
    previewWrapperImg = document.querySelector('.previewWrapper img'),
    musicPortion = document.querySelector('#musicPortion'),
    musicBox = document.querySelector('.musicBox'),
    currentMusic = document.querySelector('.musicBox audio'),
    timeLineRange = document.querySelector('#timeLineRange'),
    soundLineRange = document.querySelector('#soundLineRange'),
    playBtn = document.querySelector('.control .playBtn'),
    volumeBtn = document.querySelector('.control .volumeBtn'),
    prev = document.querySelector('.control .fa-backward-step'),
    next = document.querySelector('.control .fa-forward-step'),
    backward = document.querySelector('.control .fa-backward'),
    forward = document.querySelector('.control .fa-forward'),
    passedTime = document.querySelector('.control .passedTime'),
    remainTime = document.querySelector('.control .remainTime'),
    durationTime = document.querySelector('.control .durationTime'),
    musicName = document.querySelector('.musicName'),
    musicianName = document.querySelector('.musicianName'),
    randomBtn = document.querySelector('#randomBtn'),
    repeatBtn = document.querySelector('#repeatBtn'),
    serialBtn = document.querySelector('#serialBtn'),
    controlBtns = musicPortion.querySelectorAll('.controlBtns button'),
    root = document.querySelector(':root'),
    keyBoardSortCutIcon = document.querySelector('.keyBoardSortCut .icon'),
    keysList = document.querySelector('.keysList');
    
timeLineRange.value = 0;
soundLineRange.value = 1;
currentMusic.loop = true;

let rangeLineWidth = {
    timeLineWidth: (rangeWidth) => {
        root.style.setProperty('--timeCurrentWidth', rangeWidth + '%');
    },
    soundLineWidth: (rangeWidth) => {
        root.style.setProperty('--soundCurrentWidth', rangeWidth + '%');
    }
}
rangeLineWidth.timeLineWidth(0);
rangeLineWidth.soundLineWidth(100);

// menubar hamburger icon ==================
bar.addEventListener('click', () => {
    bar.classList.toggle('active');
    musicBar.classList.toggle('active');
})

// Sidebar List creation start =====================
const createMusicListItem = (data, indx) => {
    let li = document.createElement('li');
    li.innerHTML = `<span></span>${data}`;
    li.setAttribute('musicIndx', indx);
    return li;
}
let appendMusicItemInMusicList = (musicsData, musicList) => {
    musicsData.forEach((music, indx) => {
        let songName = music.songName;
        let prevLen = songName.length;
        songName = songName.slice(0, 22);
        songName += prevLen > 22 ? "...." : '';
        musicList.appendChild(createMusicListItem(songName, indx));
    })
}




let pauseMusic = () => {
    currentMusic.pause();
    previewWrapper.classList.remove('anim');
    playBtn.classList.replace('fa-pause', 'fa-play');
    musicBox.classList.remove('active');
}
let playMusic = () => {
    currentMusic.play();
    previewWrapper.classList.add('anim');
    playBtn.classList.replace('fa-play', 'fa-pause');
    musicBox.classList.add('active');
}
let playPause = () => {
    currentMusic.paused ? playMusic() : pauseMusic();
}
playBtn.addEventListener('click', playPause);

let currentMusicIndx = 0;
let currentMusicFinder = (indx) => {
    currentMusicIndx = indx;
    currentMusic.src = musicsData[currentMusicIndx].songLink;
    musicName.innerText = musicsData[currentMusicIndx].songName;
    musicianName.innerText = musicsData[currentMusicIndx].singerName;
    previewWrapperImg.src = musicsData[currentMusicIndx].songPreviewImg;
    
    for(let i=0; i<musicList.children.length; i++){
        if(i==indx) musicList.children[i].classList.add('active');
        else musicList.children[i].classList.remove('active');
    }
    playMusic();
}
window.addEventListener('load', () => {
    appendMusicItemInMusicList(musicsData, musicList);
    keysListOpenClose();
    currentMusicFinder(0);
    pauseMusic();
})
currentMusicFinder(currentMusicIndx);


const muteIconSetting = () => {
    if (currentMusic.volume == 0) volumeBtn.classList.replace('fa-volume-high', 'fa-volume-xmark');
    else volumeBtn.classList.replace('fa-volume-xmark', 'fa-volume-high');
}
const mutedIconClick = () => {
    if (currentMusic.volume == 0) currentMusic.volume = 1, soundLineRange.value = 1;
    else currentMusic.volume = 0, soundLineRange.value = 0;
    muteIconSetting();
    rangeLineWidth.soundLineWidth(currentMusic.volume * 100);
}
volumeBtn.addEventListener('click', mutedIconClick);


let otherControl = () => {
    let currentTimeTemp = Math.round(Number(currentMusic.currentTime)),
        durationTemp = Number(currentMusic.duration);
    let backWardTime = () => {
        currentTimeTemp = (currentTimeTemp - 5) < 0 ? 0 : (currentTimeTemp - 5);
        currentMusic.currentTime = currentTimeTemp;
    }
    let forWardTime = () => {
        currentTimeTemp = (currentTimeTemp + 5) > durationTemp ? durationTemp : (currentTimeTemp + 5);
        currentMusic.currentTime = currentTimeTemp;
    }
    backward.addEventListener('click', backWardTime);
    forward.addEventListener('click', forWardTime);
}
// Time start ===================
const timeFunctionality = (audioDuration, audioPassed) => {
    let getFormatedTime = (time) => {
        let timeArr = [];
        timeArr.push(Math.floor(time / 3600));
        time %= 3600;
        timeArr.push(Math.floor(time / 60));
        time %= 60;
        timeArr.push(Math.round(time));
        return timeArr;
    }
    let setTimeInHTML = (tagToChange, timeArr) => {
        let isAnyNAN = false;
        timeArr.forEach((item) => {
            if (isNaN(item)) {
                isAnyNAN = true;
            }
        })
        if (!isAnyNAN) {
            tagToChange.innerText = `${timeArr[0]==0? '': (timeArr[0]<10? ('0'+timeArr[0]):timeArr[0])}${(timeArr[0]>0?(':') : '')}${timeArr[1]==0?'00':(timeArr[1]<10? ('0'+timeArr[1]):timeArr[1])}:${timeArr[2]==0? '00': (timeArr[2]<10? ('0'+timeArr[2]):timeArr[2])}`;
        }
    }
    setTimeInHTML(durationTime, getFormatedTime(Number(currentMusic.duration)));
    setTimeInHTML(passedTime, getFormatedTime(Number(currentMusic.currentTime)));
    setTimeInHTML(remainTime, getFormatedTime(Number(currentMusic.duration - currentMusic.currentTime)));
}
// Time end ===================
// next prev ===========================
const prevNext = {
    nextMusic: () => {
        currentMusicIndx = (currentMusicIndx + 1) % musicsData.length;
        currentMusicFinder(currentMusicIndx);
        playMusic();
    },
    previousMusic: () => {
        currentMusicIndx = Math.abs((musicsData.length + currentMusicIndx - 1) % musicsData.length);
        currentMusicFinder(currentMusicIndx);
        playMusic();
    }
}
next.addEventListener('click', prevNext.nextMusic);
prev.addEventListener('click', prevNext.previousMusic);

//  Forward backwoard through arrowKey ========================
const forWardBackWardArrowControl = () => {
    let cTime = currentMusic.currentTime,
        dTime = currentMusic.duration;
    let arrowBackrWard = () => {
        cTime = (cTime - 5) < 0 ? 0 : (cTime - 5);
        currentMusic.currentTime = cTime;
    }
    let arrowForWard = () => {
        cTime = (cTime + 5) > dTime ? dTime : (cTime + 5);
        currentMusic.currentTime = cTime;
    }
    let controlTimeThroughNum = (num)=>{
        cTime = (dTime/10)*num;
        currentMusic.currentTime = cTime;
    }
    document.addEventListener('keydown', (e) => {
        if (e.key == 'ArrowLeft') arrowBackrWard();
        else if (e.key == 'ArrowRight') arrowForWard();
        else if(!e.ctrlKey && e.key>='0' && e.key<='9'){
            controlTimeThroughNum(e.key);
        }
    })
}

const volumeUpDown = {
    volumeUp: () => {
        currentMusic.volume = (Number(currentMusic.volume) + 0.05) > 1 ? 1 : (Number(currentMusic.volume) + 0.05);
        soundLineRange.value = currentMusic.volume;
        // it is important when audio is paused and you need to control the audio sound level
        muteIconSetting();
        // it is important when audio is paused and you need to control the audio sound level
        rangeLineWidth.soundLineWidth(currentMusic.volume * 100);
    },
    volumeDown: () => {
        currentMusic.volume = (Number(currentMusic.volume) - 0.05) < 0 ? 0 : (Number(currentMusic.volume) - 0.05);
        soundLineRange.value = currentMusic.volume;
        // it is important when audio is paused and you need to control the audio sound level
        muteIconSetting();
        // it is important when audio is paused and you need to control the audio sound level
        rangeLineWidth.soundLineWidth(currentMusic.volume * 100);
    },
    controlVolumeThroughNum: (num)=>{
        currentMusic.volume = num/10;
    }
}

// KeyBoard ShortCut PopUp start=============================
// =======================================
// =======================================

// keyBoardSortCutIcon
// keysList
let keysListOpenClose = ()=>{
    keyBoardSortCutIcon.classList.toggle('active');
    (keyBoardSortCutIcon.classList.contains('fa-keyboard')) ? (keyBoardSortCutIcon.classList.replace('fa-keyboard', 'fa-xmark')) : (keyBoardSortCutIcon.classList.replace('fa-xmark', 'fa-keyboard'));
    
    keysList.classList.toggle('active');
}
keyBoardSortCutIcon.addEventListener('click', keysListOpenClose);
// KeyBoard ShortCut PopUp start=============================
// =======================================
// =======================================

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key == 'b') {
        e.preventDefault();
        bar.classList.toggle('active');
        musicBar.classList.toggle('active');
    } else if (e.key == ' ') {
        playPause();
    } else if (e.ctrlKey && e.key == 'ArrowRight') {
        prevNext.nextMusic();
    } else if (e.ctrlKey && e.key == 'ArrowLeft') {
        prevNext.previousMusic();
    } else if (e.key == 'ArrowUp') {
        volumeUpDown.volumeUp();
    } else if (e.key == 'ArrowDown') {
        volumeUpDown.volumeDown();
    } else if (e.key == 'm' || e.key == 'M') {
        e.preventDefault();
        mutedIconClick();
    } else if (e.key == 'k' ||  e.key == 'K') {
        e.preventDefault();
        keysListOpenClose();
    }else if (e.ctrlKey && e.key>='0' && e.key<='9') {
        e.preventDefault();
        volumeUpDown.controlVolumeThroughNum(e.key);
    }
})
soundLineRange.addEventListener('input', () => {
    currentMusic.volume = soundLineRange.value;
    muteIconSetting();
    rangeLineWidth.soundLineWidth(currentMusic.volume*100);
})

// This is mainly two major Range Maniupulation
const audioLineChanges = () => {
    timeLineRange.value = (Number(currentMusic.currentTime) / Number(currentMusic.duration)) * 100;
}
const timeLineRangeInput = () => {
    timeLineRange.addEventListener('input', () => {
        currentMusic.currentTime = (timeLineRange.value / 100) * currentMusic.duration;
    })
}

//  FlowStyle Buttons class setting start ================
controlBtns.forEach((button, indx) => {
    button.addEventListener('click', () => {
        controlBtns.forEach((btn) => {
            (btn.classList.contains('active')) ? (btn.classList.remove('active')) : null;
        })
        button.classList.add('active');
    })
})
//  FlowStyle Buttons class setting end ================

// FlowStyle start ===============================
const flowStyle = () => {
    if (serialBtn.classList.contains('active') && Math.floor(currentMusic.currentTime) == Math.floor(currentMusic.duration)) {
        currentMusic.loop = false;
        currentMusicIndx = (currentMusicIndx + 1) % musicsData.length;
        currentMusicFinder(currentMusicIndx);
    }else if (randomBtn.classList.contains('active') && Math.floor(currentMusic.currentTime) == Math.floor(currentMusic.duration)) {
        currentMusic.loop = false;
        currentMusicIndx = Math.floor(Math.random() * musicsData.length);
        currentMusicFinder(currentMusicIndx);
    }else{
        currentMusic.loop = true;
    }
}
// FlowStyle end ===============================

// Make all update when music is one ============================= 
currentMusic.addEventListener('timeupdate', () => {
    timeFunctionality(Number(currentMusic.duration), Number(currentMusic.currentTime));
    otherControl();
    forWardBackWardArrowControl();
    audioLineChanges();
    timeLineRangeInput();
    rangeLineWidth.timeLineWidth((currentMusic.currentTime / currentMusic.duration) * 100);
    rangeLineWidth.soundLineWidth(currentMusic.volume * 100);
    // FlowStyle ==========================
    flowStyle();
})


// This is for the feature where if the popup is on and you clicked outside it. it will be automatically off
// where  clickedTarget---> is where we click it's target (e.target)  
// element---> is which popup we want to hide
// button--> is by default what is our popup's trigger button
// classToAddOrRemove---> the class is added had to remove
// ClassToRemove and ClassToAdd---> are only when you need to change in trigger icon class else null
let blankClickAutoOffEffect = (clickedTarget, element, button, classToAddOrRemove, classToRemove=null, classToAdd=null)=>{
    if(!(element.contains(clickedTarget)) && element.classList.contains(classToAddOrRemove) && !(button.contains(clickedTarget))){
        element.classList.remove(classToAddOrRemove);
        button.classList.toggle(classToAddOrRemove);
        // ClassToRemove and ClassToAdd---> are only when you need to change in trigger icon class
        if((classToAdd+classToAdd)!=null){
            button.classList.replace(classToRemove, classToAdd);
        }
    }
}

document.addEventListener('click', (e)=>{
    // console.log(e.target);
    blankClickAutoOffEffect(e.target, musicBar, bar, 'active');
    blankClickAutoOffEffect(e.target, keysList, keyBoardSortCutIcon, 'active', 'fa-xmark', 'fa-keyboard');
    let len, arr;
    if(musicList.contains(e.target)){
        let list = e.target;
        currentMusicFinder(list.getAttribute('musicindx'));
    }
})
