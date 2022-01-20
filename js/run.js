    // More API functions here:
    // https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image
   
    //initialize parse
    Parse.initialize(
        "6UWFMLoWnlezJ44ZfJwpnoENrlJRTOKVpR6pS7nk",
        "5IjUxwL1TElHCcKVkc1K3NwnJTnSSpRlVK7TVrNW"
      );
      Parse.serverURL = 'https://pg-app-2q6u5vo36uarcl0phkzy94tr14edtd.scalabl.cloud/1/';
          // the link to your model provided by Teachable Machine export panel
        const URL = "https://teachablemachine.withgoogle.com/models/_MlvaF8CF/";
          
          //declare variable and toggle the webcam button
          let model, webcam, newlabel, canvas, labelContainer, maxPredictions, camera_on = false, image_upload = false;
      
      function useWebcam() {
          camera_on = !camera_on;
      
          if (camera_on) {
              init();
              document.getElementById("webcam").innerHTML = "Close Webcam";
          }
          else {
              stopWebcam();
              document.getElementById("webcam").innerHTML = "Start Webcam";
          }
      }
      
      async function stopWebcam() {
          await webcam.stop();
          document.getElementById("webcam-container").removeChild(webcam.canvas);
          labelContainer.removeChild(newlabel);
      }
      // load the model and perform the prediction and display the class having highest probability.
      // Load the image model and setup the webcam
      async function init() {
      
      const modelURL = URL + "model.json";
      const metadataURL = URL + "metadata.json";
      
      // load the model and metadata
      model = await tmImage.load(modelURL, metadataURL);
      maxPredictions = model.getTotalClasses();
      
      // Convenience function to setup a webcam
      const flip = true; // whether to flip the webcam
      webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
      await webcam.setup(); // request access to the webcam
      await webcam.play();
      window.requestAnimationFrame(loop);
      
      // append element to the DOM
      document.getElementById("webcam-container").appendChild(webcam.canvas);
      
      newlabel = document.createElement("div");
      labelContainer = document.getElementById("label-container");
      labelContainer.appendChild(newlabel);
      }
      
      async function loop() {
      webcam.update(); // update the webcam frame
      await predict(webcam.canvas);
      window.requestAnimationFrame(loop);
      }
      
      // run the image through the image model
      async function predict(input) {
      // predict can take in an image, video or canvas html element
      const prediction = await model.predict(input);
      
      var highestVal = 0.00;
      var bestClass = "";
      result = document.getElementById("label-container");
      for (let i = 0; i < maxPredictions; i++) {
          var classPrediction = prediction[i].probability.toFixed(2);
          if (classPrediction > highestVal) {
              highestVal = classPrediction;
              bestClass = prediction[i].className;
          }
      }
      
      if (bestClass == "agapornis" || bestClass == "golondrina" || bestClass == "gorrion comun"|| bestClass=="periquito" || bestClass=="vencejo") {
          newlabel.className = "alert alert-warning";
      }
      else {
          newlabel.className = "alert alert-danger";
      }
      
      newlabel.innerHTML = bestClass;
      }
      
      //upload image using file picker
      $(document).ready(function () {
          $("#loadBtn").on("click", async function () {
      
              labelContainer = document.getElementById("label-container-cam");
      
              image_upload = !image_upload;
      
              if (!image_upload) {
                  labelContainer.removeChild(newlabel);
                  document.getElementById("uploadedImage").removeChild(canvas);
              }
      
              const fileUploadControl = $("#fruitimg")[0];
              if (fileUploadControl.files.length > 0) {
      
                  const modelURL = URL + "model.json";
                  const metadataURL = URL + "metadata.json";
      
                  // load the model and metadata
                  model = await tmImage.load(modelURL, metadataURL);
                  maxPredictions = model.getTotalClasses();
      
                  const file = fileUploadControl.files[0];
      
                  const name = "photo.jpg";
                  const parseFile = new Parse.File(name, file);
      
                  parseFile.save().then(async function () {
                      //The file has been saved to the Parse server
      
                      img = new Image(300, 300);
                      img.crossOrigin = "Anonymous";
                      img.addEventListener("load", getPredictions, false);
                      img.src = parseFile.url();
      
                  }, function (error) {
                      // The file either could not be read, or could not be saved to Parse.
                      result.innerHTML = "Error, no se ha podido subir la imagen!";
                  });
              }
              else {
                  result.innerHTML = "Ops, intentalo de nuevo!";
              }
          });
      });
      //Create canvas to display image
      async function getPredictions() {
      
      canvas = document.createElement("canvas");
      var context = canvas.getContext("2d");
      canvas.width = "300";
      canvas.height = "300";
      context.drawImage(img, 0, 0);
      document.getElementById("uploadedImage").appendChild(canvas);
      
      newlabel = document.createElement("div");
      labelContainer = document.getElementById("label-container-cam");
      labelContainer.appendChild(newlabel);
      
      await predict(canvas);
      }
