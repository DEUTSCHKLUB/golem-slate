(function(w,d){

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

    const configForm = d.getElementById("golem-config-form");
    configForm.addEventListener('submit', event => {

        // Prevent the default form submit
        event.preventDefault();

        // Store reference to form to make later code easier to read
        const form = event.target;	
        
        // Post data using the Fetch API, wait for the promise object before we send it to the terminal
        fetch(form.action, {
            method: form.method,
            body: new URLSearchParams(new FormData(form))
        }).then(res => {
            const reader = res.body.getReader();
            reader.read().then(function processText({ done, value }) {
                let receivedText = new TextDecoder().decode(value)
                slates.output.replaceRange(receivedText, CodeMirror.Pos(slates.output.lastLine()));

                slates.output.scrollTo(0, slates.output.getScrollInfo().height);
                                    
                if (done) {
                    console.log("Stream complete");
                    return;
                }
                return reader.read().then(processText);
            });
        }).catch(err => {
            console.log('Error outputting stream: ' + err);
        });
    });
})(window,document);