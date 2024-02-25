// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const App = () => {
//   const [transcription, setTranscription] = useState('');
//   const [micState, setMicState] = useState(false);

//   const handleStartSpeechRecognition = () => {
//     setMicState(true);

//     const stream = navigator.mediaDevices.getUserMedia({ audio: true });
//     const recorder = new MediaStreamRecorder(stream);

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
//     <div>
//       <button onClick={micState ? handleStopSpeechRecognition : handleStartSpeechRecognition}>
//         {micState ? 'Stop Speech Recognition' : 'Start Speech Recognition'}
//       </button>
//       <div>
//         <p>{transcription}</p>
//       </div>
//     </div>
//   );
// };

// export default App;