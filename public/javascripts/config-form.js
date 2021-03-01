(function(w,d){
    const slateid = window.location.pathname.split("/").pop(),
          stopBTN = d.getElementById("stopPen"),
          resetBTN = d.getElementById("resetPen"),
          configForm = d.getElementById("golem-config-form"),
          runBTN = d.getElementById("submitPen");

    // console.log(slateid);

    function btnUIChange(changes){
        let {run,stop,res} = changes;
        !!run ? runBTN.removeAttribute("disabled") : runBTN.setAttribute('disabled','disabled');
        !!stop ? stopBTN.removeAttribute("disabled") : stopBTN.setAttribute('disabled','disabled');
        !!res ? resetBTN.removeAttribute("disabled") : resetBTN.setAttribute('disabled','disabled');
    }

    //- VALIDATION MESSAGE

    let img = d.querySelector("input#imageSelect");
    img.oninvalid = function(e) {
        this.setCustomValidity("");
        if (!this.validity.valid) {
            this.setCustomValidity("The image hash you entered is invalid.");
        }
    };
    img.oninput = function(e) {
        this.setCustomValidity("");
    };


    // RUN FUNCTIONALITY TO OUTPUT TO TERMINAL

    configForm.action = "/s/run/"+slateid;

    configForm.addEventListener('submit', event => {

        // Prevent the default form submit
        event.preventDefault();

        // toggle disabled
        btnUIChange({run:0,stop:1,res:0});

        // Store reference to form to make later code easier to read
        const form = event.target;	
        
        // Post data using the Fetch API, wait for the promise object before we send it to the terminal
        fetch(form.action, {
            method: form.method,
            body: new URLSearchParams(new FormData(form))
        }).then(res => {
            const reader = res.body.getReader();
            reader.read().then(function processText({ done, value }) {
                let receivedText = new TextDecoder().decode(value);

                let cleanedText = receivedText.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');

                slates.output.replaceRange(cleanedText, CodeMirror.Pos(slates.output.lastLine()));

                slates.output.scrollTo(0, slates.output.getScrollInfo().height);
                                    
                if (done) {
                    // console.log("Stream complete");
                    btnUIChange({run:1,stop:0,res:1});
                    return;
                }
                return reader.read().then(processText);
            });
        }).catch(err => {
            console.log('Error outputting stream: ' + err);
        });
    });

    // STOP FUNCTIONALITY TO OUTPUT TO TERMINAL

    stopBTN.addEventListener('click', event => {

        event.preventDefault();
        event.stopPropagation();

        // toggle disabled
        btnUIChange({run:0,stop:0,res:0});
        
        fetch("/s/stop/" + slateid, {
            method: 'GET',
        }).then(res => {
            const reader = res.body.getReader();
            reader.read().then(function processText({ done, value }) {
                let receivedText = new TextDecoder().decode(value);

                let cleanedText = receivedText.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');

                slates.output.replaceRange(cleanedText, CodeMirror.Pos(slates.output.lastLine()));

                slates.output.scrollTo(0, slates.output.getScrollInfo().height);
                                    
                if (done) {
                    // console.log("Stop complete");
                    btnUIChange({run:1,stop:0,res:1});
                    return;
                }
                return reader.read().then(processText);
            });
        }).catch(err => {
            console.log('Error outputting stream: ' + err);
        });
    });

        // STOP FUNCTIONALITY TO OUTPUT TO TERMINAL

    resetBTN.addEventListener('click', event => {

        event.preventDefault();
        event.stopPropagation();

        btnUIChange({run:0,stop:0,res:0});

        var r = confirm("Are you sure you want to reset your slate?");
        if (r == true) {
            fetch("/s/reset/" + slateid, {
                method: 'GET',
            }).then(res => {
                const reader = res.body.getReader();
                reader.read().then(function processText({ done, value }) {
                    let receivedText = new TextDecoder().decode(value);
    
                    let cleanedText = receivedText.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
    
                    slates.output.replaceRange(cleanedText, CodeMirror.Pos(slates.output.lastLine()));
    
                    slates.output.scrollTo(0, slates.output.getScrollInfo().height);
                                        
                    if (done) {
                        // console.log("Reset complete");
                        btnUIChange({run:1,stop:0,res:1});
                        return;
                    }
                    return reader.read().then(processText);
                });
            }).catch(err => {
                console.log('Error outputting stream: ' + err);
            });
        } else {
            return false;
        }
    });
})(window,document);