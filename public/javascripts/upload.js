// Handles the file upload form and sending it to /s/upload route

// listener for file input change (meaning there are files in it)
const fileInput = document.querySelector('#file-upload-field');
fileInput.onchange = () => {
  let files = [...fileInput.files];
  if (files.length > 0) {
    // create a FormData object which will be sent as the data payload in the
    // AJAX request
    var formData = new FormData() // loop through all the selected files and add them to the formData object
    for (var i = 0; i < files.length; i++) {
      var file = files[i] // add the files to formData object for the data payload
      formData.append('uploads[]', file, file.name)
    }
    // fetch here
    fetch('/s/upload', {
		method:'POST',
		body:formData	
	}).then(res => {
        return res.json();
    }).then( data => {
        // console.log(data);
        document.querySelector(".filelist-wrapper").insertAdjacentHTML("afterbegin", JSON.stringify(data));
    }).catch(function(e) {
		console.log('Error',e);
	});

    // $.ajax({
    //   url: '/s/upload',
    //   type: 'POST',
    //   data: formData,
    //   processData: false,
    //   contentType: false,
    //   success: function (data) {
    //     console.log('upload successful!\n' + data)
    //   },
    //   xhr: function () {
    //     // create an XMLHttpRequest
    //     var xhr = new XMLHttpRequest() // listen to the 'progress' event
    //     xhr.upload.addEventListener(
    //       'progress',
    //       function (evt) {
    //         if (evt.lengthComputable) {
    //           // calculate the percentage of upload completed
    //           var percentComplete = evt.loaded / evt.total
    //           percentComplete = parseInt(percentComplete * 100) // update the Bootstrap progress bar with the new percentage
    //           $('.progress-bar').text(percentComplete + '%')
    //           $('.progress-bar').width(percentComplete + '%') // once the upload reaches 100%, set the progress bar text to done
    //           if (percentComplete === 100) {
    //             $('.progress-bar').html('Done')
    //           }
    //         }
    //       },
    //       false
    //     )
    //     return xhr
    //   }
    // })
  }
};

// function stopDefault(event) {
//     event.preventDefault();
//     event.stopPropagation();
// }
// function dragOver(label, text) {
//     /* ADD ALMOST ANY STYLING YOU LIKE */
//     // label.style.animationName = "dropbox";
//     label.innerText = text;
// }
// function dragLeave(label) {
//     /* THIS SHOULD REMOVE ALL STYLING BY dragOver() */
//     var len = label.style.length;
//     for(var i = 0; i < len; i++) {
//         label.style[label.style[i]] = "";
//     }
//     label.innerText = "Click or drag-n-drop files here";
// }
// function addFilesAndSubmit(event) {
//     var files = event.target.files || event.dataTransfer.files;
//     document.getElementById("filesfld").files = files;
//     submitFilesForm(document.getElementById("filesfrm"));
// }
// function submitFilesForm(form) {
//     var label = document.getElementById("fileslbl");
//     dragOver(label, "Uploading files..."); // set the drop zone text and styling
//     var fd = new FormData();
//     for(var i = 0; i < form.filesfld.files.length; i++) {
//         var field = form.filesfld;
//         fd.append(field.name, field.files[i], field.files[i].name);
//     }
//     var progress = document.getElementById("progress");
//     var x = new XMLHttpRequest();
//     if(x.upload) {
//         x.upload.addEventListener("progress", function(event){
//             var percentage = parseInt(event.loaded / event.total * 100);
//             progress.innerText = progress.style.width = percentage + "%";
//         });
//     }
//     x.onreadystatechange = function () {
//         if(x.readyState == 4) {
//             progress.innerText = progress.style.width = "";
//             form.filesfld.value = "";
//             dragLeave(label); // this will reset the text and styling of the drop zone
//             if(x.status == 200) {
//                 var images = JSON.parse(x.responseText);
//                 for(var i = 0; i < images.length; i++) {
//                     var img = document.createElement("img");
//                     img.src = images[i];
//                     document.body.appendChild(img);
//                 }
//             }
//             else {
//                 // failed - TODO: Add code to handle server errors
//             }
//         }
//     };
//     x.open("post", form.action, true);
//     x.send(fd);
//     return false;
// }
