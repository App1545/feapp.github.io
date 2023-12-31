// import { render } from 'preact';
// import preactLogo from './assets/preact.svg';
// import './style.css';
// import { client } from "@gradio/client";
// export function App() {
	
// 	return (
// 		<div>
// 			<a href="https://preactjs.com" target="_blank">
// 				<img src={preactLogo} alt="Preact logo" height="160" width="160" />
// 			</a>
// 			<h1>Get Started building Vite-powered Preact Apps </h1>
// 			<section>
// 				<Resource
// 					title="Learn Preact"
// 					description="If you're new to Preact, try the interactive tutorial to learn important concepts"
// 					href="https://preactjs.com/tutorial"
// 				/>
// 				<Resource
// 					title="Differences to React"
// 					description="If you're coming from React, you may want to check out our docs to see where Preact differs"
// 					href="https://preactjs.com/guide/v10/differences-to-react"
// 				/>
// 				<Resource
// 					title="Learn Vite"
// 					description="To learn more about Vite and how you can customize it to fit your needs, take a look at their excellent documentation"
// 					href="https://vitejs.dev"
// 				/>
// 			</section>
// 			<script>
// 			const app = await client("Xintao/GFPGAN");
// 			console.log('app***',app)
// 			</script>
// 		</div>
// 	);
// }

// function Resource(props) {
// 	return (
// 		<a href={props.href} target="_blank" class="resource">
// 			<h2>{props.title}</h2>
// 			<p>{props.description}</p>
// 		</a>
// 	);
// }

// render(<App />, document.getElementById('app'));


// import { render } from 'preact';
// import preactLogo from './assets/preact.svg';
// import './style.css';
// import { client } from "@gradio/client";
// import { useEffect } from 'preact/hooks';

// export function App() {
//   // Using useEffect to call the Gradio client when the component mounts
//   useEffect(() => {
//     const initializeGradio = async () => {
//       try {
//         const app = await client("Xintao/GFPGAN");
//         console.log('app***', app);
//       } catch (error) {
//         console.error('Error initializing Gradio client:', error);
//       }
//     };

//     initializeGradio();
//   }, []);

//   // Rest of your component
//   return (
//     <div>
//       {/* JSX Markup */}
//     </div>
//   );
// }

// function Resource(props) {
//   return (
//     <a href={props.href} target="_blank" class="resource">
//       <h2>{props.title}</h2>
//       <p>{props.description}</p>
//     </a>
//   );
// }

// render(<App />, document.getElementById('app'));

import { h, Fragment } from 'preact';
import { useState } from 'preact/hooks';
import { render } from 'preact';
import { client } from "@gradio/client";
// import { client } from "https://cdn.jsdelivr.net/npm/@gradio/client@0.1.4/dist/index.min.js";
// import { client } from "https://cdn.jsdelivr.net/npm/@gradio/client@0.1.4/dist/index.min.js";

export function App() {
  const [base64Image, setBase64Image] = useState('');
  const [outputImageUrl, setOutputImageUrl] = useState('');


  const handleImageChange = (event) => {
    const file = event.target.files[0];
    console.log('file***********',file)
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Image(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = async () => {

   

    // try{
    //   const app = await client("https://xintao-gfpgan.hf.space/");
    //   // console.log('app',app);
    //   // console.log('base64Image****',base64Image)
    //   const result = await app.predict('/predict', [base64Image, 'v1.2', 2]);
    //   const output=JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(result.data, null, 2))[1]))['data'];
    //   //console.log('output',output);
    //   setOutputImageUrl(output)
  
    //   // Your async logic here
    //   console.log('Async function executed');
    
    // }catch(error){
    //   setOutputImageUrl(error)

    // }

    async function fetchDataWithRetry(retryCount = 3) {
      let attempts = 0;
      while (attempts < retryCount) {
          try {
            // console.log('base64Image*******',base64Image)
              const app = await client("https://xintao-gfpgan.hf.space/");
              const result = await app.predict('/predict', [base64Image, 'v1.2', 2]);
              const output = JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(result.data, null, 2))[1]))['data'];
              setOutputImageUrl(output);
              console.log('Async function executed');
              break; // Break out of the loop if successful
          } catch (error) {
              attempts++;
              console.error(`Attempt ${attempts} failed:`, error);
              if (attempts >= retryCount) {
                  setOutputImageUrl("Error after several retries");
                  break;
              }
          }
      }
  }
  
  // Call the function
  fetchDataWithRetry();
  


  
  
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} accept="image/*" />
      {base64Image && (
        <div>
          <img src={base64Image} alt="Uploaded Preview" width="400" height="400" />
          <p>Base64: {base64Image.substring(0, 50)}...</p>
          <button onClick={handleButtonClick}>Execute Async Function</button>
          <p>OutputImage</p>

          <img src={outputImageUrl} alt="Uploaded Preview" width="400" height="400" />

        </div>
      )}
    </div>
  );
}

render(<App />, document.getElementById('app'));


