# timer-tracks

[![CircleCI Status](https://circleci.com/gh/jamet-julien/timer-tracks.svg?style=shield&circle-token=:circle-token)](https://circleci.com/gh/jamet-julien/timer-tracks)
![Codecov](https://img.shields.io/codecov/c/github/jamet-julien/timer-tracks)
[![npm](https://img.shields.io/npm/dt/timer-tracks.svg?style=flat-square)](https://www.npmjs.com/package/timer-tracks)
[![npm](https://img.shields.io/npm/v/timer-tracks.svg?style=flat-square)](https://www.npmjs.com/package/timer-tracks)
[![npm](https://img.shields.io/npm/l/timer-tracks.svg?style=flat-square)](https://github.com/jamet-julien/timer-tracks/blob/master/LICENSE)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

Timeline's controller with label to navigate

-   [Install](#install)
-   [Importing](#importing)
-   [Quick start](#quick)
-   [Methods](#methods)
    -   [.update(`num`)](#update)
    -   [.goTo(`name`)](#goTo)

## Install <a id="install"></a>

`npm i timer-tracks`  
or  
`yarn add timer-tracks`

---

### Importing <a id="importing"></a>

```js
import TimerTracks from "timer-tracks";
```

---

### Quick start<a id="Quick"></a>

Usage timer-tracks plugin.

```js
const tracks = [
    { name: "intro", duration: 5 },
    { name: "start", duration: 10 },
    { name: "end", duration: 5 },
    { name: "outro", duration: 20 }
];

const timerTracks = TimerTracks(tracks);

timerTracks.update(0);
timerTracks.current.name; //? intro
timerTracks.current.progress; //? 0

timerTracks.update(15);
timerTracks.current.name; //? start
timerTracks.current.progress; //? .5
```

---

## Methods <a id="methods"></a>

### .update(num) <a id="update"></a>

Set progress current track and update `current` attribute.

| argument | type     | Description       |
| :------- | :------- | :---------------- |
| `num`    | `number` | current progresse |

```js
timerTracks.update(0);
timerTracks.update(10);

timerTracks.current.name; //? start
timerTracks.current.progress; //? .5
```

### .goTo(name) <a id="goTo"></a>

Set current track with name.

| argument | type     | Description             |
| :------- | :------- | :---------------------- |
| `name`   | `string` | name's target on tracks |

```js
timerTracks.goto("end");
timerTracks.update(10);

timerTracks.current.name; //? end
timerTracks.current.progress; //? 0
```
