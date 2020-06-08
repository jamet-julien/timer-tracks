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

        timerTracks.update(100);
        expect(timerTracks.current.name).toBe(null);
        expect(timerTracks.current.progress).toBe(0);
    });

    it("goto path", () => {
        const timerTracks = TimerTracks(tracks);

        timerTracks.goTo("end");

        timerTracks.update(50);
        expect(timerTracks.current.name).toBe("end");
        expect(timerTracks.current.progress).toBe(0);

        timerTracks.update(60);
        expect(timerTracks.current.name).toBe("end");
        expect(timerTracks.current.progress).toBe(0.5);

        timerTracks.update(70);
        expect(timerTracks.current.name).toBe("outro");
        expect(timerTracks.current.progress).toBe(0);
    });

    it("wrong goto", () => {
        const timerTracks = TimerTracks(tracks);

        timerTracks.goTo("wrong");

        timerTracks.update(0);
        expect(timerTracks.current.name).toBe(null);
        expect(timerTracks.current.progress).toBe(0);
    });

    it("navigate next / prev", () => {
        const timerTracks = TimerTracks(tracks);

        timerTracks.update(0);
        expect(timerTracks.current.name).toBe("intro");
        expect(timerTracks.current.progress).toBe(0);

        timerTracks.next();
        expect(timerTracks.current.name).toBe("start");
        expect(timerTracks.current.progress).toBe(0);

        timerTracks.next();
        expect(timerTracks.current.name).toBe("end");
        expect(timerTracks.current.progress).toBe(0);

        timerTracks.prev();
        expect(timerTracks.current.name).toBe("start");
        expect(timerTracks.current.progress).toBe(0);
    });

    it("limit next / prev", () => {
        const timerTracks = TimerTracks(tracks);

        timerTracks.update(0);
        expect(timerTracks.current.name).toBe("intro");
        expect(timerTracks.current.progress).toBe(0);

        timerTracks.prev();
        expect(timerTracks.current.name).toBe("intro");
        expect(timerTracks.current.progress).toBe(0);

        timerTracks.goTo("outro");
        expect(timerTracks.current.name).toBe("outro");
        expect(timerTracks.current.progress).toBe(0);

        timerTracks.next();
        expect(timerTracks.current.name).toBe(null);
        expect(timerTracks.current.progress).toBe(0);
    });

    it("update next / prev ", () => {
        const timerTracks = TimerTracks(tracks);

        timerTracks.update(0);
        expect(timerTracks.current.name).toBe("intro");
        expect(timerTracks.current.progress).toBe(0);

        timerTracks.next();
        timerTracks.update(10);
        expect(timerTracks.current.name).toBe("start");
        expect(timerTracks.current.progress).toBe(0);

        timerTracks.update(30);
        expect(timerTracks.current.name).toBe("end");
        expect(timerTracks.current.progress).toBe(0.5);

        timerTracks.prev();
        expect(timerTracks.current.name).toBe("start");
        expect(timerTracks.current.progress).toBe(0);
    });

    it("without duration value", () => {
        const tracks = [
            { name: "intro", duration: 5 },
            { name: "start" },
            { name: "end" },
            { name: "outro" }
        ];

        const timerTracks = TimerTracks(tracks);

        timerTracks.update(0);
        expect(timerTracks.current.name).toBe("intro");

        timerTracks.update(500);
        expect(timerTracks.current.name).toBe("start");

        timerTracks.goTo("end");
        timerTracks.update(1000);
        expect(timerTracks.current.name).toBe("end");
    });

    it("onLeave / onEnter ", () => {
        const onEnter_1 = jest.fn();
        const onLeave_1 = jest.fn();

        const onEnter_2 = jest.fn();
        const onLeave_2 = jest.fn();

        const tracks = [
            { name: "intro", duration: 10 },
            {
                name: "start",
                duration: 10,
                onEnter: onEnter_1,
                onLeave: onLeave_1
            },
            {
                name: "end",
                duration: 10,
                onEnter: onEnter_2,
                onLeave: onLeave_2
            },
            { name: "outro", duration: 10 }
        ];

        const timerTracks = TimerTracks(tracks);

        timerTracks.update(0); //intro
        timerTracks.update(5); //intro

        // intro ~ start
        timerTracks.update(15); //start
        expect(timerTracks.current.name).toBe("start");
        expect(onEnter_1).toHaveBeenCalledTimes(1); // ok

        // start ~ end
        timerTracks.update(25);
        expect(timerTracks.current.name).toBe("end");
        expect(onLeave_1).toHaveBeenCalledTimes(1); // ok
        expect(onEnter_2).toHaveBeenCalledTimes(1); // KO !

        //never
        expect(onLeave_2).toHaveBeenCalledTimes(0);
    });
});
