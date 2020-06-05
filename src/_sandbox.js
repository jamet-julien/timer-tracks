import TimerTracks from "./index";
const tracks = [
    { name: "intro", duration: 5 },
    { name: "start", duration: 10 },
    { name: "end", duration: 5 },
    { name: "outro", duration: 20 }
];

const timerTracks = TimerTracks(tracks);
timerTracks.update(0);
timerTracks.current.name; //?
timerTracks.current.progress; //?

timerTracks.update(16);
timerTracks.current.name; //?
timerTracks.current.progress; //?

timerTracks.update(10);
timerTracks.current.name; //?
timerTracks.current.progress; //?

timerTracks.goTo("end");
timerTracks.current.name; //?
timerTracks.current.progress; //?

timerTracks.update(10);
timerTracks.current.name; //?
timerTracks.current.progress; //?

timerTracks.update(15);
timerTracks.current.name; //?
timerTracks.current.progress; //?
