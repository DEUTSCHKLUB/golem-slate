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

function loadEditFile(){
    event.preventDefault();
    fetch(`/f/${event.target.dataset.target}`, {
        method:'get',
    }).then(res => {
        return res.text();
    }).then( text => {
        //- eventually, load this in the editor
        window.slates.code.setValue(text);
        // figure out this indicator later
        // e.target.classList.add('open-in-editor');
    }).catch(function(e) {
        console.log('Error',e);
    });
}

function buildFileList(filesList){
    let ul = document.createElement('ul');
    for ( let file of filesList ) {
        let li = document.createElement('li'),
            a = document.createElement("a"),
            i = document.createElement("i");

        a.textContent = `${file.name}`;
        a.className = 'file-link';
        a.onclick = loadEditFile;
        i.className = `${getIcon(file.extension)}`;
        a.prepend(i);
        a.setAttribute('href', '#');
        a.setAttribute('data-target', `${file.name}`);
        li.appendChild(a);
        ul.appendChild(li);
    }
    let listwrap = document.querySelector(".filelist-wrapper");
    listwrap.innerHTML = "";
    listwrap.appendChild(ul);
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

// FILE UPLOAD FUNCTIONALITY

const fileInput = document.querySelector('#file-upload-field');
fileInput.onchange = () => {
    let files = [...fileInput.files];
    if (files.length > 0) {

        let formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            let file = files[i]
            formData.append('uploads[]', file, file.name)
        }
        
        fetch('/f/upload', {
            method:'POST',
            body:formData	
        }).then(res => {
            return res.json();
        }).then( data => {
            buildFileList(data.children);
        }).catch(function(e) {
            console.log('Error',e);
        });
    }
};

buildFileList(filesData);

