import TimerTracks from "./index";

const tracks = [
    { name: "intro", duration: 5 },
    { name: "start", duration: 10 },
    { name: "end", duration: 20 },
    { name: "outro", duration: 20 }
];

describe("Eden path", () => {
    it("TimerTracks should be a function", () => {
        expect(typeof TimerTracks).toBe("function");
    });

    it("TimerTracks() should return object with attribute current", () => {
        const instance = TimerTracks();
        expect(instance).toHaveProperty("current");
        expect(instance.current).toHaveProperty("name");
        expect(instance.current).toHaveProperty("progress");
    });

    it("update() should increment `name` and `progress`", () => {
        const timerTracks = TimerTracks(tracks);
        timerTracks.update(0);
        expect(timerTracks.current.name).toBe("intro");
        expect(timerTracks.current.progress).toBe(0);

        timerTracks.update(5);
        expect(timerTracks.current.name).toBe("start");
        expect(timerTracks.current.progress).toBe(0);

        timerTracks.update(10);
        expect(timerTracks.current.name).toBe("start");
        expect(timerTracks.current.progress).toBe(0.5);

        timerTracks.update(15);
        expect(timerTracks.current.name).toBe("end");
        expect(timerTracks.current.progress).toBe(0);

        timerTracks.update(25);
        expect(timerTracks.current.name).toBe("end");
        expect(timerTracks.current.progress).toBe(0.5);

        timerTracks.update(35);
        expect(timerTracks.current.name).toBe("outro");
        expect(timerTracks.current.progress).toBe(0);
    });
});

describe("Advanced", () => {
    it("no duration update() should not increment current step", () => {
        const tracks = [
            { name: "intro", duration: 5 },
            { name: "start" },
            { name: "end" },
            { name: "outro" }
        ];

        const timerTracks = TimerTracks(tracks);

        timerTracks.update(0);
        expect(timerTracks.current.name).toBe("intro");

        timerTracks.update(5);
        expect(timerTracks.current.name).toBe("start");

        timerTracks.update(1000);
        expect(timerTracks.current.name).toBe("start");
    });
});
