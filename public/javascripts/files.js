let slateid = console.log(window.location.pathname.split("/").pop());

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

function showNotification(text, cl) {
    let n = document.createElement('div');
    n.className = `notify notify-${cl}`;
    n.innerHTML = text;
    document.querySelector('#editor-container').appendChild(n);
    setTimeout(() => {
        document.querySelector('#editor-container').removeChild(n);
    }, 2500);
}

function saveFile(){
    event.preventDefault();
    let fts = event.target.dataset.target,
        reqBody = {
            "content": window.slates.code.getValue(),
            "file": fts
        };
    fetch(`/f/${slateid}/save/`, {
        method:'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqBody)
    }).then(res => {
        return res.text();
    }).then( text => {
        // Send message to frontend
        showNotification(text, 'success');
        // If we need to rebuild the file list, we can...make sure the back end does it too:
        // buildFileList(data.children);
    }).catch(function(error) {
        showNotification('Could not save', 'fail');
    });
}

function createSaveButton(fileToSave){
    let a = document.createElement("a");
        a.textContent = 'Save File';
        a.className = 'btn save-link';
        a.onclick = saveFile;
        a.setAttribute('href', '#');
        a.setAttribute('data-target', `${fileToSave}`);
        document.querySelector('#editor-container').appendChild(a);
}

function loadEditFile(){
    event.preventDefault();
    let lnk = event.target,
        fto = event.target.dataset.target;
    fetch(`/f/${slateid}/${fto}`, {
        method:'get',
    }).then(res => {
        return res.text();
    }).then( text => {
        //- eventually, load this in the editor
        window.slates.code.setValue(text);
        // lnk.parentNode.classList.add('open-in-editor');
        createSaveButton(fto);
    }).catch(function(error) {
        console.log('Error',error);
    });
}

function buildFileList(filesList){
    let ul = document.createElement('ul');
    for ( let file of filesList ) {
        let li = document.createElement('li'),
            a = document.createElement("a"),
            i = document.createElement("i");

        a.textContent = `${file.name}`;
        a.className = 'file-link d-block';
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
        
        fetch(`/f/${slateid}/upload`, {
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

