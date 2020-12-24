// example output from the file upload. Multiple files will appear in the children array
// {
// 	"path": "/Users/mikecross/Projects/golem/golpen/files/",
// 	"name": "files",
// 	"children": [
// 		{
// 			"path": "/Users/mikecross/Projects/golem/golpen/files/Photo-Slide-Scanning-01.jpg",
// 			"name": "Photo-Slide-Scanning-01.jpg",
// 			"size": 23446,
// 			"extension": ".jpg",
// 			"type": "file"
// 		}
// 	],
// 	"size": 23446,
// 	"type": "directory"
// }

function getIcon(ext){
    let icon = "file-earmark";
    if(/\.png|gif|jpg|jpeg|ico|bmp|svg|tiff/.test(ext)){
        icon = "file-earmark-binary";
    }else if(/\.htm|html|ts|css|json|jsx|js/.test(ext)){
        icon = "file-earmark-code";
    }
    let svgclass = `bi-${icon}`; 
    return svgclass;
}

// DRAG-N-DROP FUNCTIONALITY

const dropArea = document.getElementById('file-upload-label');

;['dragenter', 'dragover'].forEach(eventName => {
  dropArea.addEventListener(eventName, highlight, false);
})

;['dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, unhighlight, false);
})

function highlight(e) {
  dropArea.classList.add('highlight');
}

function unhighlight(e) {
  dropArea.classList.remove('highlight');
}

// UPLOAD FUNCTIONALITY

// listener for file input change (meaning there are files in it)
const fileInput = document.querySelector('#file-upload-field');
fileInput.onchange = () => {
  let files = [...fileInput.files];
  if (files.length > 0) {

    var formData = new FormData() 
    for (var i = 0; i < files.length; i++) {
      var file = files[i]
      formData.append('uploads[]', file, file.name)
    }
    
    fetch('/s/upload', {
		method:'POST',
		body:formData	
	}).then(res => {
        return res.json();
    }).then( data => {
        let ul = document.createElement('ul');

        for (let file of data.children) {
            let li = document.createElement('li'),
                a = document.createElement("a"),
                i = document.createElement("i");

            a.textContent = `${file.name}`;
            a.className = 'file-link';
            i.className = `${getIcon(file.extension)}`;
            a.prepend(i);
            a.setAttribute('href', `/${file.path}`);
            li.appendChild(a);
            ul.appendChild(li);
        }
        let fileList = document.querySelector(".filelist-wrapper");
        fileList.innerHTML = "";
        fileList.appendChild(ul);

    }).catch(function(e) {
		console.log('Error',e);
	});
  }
};
