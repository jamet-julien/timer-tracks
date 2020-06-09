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

    it("TimerTracks() should return object", () => {
        const instance = TimerTracks();
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
    });
});

describe("More", () => {
    it("goTo() should move to right track", () => {
        const timerTracks = TimerTracks(tracks);

        timerTracks.goTo("end");
        expect(timerTracks.current.name).toBe("end");

        timerTracks.goTo("outro");
        expect(timerTracks.current.name).toBe("outro");
    });

    it("next() should navigate between tracks and init progress to 0", () => {
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
    });

    it("prev() should navigate between tracks and init progress to 0", () => {
        const timerTracks = TimerTracks(tracks);

        timerTracks.update(10); //intro
        timerTracks.update(15); //start
        timerTracks.update(25); //end

        timerTracks.prev();
        expect(timerTracks.current.name).toBe("start");
        expect(timerTracks.current.progress).toBe(0);

        timerTracks.prev();
        expect(timerTracks.current.name).toBe("intro");
        expect(timerTracks.current.progress).toBe(0);
    });

    it("onLeave() and onEnter() should be called when track changed", () => {
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

describe("Combo", () => {
    it("First call update() after goTo() should be init progress to 0", () => {
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

    it("First call update() after next() or prev() should be init progress to 0", () => {
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

        timerTracks.update(500);
        expect(timerTracks.current.name).toBe("start");

        timerTracks.goTo("end");
        timerTracks.update(1000);
        expect(timerTracks.current.name).toBe("end");
    });
});

describe("Exception", () => {
    it("last update() should return name NULL and progress 0", () => {
        const timerTracks = TimerTracks(tracks);
        timerTracks.update(0);

        timerTracks.update(100);
        expect(timerTracks.current.name).toBe(null);
        expect(timerTracks.current.progress).toBe(0);
    });

    it("wrong goTo() should return NULL", () => {
        const timerTracks = TimerTracks(tracks);

        timerTracks.goTo("wrong");

        timerTracks.update(0);
        expect(timerTracks.current.name).toBe(null);
        expect(timerTracks.current.progress).toBe(0);
    });

    it("prev() on start should return first track", () => {
        const timerTracks = TimerTracks(tracks);

        timerTracks.update(0);
        expect(timerTracks.current.name).toBe("intro");
        expect(timerTracks.current.progress).toBe(0);

        timerTracks.prev();
        expect(timerTracks.current.name).toBe("intro");
        expect(timerTracks.current.progress).toBe(0);
    });

    it("prev() on last should return NULL", () => {
        const timerTracks = TimerTracks(tracks);

        timerTracks.goTo("outro");
        expect(timerTracks.current.name).toBe("outro");
        expect(timerTracks.current.progress).toBe(0);

        timerTracks.next();
        expect(timerTracks.current.name).toBe(null);
        expect(timerTracks.current.progress).toBe(0);
    });

    it("onLeave() / onEnter() on born should be called", () => {
        const onEnter_1 = jest.fn();
        const onLeave_1 = jest.fn();

        const onEnter_2 = jest.fn();
        const onLeave_2 = jest.fn();

        const tracks = [
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
            }
        ];

        const timerTracks = TimerTracks(tracks);

        timerTracks.update(0);
        expect(timerTracks.current.name).toBe("start");
        expect(onEnter_1).toHaveBeenCalledTimes(1); // ok

        timerTracks.update(25);
        expect(timerTracks.current.name).toBe(null);
        expect(onLeave_2).toHaveBeenCalledTimes(1); // ok
    });
});

/*
    it("onLeave / onEnter goto", () => {
        const onEnter_1 = jest.fn();
        const onLeave_1 = jest.fn();

        const onEnter_2 = jest.fn();
        const onLeave_2 = jest.fn();

        const tracks = [
            { name: "intro" },
            {
                name: "start",
                duration: 10,
                onEnter: onEnter_1,
                onLeave: onLeave_1
            },
            { name: "end" },
            {
                name: "outro",
                duration: 10,
                onEnter: onEnter_2,
                onLeave: onLeave_2
            }
        ];

        const timerTracks = TimerTracks(tracks);

        timerTracks.goTo("outro");
        timerTracks.update(0);
        expect(timerTracks.current.name).toBe("outro");
        expect(onEnter_2).toHaveBeenCalledTimes(1); // ok

        timerTracks.goTo("start");
        timerTracks.update(0);
        expect(timerTracks.current.name).toBe("start");
        expect(onLeave_2).toHaveBeenCalledTimes(1); // ok
        expect(onEnter_1).toHaveBeenCalledTimes(1); // ok
    });
*/
