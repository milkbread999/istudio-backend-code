import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [transcription, setTranscription] = useState('');
  const [micState, setMicState] = useState(false);

  let recorder = null;
  let chunks = [];

  const handleStartSpeechRecognition = async () => {
    console.log("hello")
    setMicState(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      recorder.onstop = async () => {
        const audioData = new Blob(chunks, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('audioData', audioData);

        try {
          const response = await axios.post('http://localhost:5001/speech', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          setTranscription(response.data.transcription);
        } catch (error) {
          console.error(error);
        }
      };

      recorder.start();
    } catch (error) {
      console.error('Error accessing the microphone', error);
    }
  };

  const handleStopSpeechRecognition = () => {
    if (recorder) {
      recorder.stop();
      setMicState(false);
    }
  };

  return (
    <div className="SpeakingPractice">
      <button onClick={micState ? handleStopSpeechRecognition : handleStartSpeechRecognition}>
        {micState ? 'Stop Speech Recognition' : 'Start Speech Recognition'}
      </button>
      <div className="transcriptionDisplay">
        <p>Transcription:</p>
        <div className="transcriptionText">{transcription}</div>
      </div>
    </div>
  );
}

export default App;


// ----------------------------------------------------

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// function App() {
//   const [transcription, setTranscription] = useState('');
//   const [micState, setMicState] = useState(false);

//   var stream, recorder;

//   const handleStartSpeechRecognition = () => {
//     setMicState(true);

//     stream = navigator.mediaDevices.getUserMedia({ audio: true });
//     recorder = new MediaRecorder(stream);

//     recorder.ondataavailable = (event) => {
//       const chunks = [];
//       chunks.push(event.data);

//       recorder.onstop = () => {
//         const audioData = new Blob(chunks, { type: 'audio/webm' });
//         const formData = new FormData();
//         formData.append('audioData', audioData);

//         axios.post('http://localhost:5001/speech', formData, {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         })
//           .then((response) => {
//             const { transcription } = response.data;
//             setTranscription(transcription);
//           })
//           .catch((error) => {
//             console.error(error);
//           });
//       };

//       recorder.requestData();
//     };

//     recorder.start();
//   };

//   const handleStopSpeechRecognition = () => {
//     setMicState(false);

//     recorder.stop();
//   };

//   useEffect(() => {
//     if (!micState) return;

//     const handleData = (event) => {
//       const { results } = event;

//       if (results && results.length > 0) {
//         const transcription = results[0].alternatives[0].transcript;
//         setTranscription(transcription);
//       }
//     };

//     const recognizeStream = client.streamingRecognize();
//     recognizeStream.on('data', handleData);
//     recognizeStream.on('error', (error) => {
//       console.error(error);
//     });
//     recognizeStream.on('end', () => {
//       console.log('Speech recognition ended');
//     });
//   }, [micState]);

//   return (
//     <div className="SpeakingPractice">
//       <button onClick={micState ? handleStopSpeechRecognition : handleStartSpeechRecognition}>
//         {micState ? 'Stop Speech Recognition' : 'Start Speech Recognition'}
//       </button>
//       <div>
//         <p>{transcription}</p>
//       </div>
//       <div className="App">
//         <header className="App-header">
//           <img src={logo} className="App-logo" alt="logo" />
//           <p>
//             Edit <code>src/App.js</code> and save to reload.
//           </p>
//           <a
//             className="App-link"
//             href="https://reactjs.org"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Learn React
//           </a>
//         </header>
//       </div>
//     </div>

//     );
  
// };

// export default App;