const revai = require('revai-node-sdk');
const mic = require('mic');
const readline = require('readline');


const token = '028E9Td0l7gIXZMHcsgZc-TYT83UE-OjxsEqcCpqXKyMcn7FoUavYkpZEk-yY4LrFc_Bj0tlo14SdWMdlNRBg2MIXmEmw';

// initialize client with audio configuration and access token
const audioConfig = new revai.AudioConfig(
    /* contentType */ "audio/x-raw",
    /* layout */      "interleaved",
    /* sample rate */ 16000,
    /* format */      "S16LE",
    /* channels */    1
);

// initialize microphone configuration
// note: microphone device id differs
// from system to system and can be obtained with
// arecord --list-devices and arecord --list-pcms
const micConfig = {
    /* sample rate */ rate: 16000,
    /* channels */    channels: 1,
    /* device id */   device: 'hw:0,0'
};

//KEYBOARD INPUT CODE
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });




var client = new revai.RevAiStreamingClient(token, audioConfig);

var micInstance = mic(micConfig);

// create microphone stream
var micStream = micInstance.getAudioStream();

// create event responses
client.on('close', (code, reason) => {
    console.log(`Connection closed, ${code}: ${reason}`);
});
client.on('httpResponse', code => {
    console.log(`Streaming client received http response with code: ${code}`);
});
client.on('connectFailed', error => {
    console.log(`Connection failed with error: ${error}`);
});
client.on('connect', connectionMessage => {
    console.log(`Connected with message: ${connectionMessage}`);
});
micStream.on('error', error => {
  console.log(`Microphone input stream error: ${error}`);
});

// begin streaming session
var stream = client.start();

const speecharray = [];

// create event responses
stream.on('data', data => {
    if (data.type == 'final')
        for (i in data.elements)
            speecharray.push(data.elements[i].value.toLowerCase());

            // umCount = speecharray.filter(value => value == "um");
            // console.log("um count:" + umCount.length);

            // uhCount = speecharray.filter(value => value == "uh");
            // console.log("uh count:" + uhCount.length)

            // score = (umCount.length + uhCount.length) / speecharray.length
            // console.log("score:" + score)


});

// listen for spacebar press to end streaming and display score
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

process.stdin.on('keypress', (str, key) => {
  if (key.name === 'return') {
    micInstance.stop(); // stop the microphone
    stream.end(); // end the streaming session

    // Calculate and display the score
    const weight = 4;
    const umCount = speecharray.filter(value => value === 'um').length;
    const uhCount = speecharray.filter(value => value === 'uh').length;
    const totalWords = speecharray.length;
    const score = ((umCount*weight + uhCount*weight) / totalWords) * 100;

    console.log(speecharray.join(" "));
    console.log(`Um count: ${umCount}`);
    console.log(`Uh count: ${uhCount}`);
    console.log(`Total words: ${totalWords}`);
    console.log(score)
    console.log(`Fluency: ${100 - score}%`);

    process.stdin.pause(); // pause stdin to stop listening for keypresses
  }
});



//on certain button press log it

stream.on('end', function () {
  console.log("End of Stream");
});

// pipe the microphone audio to Rev AI client
micStream.pipe(stream);

// start the microphone
micInstance.start();

// Forcibly ends the streaming session
// stream.end();