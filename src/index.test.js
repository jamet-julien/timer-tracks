import TimerTracks from "./index";

const tracks = [
    { name: "intro", duration: 5 },
    { name: "start", duration: 10 },
    { name: "end", duration: 20 },
    { name: "outro", duration: 20 }
];

describe("Start", () => {
    it("First import right", () => {
        expect(typeof TimerTracks).toBe("function");
    });

    it("Required functions", () => {
        const instance = TimerTracks();
    });

    it("right path", () => {
        const timerTracks = TimerTracks(tracks);
        timerTracks.update(0);
        expect(timerTracks.current.name).toBe("intro"); //?
        expect(timerTracks.current.progress).toBe(0); //?

        timerTracks.update(5);
        expect(timerTracks.current.name).toBe("start"); //?
        expect(timerTracks.current.progress).toBe(0); //?

        timerTracks.update(10);
        expect(timerTracks.current.name).toBe("start"); //?
        expect(timerTracks.current.progress).toBe(0.5); //?

        timerTracks.update(15);
        expect(timerTracks.current.name).toBe("end"); //?
        expect(timerTracks.current.progress).toBe(0); //?

        timerTracks.update(25);
        expect(timerTracks.current.name).toBe("end"); //?
        expect(timerTracks.current.progress).toBe(0.5); //?

        timerTracks.update(100);
        expect(timerTracks.current.name).toBe(null); //?
        expect(timerTracks.current.progress).toBe(0); //?
    });
});
