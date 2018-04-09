# [Sonic Umbrella](https://sonicumbrella.com)

## A WebVR experiment exploring spatial audio

![sonicumbrella](https://github.com/plan8/sonicumbrella/raw/master/app/assets/img/sonicumbrella.png)


In April 2017 Sonic Umbrella was released alongside other WebVR experiments by some other fantastic people as part of Google's WebVR Experiments platform.

## Setup

```bash
$ npm install
```
## Run

```bash
$ gulp
```

## Performance

Developing an experience that requires a lot of audio playback and processing on a handheld device is a challenge even without sharing resources with WebVR. As this experiment was developed to showcase audio in VR we decided to have a sort of audio first approach meaning that early on we decided that the graphics and physics should be scaled back before any audio features was. However it soon became clear that even with that approach compromises had to be made.

We thought it was a much better spatial experience using HRTF panners instead of equal power for the rain objects but also much more heavy on performance. Once the rain intensity was over a certain level you really couldn’t tell which object plays which sound. So at that level we switch to using equal power panners to save on performance, and when the rain is decreasing again we switch back to the HRTF ones.

Having individual sounds for all objects when it’s raining heavily would not be possible performance-wise and would also not sound as dense as we want. So we fade in an ambience loop to create that heavy rain sound.

Finally we had to limit the amount of voices being able to play back at once and made sure to always have a few slots open in our sound pool by first smoothly fading out audio sources when needed and, if there wasn’t time for that, abruptly stop them - something we tried to avoid.

## MIT License

Copyright © 2017 Plan8 Production

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

### Contributors

- [Rikard Lindström](https://github.com/rikard-io)
- [Andreas Jeppsson](https://github.com/andreas-plan8)
- [Oscar Tillman](https://github.com/OscarTillman)
- [Tor Castenson](https://github.com/torstah)
